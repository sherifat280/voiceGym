// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const isVercel = !!process.env['VERCEL'];
// GitHub Pages is static hosting: no server, so we prerender every route to HTML.
const isGithubPages = !!process.env['GITHUB_PAGES'];

const routes = [
  "/",
  "/auth",
  "/dashboard",
  "/practice",
  "/pronunciation",
  "/progress",
  "/achievements",
];

export default defineConfig({
  ...(isVercel ? { nitro: { preset: "vercel" as const } } : {}),
  ...(isGithubPages ? { nitro: { preset: "static" as const } } : {}),
  tanstackStart: {
    vite: {
      base: process.env['VITE_BASE_PATH'] || process.env['BASE_URL'] || "/",
    },
    ...(isGithubPages
      ? {
          prerender: { enabled: true, crawlLinks: true },
          pages: routes.map((path) => ({ path, prerender: { enabled: true } })),
        }
      : {}),

    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});


