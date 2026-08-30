import type { ButtonContext } from "../core/handler/ButtonHandler";

import * as student from "./utils/student";
import * as skills from "./utils/skills";
import * as gacha from "./utils/gacha";

type ButtonHandler = (ctx: ButtonContext) => void | Promise<void>;

interface ButtonMeta {
  id: string;
}

interface ButtonData {
  meta: ButtonMeta;
  handler: ButtonHandler;
}

const handlers: ButtonData[] = [student, skills, gacha];

export default handlers;
