/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['s.gravatar.com', 'cdn.auth0.com'],
  },
  env: {
    NEXT_PUBLIC_BACKEND_URL: process.env.BACKEND_URL
  },

  reactStrictMode: true,
  images: {
    domains: ['s.gravatar.com', 'cdn.auth0.com'],
  },
};

module.exports = nextConfig;
