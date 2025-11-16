import z from "zod";

export const rawGameBanner = z.object({
  start: z.tuple([z.number().int(), z.number().int(), z.number().int()]),
  end: z.tuple([z.number().int(), z.number().int(), z.number().int()]),
  students: z.array(z.string()),
  freePulls: z.number().int().optional(),
});

export type RawGameBanner = z.infer<typeof rawGameBanner>;

export const addGameBannersPayload = z.object({
  banners: z.array(rawGameBanner),
});

export type AddGameBannersPayload = z.infer<typeof addGameBannersPayload>;

export const offsetGameBannersPayload = z.object({
  currentStart: z.tuple([z.number().int(), z.number().int(), z.number().int()]),
  offsetDays: z.number().int(),
});

export type OffsetGameBannersPayload = z.infer<typeof offsetGameBannersPayload>;
