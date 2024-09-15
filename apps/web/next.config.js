/** @type {import('next').NextConfig} */


const nextConfig = {
  // distDir: 'dist',
  // async rewrites() {
  //   return [
  //     {
  //       source: '/sov-http',
  //       destination: 'http://localhost:12346/',
  //     },
  //     {
  //       source: '/sov-rpc',
  //       destination: 'http://localhost:12345/',
  //     },
  //   ]
  // },
  output:"export"
};

module.exports = {
  transpilePackages: ["@repo/ui"],
  ...nextConfig
};
