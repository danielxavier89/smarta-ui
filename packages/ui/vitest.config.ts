import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));

/**
 * Tests run against src, not dist. dist is proven separately by the consumer
 * smoke build, which is a different question: "can a product install this",
 * rather than "does this behave".
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@smarta/tokens": resolve(here, "../tokens/src/index.ts") },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: [resolve(here, "src/test/setup.ts")],
    include: ["src/**/*.test.{ts,tsx}"],
    css: false,
  },
});
