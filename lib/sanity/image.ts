import { createImageUrlBuilder } from "@sanity/image-url";
import { sanityClient } from "./client";

const builder = createImageUrlBuilder(sanityClient);

export type SanityImageSource =
  | {
      _type: "image";
      asset: {
        _ref?: string;
        _type: "reference";
      };
      [key: string]: unknown;
    }
  | {
      _type: "reference";
      _ref: string;
    }
  | string;

export function urlFor(source: SanityImageSource | null | undefined) {
  if (!source) {
    throw new Error("Image source is required");
  }
  return builder.image(source);
}
