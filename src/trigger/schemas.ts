import z from "zod";
import { BannerKind } from "../db/client";

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

export const rawBanner = z.object({
  id: z.string(),
  name: z.string(),
  isPickup: z.boolean(),
  isFest: z.boolean(),
  kind: z.enum(BannerKind),
  pickupStudents: z.array(z.string()).optional(),
  extraStudents: z.array(z.string()).optional(),
  additionalThreeStarStudents: z.array(z.string()).optional(),
});

export type RawBanner = z.infer<typeof rawBanner>;

export const setBannersPayload = z.object({
  banners: z.array(rawBanner),
});

export type SetBannersPayload = z.infer<typeof setBannersPayload>;
