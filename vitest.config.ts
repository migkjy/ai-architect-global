import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    coverage: {
      provider: "v8",
      include: [
        "src/app/api/webhooks/paddle/**",
        "src/lib/paddle.ts",
        "src/lib/orders.ts",
        "src/lib/email.ts",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
