import type { NextConfig } from 'next';
const config: NextConfig = {
  // Allow both the loopback preview and the existing local network address.
  allowedDevOrigins: ['127.0.0.1', '198.18.1.255'],
  images: { unoptimized: true },
};
export default config;
