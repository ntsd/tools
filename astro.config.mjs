import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import svelte from "@astrojs/svelte";
import serviceWorker from "astrojs-service-worker";
import mdx from "@astrojs/mdx";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

// https://astro.build/config
export default defineConfig({
  output: "static",
  compressHTML: true,
  integrations: [mdx(), tailwind(), svelte(), serviceWorker()],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [[rehypeKatex, { output: "mathml" }]],
  },
  vite: {
    plugins: [],
  },
});
