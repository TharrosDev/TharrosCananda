/** Reject a body as it streams in, including chunked requests without Content-Length. */
export class RequestBodyError extends Error {
  constructor(public readonly status: 400 | 413) {
    super(status === 413 ? "Request body too large" : "Invalid request body");
  }
}

export async function readRequestBody(request: Request, maxBytes: number): Promise<string> {
  if (Number(request.headers.get("content-length")) > maxBytes) throw new RequestBodyError(413);
  if (!request.body) return "";
  const reader = request.body.getReader();
  const decoder = new TextDecoder("utf-8", { fatal: true });
  let bytes = 0;
  let text = "";
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) return text + decoder.decode();
      bytes += value.byteLength;
      if (bytes > maxBytes) throw new RequestBodyError(413);
      text += decoder.decode(value, { stream: true });
    }
  } catch (error) {
    void reader.cancel().catch(() => {});
    throw error instanceof RequestBodyError ? error : new RequestBodyError(400);
  } finally {
    reader.releaseLock();
  }
}
