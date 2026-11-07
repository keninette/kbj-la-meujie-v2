import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Character pictures fetched from the BG3 wiki
    remotePatterns: [
      { protocol: "https", hostname: "bg3.wiki", pathname: "/w/images/**" },
    ],
  },
};
export default nextConfig;
