/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_SIGNAL_HOST: 'wss://signal-production-f3ee.up.railway.app',
    NEXT_PUBLIC_CLIENT_HOST: 'http://localhost:3000',
  },
};

export default nextConfig;
