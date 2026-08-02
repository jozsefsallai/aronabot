import { findById as findBannerById } from "../db/banners";
import type { BannerCounterKind } from "../db/client";
import type { CardProps } from "../gacha/components/card";
import {
  generateGachaResult,
  generateGachaResultSVG,
} from "../gacha/generate-result";

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export async function gachaUiHandler(req: Request) {
  const url = new URL(req.url);

  const pickup = url.searchParams.get("pickup");

  if (!pickup) {
    return Response.json(
      {
        error: "No pickup provided",
      },
      {
        status: 400,
      },
    );
  }

  const rawType = (url.searchParams.get("type") ?? "points") as
    | "points"
    | "charge";
  const type = capitalize(rawType) as BannerCounterKind;

  const charge = url.searchParams.get("charge") ?? "0";
  const points = url.searchParams.get("points") ?? "0";

  const format = url.searchParams.get("format") ?? "svg";

  const banner = await findBannerById(pickup);

  if (!banner) {
    return Response.json(
      {
        error: "Banner not found",
      },
      {
        status: 404,
      },
    );
  }

  const cards: CardProps[] = [];

  try {
    const students = banner.pullTen();

    for (const [student, key] of students) {
      cards.push({
        student,
        isPickup: banner.isPickup(key),
      });
    }
  } catch (error) {
    return Response.json(
      {
        error: "Failed to pull cards",
      },
      {
        status: 500,
      },
    );
  }

  const pickupStudents = banner.pickupStudents;

  try {
    if (format === "svg") {
      const svg = await generateGachaResultSVG({
        cards,
        type,
        pickupStudent: pickupStudents[0],
        points: points ? Number.parseInt(points) : undefined,
        charge: charge ? Number.parseInt(charge) : undefined,
        bannerChargeCategory: banner.chargeCategory,
      });

      return new Response(svg, {
        headers: {
          "Content-Type": "image/svg+xml",
        },
      });
    }

    if (format === "png") {
      const png = await generateGachaResult({
        cards,
        type,
        pickupStudent: pickupStudents[0],
        points: points ? Number.parseInt(points) : undefined,
        charge: charge ? Number.parseInt(charge) : undefined,
        bannerChargeCategory: banner.chargeCategory,
      });

      return new Response(Buffer.from(png), {
        headers: {
          "Content-Type": "image/png",
        },
      });
    }

    return Response.json(
      {
        error: "Invalid format",
      },
      {
        status: 400,
      },
    );
  } catch (error) {
    return Response.json(
      {
        error: "Failed to generate gacha result",
      },
      {
        status: 500,
      },
    );
  }
}
