import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Other configurations... */
  allowedDevOrigins: [
    'https://your-ngrok-url.ngrok-free.app', // Replace with your actual ngrok URL
  ],
};

export default nextConfig;