// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// Never set ssr.external or resolve.external: the Worker has no runtime module resolution, so
// the build fails. Never add compression (compressPublicAssets, vite-plugin-compression):
// hosting already compresses at the edge.
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// GITHUB_PAGES=1 genera una versión estática (HTML prerenderizado) para GitHub Pages,
// servida bajo /<repositorio>/. Sin esa variable, la build es la de Lovable de siempre.
const pagesBase = process.env["GITHUB_PAGES"]
  ? `/${process.env["PAGES_REPO"] ?? "cafeteria-de-tu-barrio"}/`
  : undefined;

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    ...(pagesBase && {
      router: { basepath: pagesBase },
      prerender: { enabled: true, crawlLinks: false },
      pages: [{ path: "/" }],
    }),
  },
  ...(pagesBase && {
    nitro: false,
    vite: { base: pagesBase },
  }),
});
