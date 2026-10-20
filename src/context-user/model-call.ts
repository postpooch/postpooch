import { PostingError } from "../posting/errors";

export function modelCallConfig(timeoutMs: number): { signal: AbortSignal } {
  return { signal: AbortSignal.timeout(timeoutMs) };
}

export async function invokeModelStage<T>(input: {
  stage: string;
  timeoutMs: number;
  invoke: (config: { signal: AbortSignal }) => Promise<T>;
}): Promise<T> {
  const config = modelCallConfig(input.timeoutMs);
  try {
    return await input.invoke(config);
  } catch (error) {
    if (config.signal.aborted) {
      throw new PostingError(
        `${input.stage} timed out after ${Math.ceil(input.timeoutMs / 1000)} seconds`,
        true,
        { cause: error },
      );
    }
    throw error;
  }
}
