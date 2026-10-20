import { DeleteObjectCommand, type S3Client } from "@aws-sdk/client-s3";
import { describe, expect, it } from "vitest";

import {
  createR2ImageDeleter,
  R2ImageDeleteError,
  R2ImageError,
} from "./r2";

const config = {
  accountId: "a".repeat(32),
  accessKeyId: "key",
  secretAccessKey: "secret",
  bucket: "postpooch",
  publicBaseUrl: "https://media.example.com",
};

const validHash = `ab${"0".repeat(62)}`;
const validKey = `dummy/${validHash.slice(0, 2)}/${validHash}.jpg`;

function clientRecordingDeletes(onSend?: () => Promise<void>) {
  const deleted: Array<{ bucket?: string; key?: string }> = [];
  const client = {
    send: async (command: unknown) => {
      await onSend?.();
      if (!(command instanceof DeleteObjectCommand)) {
        throw new Error("expected DeleteObjectCommand");
      }
      deleted.push({
        bucket: command.input.Bucket,
        key: command.input.Key,
      });
      return {};
    },
  } as unknown as S3Client;

  return { client, deleted };
}

describe("createR2ImageDeleter", () => {
  it("deletes a content-addressed key minted by this module", async () => {
    const { client, deleted } = clientRecordingDeletes();
    const deleteImage = createR2ImageDeleter(config, client);

    await expect(deleteImage({ key: `  ${validKey}  ` })).resolves.toEqual({
      key: validKey,
    });
    expect(deleted).toEqual([{ bucket: "postpooch", key: validKey }]);
  });

  it("rejects public URLs, traversal, and keys this uploader would never mint", async () => {
    const { client, deleted } = clientRecordingDeletes();
    const deleteImage = createR2ImageDeleter(config, client);
    const hashWithWrongShard = `cd${"0".repeat(62)}`;

    await expect(
      deleteImage({
        key: `https://media.example.com/${validKey}`,
      }),
    ).rejects.toBeInstanceOf(R2ImageDeleteError);
    await expect(deleteImage({ key: "" })).rejects.toBeInstanceOf(
      R2ImageDeleteError,
    );
    await expect(
      deleteImage({ key: `../${validKey}` }),
    ).rejects.toBeInstanceOf(R2ImageDeleteError);
    await expect(
      deleteImage({ key: `posts/schedule/1/0-id-deadbeef.jpg` }),
    ).rejects.toBeInstanceOf(R2ImageDeleteError);
    await expect(
      deleteImage({
        key: `dummy/ab/${hashWithWrongShard}.jpg`,
      }),
    ).rejects.toBeInstanceOf(R2ImageDeleteError);

    expect(deleted).toEqual([]);
  });

  it("wraps R2 failures without treating a missing object as a caller error", async () => {
    const { client } = clientRecordingDeletes(async () => {
      throw new Error("R2 unavailable");
    });
    const deleteImage = createR2ImageDeleter(config, client);

    await expect(deleteImage({ key: validKey })).rejects.toSatisfy(
      (error: unknown) =>
        error instanceof R2ImageDeleteError &&
        error instanceof R2ImageError &&
        error.message === "Failed to delete image from R2.",
    );
  });
});
