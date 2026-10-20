import { defineConfig } from "@trigger.dev/sdk/v3";
import {
  additionalFiles,
  aptGet,
} from "@trigger.dev/build/extensions/core";

export default defineConfig({
  project: "proj_kkcqmlytccqmpemnjrii",
  runtime: "node",
  logLevel: "log",
  legacyDevProcessCwdBehaviour: false,
  // The max compute seconds a task is allowed to run. If the task run exceeds this duration, it will be stopped.
  // You can override this on an individual task.
  // See https://trigger.dev/docs/runs/max-duration
  maxDuration: 3600,
  retries: {
    enabledInDev: true,
    default: {
      maxAttempts: 3,
      minTimeoutInMs: 1000,
      maxTimeoutInMs: 10000,
      factor: 2,
      randomize: true,
    },
  },
  dirs: ["./src/trigger"],
  build: {
    // Both packages rely on native/runtime files and must not be bundled.
    external: ["canvas", "fabric"],
    // Canvas/Pango needs its native codecs and system fonts in the Linux
    // worker. Noto covers international scripts and emoji; the remaining
    // families cover common office and social-template typography.
    extensions: [
      aptGet({
        packages: [
          "fontconfig",
          "libcairo2",
          "libgif7",
          "libjpeg62-turbo",
          "libpango-1.0-0",
          "librsvg2-2",
          "libwebp7",
          "fonts-crosextra-caladea",
          "fonts-crosextra-carlito",
          "fonts-dejavu-core",
          "fonts-liberation",
          "fonts-noto-cjk",
          "fonts-noto-color-emoji",
          "fonts-noto-core",
        ],
      }),
      additionalFiles({
        files: [
          "./public/fonts/**",
          "./scripts/verify-renderer-fonts.mjs",
        ],
      }),
      {
        name: "verify-renderer-fonts",
        onBuildComplete: async (context) => {
          context.addLayer({
            id: "verify-renderer-fonts",
            commands: ["node scripts/verify-renderer-fonts.mjs"],
          });
        },
      },
    ],
  },
});
