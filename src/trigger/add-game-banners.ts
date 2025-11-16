import { logger, task } from "@trigger.dev/sdk";
import {
  addGameBannersPayload,
  type AddGameBannersPayload,
  type RawGameBanner,
} from "./schemas";
import { db } from "../db/client";
import type { Student } from "@prisma/client";

export const addGameBannersTask = task({
  id: "add-game-banners",
  run: async (payload: AddGameBannersPayload) => {
    let banners: RawGameBanner[];

    try {
      const parsed = addGameBannersPayload.parse(payload);
      banners = parsed.banners;
    } catch (err) {
      logger.error("Invalid payload for addGameBannersTask", {
        error: err,
      });

      return;
    }

    const students = await db.student.findMany();

    for (const banner of banners) {
      const startDate = new Date(
        Date.UTC(
          banner.start[0],
          banner.start[1] - 1,
          banner.start[2],
          2,
          0,
          0,
        ),
      );

      const endDate = new Date(
        Date.UTC(banner.end[0], banner.end[1] - 1, banner.end[2], 1, 59, 59),
      );

      const studentsToAdd: Student[] = [];

      for (const studentId of banner.students) {
        const student = students.find((s) => s.id === studentId);

        if (student) {
          studentsToAdd.push(student);
        } else {
          console.warn(`Student not found: ${studentId}`);
        }
      }

      await db.gameBanner.create({
        data: {
          startDate,
          endDate,
          pickupStudents: {
            connect: studentsToAdd.map((s) => ({ id: s.id })),
          },
          freePulls: banner.freePulls,
        },
      });

      const studentNames = studentsToAdd.map((s) => s.name).join(", ");

      logger.info(
        `Created game banner from ${startDate.toISOString()} to ${endDate.toISOString()} for students: ${studentNames}`,
      );
    }
  },
});
