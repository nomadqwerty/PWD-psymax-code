/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_SIGNAL_HOST:
      "wss://[pwd-psymax-code-production-f927.up.railway.app]",
    NEXT_PUBLIC_CLIENT_HOST: "https://pwd-psymax-code.vercel.app",
  },
};

export default nextConfig;
