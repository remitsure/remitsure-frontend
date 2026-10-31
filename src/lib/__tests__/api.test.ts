import { afterEach, describe, expect, it, vi } from "vitest";
import { get, NotFoundError } from "../api";

const json = (status: number, body: unknown = {}) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

afterEach(() => vi.unstubAllGlobals());

describe("get", () => {
  it("retries while the API wakes up, then returns the body", async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new TypeError("Failed to fetch"))
      .mockResolvedValueOnce(json(503))
      .mockResolvedValueOnce(json(200, { ok: true }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(get("/stats", [0, 0, 0])).resolves.toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("gives up after the last retry", async () => {
    const fetchMock = vi.fn().mockResolvedValue(json(502));
    vi.stubGlobal("fetch", fetchMock);

    await expect(get("/stats", [0, 0])).rejects.toThrow("API 502 on /stats");
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("does not retry client errors", async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(json(404)).mockResolvedValueOnce(json(400));
    vi.stubGlobal("fetch", fetchMock);

    await expect(get("/payees/x", [0])).rejects.toBeInstanceOf(NotFoundError);
    await expect(get("/payees?bad", [0])).rejects.toThrow("API 400");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
