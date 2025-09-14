// /** @type {import('next').NextConfig} */
// const nextConfig = {

//   images: {
//   remotePatterns: [
//     {
//       protocol: 'https || http',
//       hostname: 'dynamic-splurjj.scaleupdevagency.com',
//       port: '',
//       pathname: '**',
//     },
//   ],
// }
// };

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },

};

export default nextConfig;
