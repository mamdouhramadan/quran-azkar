import type { NextConfig } from "next";

const isGithubActions = process.env.GITHUB_ACTIONS === "true";
const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const basePath = isGithubActions && repositoryName ? `/${repositoryName}` : "";

// nextConfig pins the Turbopack root so nested workspace lockfiles do not confuse Next.js.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath,
  assetPrefix: basePath || undefined,
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
