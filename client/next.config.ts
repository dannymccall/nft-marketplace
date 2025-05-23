import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ivory-casual-wasp-800.mypinata.cloud",
        pathname: "/ipfs/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/palmertech/image/upload/v1747410229/nft/**",
      },
    ],
  },
};

export default nextConfig;
