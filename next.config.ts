import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [{ hostname: "nwl2wpde9w.ufs.sh" }],
    minimumCacheTTL: 60,
  },
};

export default nextConfig;
