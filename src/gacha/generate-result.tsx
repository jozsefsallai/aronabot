import React from "react";
import { render, renderSvg } from "takumi-js";
import { GachaResult, type GachaResultProps } from "./components/result";
import { NOTOSANS_400_BYTES, NOTOSANS_700_BYTES } from "./preloaded-buffers";

const RENDER_OPTIONS = {
  width: 1120,
  height: 640,
  fonts: [
    {
      name: "NotoSans",
      data: NOTOSANS_400_BYTES,
      weight: 400,
      style: "normal" as const,
    },
    {
      name: "NotoSansBold",
      data: NOTOSANS_700_BYTES,
      weight: 700,
      style: "normal" as const,
    },
  ],
};

export async function generateGachaResultSVG(
  props: GachaResultProps,
): Promise<string> {
  return renderSvg(<GachaResult {...props} />, RENDER_OPTIONS);
}

export async function generateGachaResult(
  props: GachaResultProps,
): Promise<Buffer> {
  const png = await render(<GachaResult {...props} />, {
    ...RENDER_OPTIONS,
    format: "png",
  });

  return Buffer.from(png);
}
