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

// images: {
//   domains: ['splurjj.scaleupdevagency.com', 'dynamic-splurjj.scaleupdevagency.com', 'www.qetalyqynami.info', 'https://www.qetalyqynami.info', 'img1.hscicdn.com' , 'www.ninyzysiripybu.co.uk'],
// },
