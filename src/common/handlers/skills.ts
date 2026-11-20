import {
  ActionRowBuilder,
  type APIEmbedField,
  type BaseMessageOptions,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  escapeMarkdown,
} from "discord.js";
import type { Student } from "../../db/client";
import {
  findStudentSkills,
  type StudentSkillsView,
  type StudentSkillView,
} from "../../db/skills";
import { t } from "../../utils/localizeTable";
import {
  parseSkillMarkup,
  type SkillMarkupNode,
} from "../../utils/skill-markup";
import {
  getAttackTypeColor,
  getPortraitUrl,
  getSchaleDBUrl,
} from "../../utils/student-utils";

const MAX_TITLE = 256;
const MAX_FIELDS = 25;
const MAX_FIELD_NAME = 256;
const MAX_FIELD_VALUE = 1024;
const MAX_EMBED_LENGTH = 6000;

const RANGE_SEPARATOR = "~";
const NUMBER_WITH_UNIT = /^(\D*?)(-?\d[\d.,]*)(.*)$/;

type Effects = StudentSkillsView["effects"];

type FieldGroup = APIEmbedField[];

function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

function levels(skill: StudentSkillView): number[] {
  return Array.from({ length: skill.maxLevel }, (_, i) => i + 1);
}

function formatRange(values: string[]): string {
  if (values.length === 0) {
    return "";
  }

  const first = values[0];
  const last = values[values.length - 1];
  if (first === last) {
    return first;
  }

  const a = NUMBER_WITH_UNIT.exec(first);
  const b = NUMBER_WITH_UNIT.exec(last);
  if (a && b && a[1] === b[1] && a[3] === b[3] && a[3].length > 1) {
    return `${a[1]}${a[2]}${RANGE_SEPARATOR}${b[2]}${a[3]}`;
  }

  return `${first}${RANGE_SEPARATOR}${last}`;
}

function paramRange(
  skill: StudentSkillView,
  index: number,
  format: (value: string) => string = (value) => value,
): { range: string; firstLevel: number } {
  const values: string[] = [];
  let firstLevel: number | null = null;

  for (const level of levels(skill)) {
    const value = skill.params[level - 1]?.[index];
    if (value === undefined) {
      continue;
    }

    firstLevel ??= level;
    values.push(format(value));
  }

  return {
    range: `**${escapeMarkdown(formatRange(values))}**`,
    firstLevel: firstLevel ?? 1,
  };
}

const LEVEL_MARKER = /\uE000(\d+)\uE000/g;
const levelMarker = (level: number) =>
  level > 1 ? `\uE000${level}\uE000` : "";

function annotateLines(text: string): string {
  return text
    .split("\n")
    .map((line) => {
      const marked = [...line.matchAll(LEVEL_MARKER)].map((m) => Number(m[1]));
      const clean = line.replace(LEVEL_MARKER, "");
      return marked.length > 0
        ? `${clean} *(Lv. ${Math.max(...marked)}+)*`
        : clean;
    })
    .join("\n");
}

function renderNodes(
  nodes: SkillMarkupNode[],
  skill: StudentSkillView,
  effects: Effects,
): string {
  return nodes
    .map((node) => {
      switch (node.kind) {
        case "text":
          return escapeMarkdown(node.text);
        case "param": {
          const { range, firstLevel } = paramRange(skill, node.index);
          return `${range}${levelMarker(firstLevel)}`;
        }
        case "suffix": {
          const effect = effects[node.id];
          // The suffix must match the template's language.
          const suffix = (
            skill.isFallback ? effect?.fallbackText : effect?.text
          )?.suffix;
          const { range, firstLevel } = paramRange(
            skill,
            node.index,
            (value) => (suffix ? suffix.replace("[0]", value) : value),
          );
          return ` (${range})${levelMarker(firstLevel)}`;
        }
        case "effect":
        case "stat":
          return renderNodes(node.children, skill, effects);
      }

      return "";
    })
    .join("");
}

function describeSkill(
  skill: StudentSkillView,
  effects: Effects,
  hasChildren: boolean,
): string {
  const empty = hasChildren
    ? "*Uses one of the skills below.*"
    : "*No description.*";

  const template = skill.templates[skill.levelTemplates[skill.maxLevel - 1]];
  if (!template) {
    return empty;
  }

  const description = annotateLines(
    renderNodes(parseSkillMarkup(template), skill, effects),
  ).trim();

  return description || empty;
}

function skillLabel(skill: StudentSkillView): string {
  if (skill.useCondition) {
    return skill.useCondition;
  }

  if (skill.source === "Additional") {
    return "Additional";
  }

  return t(`skillType.${skill.type}`);
}

function skillFieldName(
  skill: StudentSkillView,
  depth: number,
  forms: number[],
): string {
  const parts = [`${skillLabel(skill)}: ${skill.name}`];

  if (skill.type === "EX") {
    const costs = levels(skill)
      .map((level) => skill.costs[level - 1])
      .filter((cost) => cost !== undefined)
      .map(String);

    if (costs.length > 0) {
      parts.push(`(Cost ${formatRange(costs)})`);
    }
  }

  if (skill.requiredWeaponGrade > 0) {
    parts.push(`[UE ${skill.requiredWeaponGrade}★]`);
  }

  if (skill.requiredGearTier > 0) {
    parts.push(`[Bond Gear T${skill.requiredGearTier}]`);
  }

  const inForms = forms.filter((f) => skill.formIndices.includes(f));
  if (forms.length > 1 && inForms.length < forms.length) {
    const label = inForms.length === 1 ? "Stance" : "Stances";
    parts.push(`[${label} ${inForms.map((f) => f + 1).join(", ")}]`);
  }

  const prefix = "↪️".repeat(depth) + (depth > 0 ? " " : "");
  return truncate(`${prefix}${parts.join(" ")}`, MAX_FIELD_NAME);
}

function splitText(text: string, max: number): string[] {
  const chunks: string[] = [];
  let current = "";

  const push = () => {
    if (current) {
      chunks.push(current);
    }
    current = "";
  };

  for (const line of text.split("\n")) {
    const candidate = current ? `${current}\n${line}` : line;
    if (candidate.length <= max) {
      current = candidate;
      continue;
    }

    push();

    let rest = line;
    while (rest.length > max) {
      chunks.push(rest.slice(0, max));
      rest = rest.slice(max);
    }
    current = rest;
  }

  push();
  return chunks;
}

function skillFields(name: string, description: string): APIEmbedField[] {
  return splitText(description, MAX_FIELD_VALUE).map((value, i) => ({
    name: i === 0 ? name : truncate(`${name} (cont.)`, MAX_FIELD_NAME),
    value,
  }));
}

function buildFieldGroups(
  skills: StudentSkillView[],
  effects: Effects,
  forms: number[],
): FieldGroup[] {
  const ids = new Set(skills.map((s) => s.id));
  const listed = new Set<string>();

  const add = (group: FieldGroup, skill: StudentSkillView, depth: number) => {
    if (listed.has(skill.id)) {
      return;
    }
    listed.add(skill.id);

    const children = skills.filter((s) => s.parentId === skill.id);
    group.push(
      ...skillFields(
        skillFieldName(skill, depth, forms),
        describeSkill(skill, effects, children.length > 0),
      ),
    );

    for (const upgrade of skills) {
      if (upgrade.upgradeOfId === skill.id && !upgrade.parentId) {
        add(group, upgrade, depth);
      }
    }

    for (const child of children) {
      add(group, child, depth + 1);
    }
  };

  const groups: FieldGroup[] = [];

  for (const skill of skills) {
    const isTopLevel =
      (!skill.parentId || !ids.has(skill.parentId)) &&
      (!skill.upgradeOfId || !ids.has(skill.upgradeOfId));

    if (isTopLevel && !listed.has(skill.id)) {
      const group: FieldGroup = [];
      add(group, skill, 0);
      groups.push(group);
    }
  }

  for (const skill of skills) {
    if (!listed.has(skill.id)) {
      const group: FieldGroup = [];
      add(group, skill, 0);
      groups.push(group);
    }
  }

  return groups;
}

const fieldLength = (field: APIEmbedField) =>
  field.name.length + field.value.length;

function paginate(groups: FieldGroup[], budget: number): APIEmbedField[][] {
  const pages: APIEmbedField[][] = [];
  let page: APIEmbedField[] = [];
  let length = 0;

  const fits = (count: number, size: number) =>
    page.length + count <= MAX_FIELDS && length + size <= budget;

  const flush = () => {
    if (page.length > 0) {
      pages.push(page);
    }
    page = [];
    length = 0;
  };

  for (const group of groups) {
    const size = group.reduce((sum, field) => sum + fieldLength(field), 0);

    if (!fits(group.length, size)) {
      flush();
    }

    for (const field of group) {
      if (!fits(1, fieldLength(field))) {
        flush();
      }

      page.push(field);
      length += fieldLength(field);
    }
  }

  flush();
  return pages;
}

function mergeAcrossForms(skills: StudentSkillView[]): StudentSkillView[] {
  const byId = new Map(skills.map((s) => [s.id, s]));

  const contentKeys = new Map<string, string>();
  const contentKey = (skill: StudentSkillView, seen: Set<string>): string => {
    const cached = contentKeys.get(skill.id);
    if (cached !== undefined) {
      return cached;
    }
    if (seen.has(skill.id)) {
      return skill.id;
    }
    seen.add(skill.id);

    const under = skills
      .filter((s) => s.parentId === skill.id || s.upgradeOfId === skill.id)
      .map((s) => contentKey(s, seen))
      .sort();

    const key = JSON.stringify([
      skill.type,
      skill.source === "Form" ? "Default" : skill.source,
      skill.requiredWeaponGrade,
      skill.requiredGearTier,
      skill.maxLevel,
      skill.costs,
      skill.name,
      skill.templates,
      skill.levelTemplates,
      skill.params,
      skill.useCondition,
      under,
    ]);
    contentKeys.set(skill.id, key);
    return key;
  };

  const placementKeys = new Map<string, string>();
  const placementKey = (skill: StudentSkillView, depth = 0): string => {
    const cached = placementKeys.get(skill.id);
    if (cached !== undefined) {
      return cached;
    }

    const above = (id: string | null) => {
      const s = id ? byId.get(id) : undefined;
      return s && depth < 16 ? placementKey(s, depth + 1) : null;
    };

    const key = JSON.stringify([
      contentKey(skill, new Set()),
      above(skill.parentId),
      above(skill.upgradeOfId),
    ]);
    placementKeys.set(skill.id, key);
    return key;
  };

  const kept = new Map<string, StudentSkillView>();
  const remap = new Map<string, string>();

  for (const skill of skills) {
    const key = placementKey(skill);
    const existing = kept.get(key);

    if (existing) {
      existing.formIndices = [
        ...new Set([...existing.formIndices, ...skill.formIndices]),
      ].sort((a, b) => a - b);
      remap.set(skill.id, existing.id);
    } else {
      kept.set(key, { ...skill, formIndices: [...skill.formIndices] });
    }
  }

  return [...kept.values()].map((skill) => ({
    ...skill,
    parentId: skill.parentId
      ? (remap.get(skill.parentId) ?? skill.parentId)
      : null,
    upgradeOfId: skill.upgradeOfId
      ? (remap.get(skill.upgradeOfId) ?? skill.upgradeOfId)
      : null,
  }));
}

export const handleStudentSkillsCommand = async (
  student: Student,
  requestedPage = 0,
): Promise<BaseMessageOptions> => {
  const { skills, effects } = await findStudentSkills(student.id);

  if (skills.length === 0) {
    return {
      content: `${student.name} currently does not have skill data.`,
      embeds: [],
      components: [],
    };
  }

  const forms = [...new Set(skills.flatMap((s) => s.formIndices))].sort(
    (a, b) => a - b,
  );

  const title = truncate(`${student.name} Skills`, MAX_TITLE);

  const notes: string[] = [];
  if (skills.some((s) => s.isFallback)) {
    notes.push("Some skills are not translated yet and are shown in Japanese.");
  }

  const pageNote = (page: number, total: number) =>
    total > 1 ? ` Page ${page + 1}/${total}.` : "";
  const reserved = title.length + notes.join(" ").length + 32;

  const pages = paginate(
    buildFieldGroups(mergeAcrossForms(skills), effects, forms),
    MAX_EMBED_LENGTH - reserved,
  );
  const page = Math.min(Math.max(requestedPage, 0), pages.length - 1);

  let embed = new EmbedBuilder()
    .setTitle(title)
    .setURL(getSchaleDBUrl(student))
    .setThumbnail(getPortraitUrl(student))
    .addFields(pages[page] ?? []);

  const footer = `${notes.join(" ")}${pageNote(page, pages.length)}`.trim();
  if (footer) {
    embed = embed.setFooter({ text: footer });
  }

  if (student.attackType) {
    embed = embed.setColor(getAttackTypeColor(student.attackType).toArray());
  }

  const buttons = [
    new ButtonBuilder()
      .setCustomId(`student_${student.id}`)
      .setLabel("Student Details")
      .setStyle(ButtonStyle.Primary),
  ];

  if (pages.length > 1) {
    buttons.push(
      new ButtonBuilder()
        .setCustomId(`skills_${student.id}:${page - 1}`)
        .setLabel("◀ Previous")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(page === 0),
      new ButtonBuilder()
        .setCustomId(`skills_${student.id}:${page + 1}`)
        .setLabel("Next ▶")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(page === pages.length - 1),
    );
  }

  return {
    content: "",
    embeds: [embed],
    components: [new ActionRowBuilder<ButtonBuilder>().addComponents(buttons)],
  };
};
