module.exports = {
  output: 'standalone',
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  rewrites() {
    return [
      {
        source: '/api/:path*',
        destination:
          process.env.NODE_ENV === 'development'
            ? 'http://localhost:4000/api/:path*'
            : 'http://backend:4000/api/:path*',
      },
    ];
  },
  env: {
    NEXT_PUBLIC_PAGINATION_LIMIT: '10',
    // NEXT_PUBLIC_API_HOST: "http://localhost:4000/api",
    NEXT_PUBLIC_API_HOST: '/api',
    NEXT_PUBLIC_LOGOUT_TIMER: '10',
  },
};
