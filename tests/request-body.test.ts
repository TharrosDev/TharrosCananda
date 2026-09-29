import { describe, expect, it, vi } from "vitest";
import { readRequestBody } from "../src/lib/request-body";

const request = (stream: ReadableStream<Uint8Array>) =>
  new Request("https://tharros.ca/api/test", {
    method: "POST",
    body: stream,
    duplex: "half",
  } as RequestInit);

describe("bounded request bodies", () => {
  it("cancels oversized chunked input before reading the remaining body", async () => {
    const cancel = vi.fn();
    let pulls = 0;
    const stream = new ReadableStream<Uint8Array>(
      {
        pull(controller) {
          pulls += 1;
          controller.enqueue(new Uint8Array(513));
        },
        cancel,
      },
      { highWaterMark: 0 },
    );
    await expect(readRequestBody(request(stream), 512)).rejects.toMatchObject({ status: 413 });
    expect(pulls).toBe(1);
    expect(cancel).toHaveBeenCalledOnce();
  });

  it("decodes multibyte characters split across chunks without corrupting JSON", async () => {
    const bytes = new TextEncoder().encode('{"title":"Québec"}');
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        for (const byte of bytes) controller.enqueue(Uint8Array.of(byte));
        controller.close();
      },
    });
    expect(await readRequestBody(request(stream), bytes.length)).toBe('{"title":"Québec"}');
  });

  it("turns invalid UTF-8 and broken streams into a bad request", async () => {
    const invalid = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(Uint8Array.of(0xff));
        controller.close();
      },
    });
    await expect(readRequestBody(request(invalid), 512)).rejects.toMatchObject({ status: 400 });
    const broken = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.error(new Error("aborted"));
      },
    });
    await expect(readRequestBody(request(broken), 512)).rejects.toMatchObject({ status: 400 });
  });
});
