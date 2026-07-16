/**
 * Base path configuration for GitHub Pages deployment.
 * When deploying to GitHub Pages at https://huenying.github.io/ai-tarot/,
 * the basePath must match the repo name.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "/ai-tarot";

export function withBasePath(path: string): string {
  if (path.startsWith("/")) {
    return `${BASE_PATH}${path}`;
  }
  return `${BASE_PATH}/${path}`;
}
