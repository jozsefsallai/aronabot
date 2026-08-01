import React from "react";
import { render, renderSvg } from "takumi-js";
import { GachaResult, type GachaResultProps } from "./components/result";
import { NOTOSANS_VARIABLE_BYTES } from "./preloaded-buffers";

const RENDER_OPTIONS = {
  width: 2240,
  height: 1280,
  fonts: [
    {
      name: "NotoSans",
      data: NOTOSANS_VARIABLE_BYTES,
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
