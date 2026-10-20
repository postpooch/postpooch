import { describe, expect, it } from "vitest";

import { PostingError } from "../posting/errors";
import { invokeModelStage } from "./model-call";

describe("model stage deadlines", () => {
  it("turns an aborted provider call into a named retryable stage error", async () => {
    const result = invokeModelStage({
      stage: "Initial Design AI",
      timeoutMs: 5,
      invoke: ({ signal }) => new Promise<never>((_resolve, reject) => {
        signal.addEventListener("abort", () => reject(signal.reason), { once: true });
      }),
    });

    await expect(result).rejects.toMatchObject({
      name: "PostingError",
      message: "Initial Design AI timed out after 1 seconds",
      retryable: true,
    } satisfies Partial<PostingError>);
  });
});
