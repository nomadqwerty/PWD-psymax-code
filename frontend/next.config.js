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
    accPass: 'T+kst&~N6ah$%2CsqoDzuWsE',
    NEXT_PUBLIC_PAGINATION_LIMIT: '10',
    // NEXT_PUBLIC_SIGNAL_HOST: 'http://localhost:3050',
    // NEXT_PUBLIC_SIGNAL_HOST:
    //   '',
    NEXT_PUBLIC_API_HOST: 'https://34.175.225.136/api',
    // NEXT_PUBLIC_API_HOST:
    //   '',
    // NEXT_PUBLIC_API_HOST: '/api',
    NEXT_PUBLIC_LOGOUT_TIMER: '10',
    NEXT_PUBLIC_DUAL_KEY_ONE: '',
    NEXT_PUBLIC_DUAL_KEY_TWO: '',
    NEXT_PUBLIC_MAX_FILE_SIZE: '52428800',
    NEXT_PUBLIC_CLIENT_HOST: '',
    // NEXT_PUBLIC_CLIENT_HOST: '',
    NEXT_PUBLIC_RTC_HOST: '',
    // NEXT_PUBLIC_RTC_HOST: '',
    NEXT_PUBLIC_PRICING_GLOBAL: '69',
    NEXT_PUBLIC_PRICING_GLOBAL_EXTENDED: '99',
    NEXT_PUBLIC_PRICING_VAT_PERCENTAGE: '19',
    NEXT_DAYS_PER_CYCLE: '28',
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.module.rules.push({
      test: /\.wasm$/,
      loader: 'base64-loader',
      type: 'javascript/auto',
    });

    config.module.noParse = /\.wasm$/;

    config.module.rules.forEach((rule) => {
      (rule.oneOf || []).forEach((oneOf) => {
        if (oneOf.loader && oneOf.loader.indexOf('file-loader') >= 0) {
          oneOf.exclude.push(/\.wasm$/);
        }
      });
    });

    if (!isServer) {
      config.resolve.fallback.fs = false;
    }

    // Perform customizations to webpack config
    config.plugins.push(
      new webpack.IgnorePlugin({ resourceRegExp: /\/__tests__\// })
    );

    // Important: return the modified config
    return config;
  },
};
