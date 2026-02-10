/** @type {import('next').NextConfig} */

const enableProdSourceMaps = process.env.NEXT_ENABLE_PROD_SOURCEMAPS === "true";
const nextConfig = {
  productionBrowserSourceMaps: enableProdSourceMaps,
  output: "standalone",
};

export default nextConfig;
