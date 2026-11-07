import type { NextConfig } from "next";
import { BG3_WIKI_IMAGE_PATTERN } from "./app/combat-tracker/_lib/bg3-wiki/bg3-wiki.images";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [BG3_WIKI_IMAGE_PATTERN],
  },
};
export default nextConfig;
