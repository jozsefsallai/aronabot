import React from "react";
import satori from "satori";
import * as resvg from "@resvg/resvg-js";
import { GachaResult, type GachaResultProps } from "./components/result";
import { NOTOSANS_400_BYTES, NOTOSANS_700_BYTES } from "./preloaded-buffers";

export async function generateGachaResultSVG(
  props: GachaResultProps,
): Promise<string> {
  const svg = await satori(<GachaResult {...props} />, {
    width: 1120,
    height: 640,
    fonts: [
      {
        name: "NotoSans",
        data: NOTOSANS_400_BYTES,
        weight: 400,
        style: "normal",
      },
      {
        name: "NotoSansBold",
        data: NOTOSANS_700_BYTES,
        weight: 700,
        style: "normal",
      },
    ],
  });

  return svg;
}

export async function generateGachaResult(
  props: GachaResultProps,
): Promise<Buffer> {
  const svg = await generateGachaResultSVG(props);
  const renderer = new resvg.Resvg(svg, {
    fitTo: {
      mode: "width",
      value: 1120,
    },
  });

  const image = renderer.render();
  const png = image.asPng();
  return png;
}
