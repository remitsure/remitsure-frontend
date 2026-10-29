import { describe, expect, it } from "vitest";
import { fromUnits, relativeTime, shortAddress, toUnits } from "../format";

describe("toUnits", () => {
  it("converts whole and decimal amounts", () => {
    expect(toUnits("10")).toBe(100_000_000n);
    expect(toUnits("12.5")).toBe(125_000_000n);
    expect(toUnits("0.0000001")).toBe(1n);
  });

  it("rejects bad input", () => {
    expect(() => toUnits("-1")).toThrow();
    expect(() => toUnits("abc")).toThrow();
    expect(() => toUnits("1.12345678")).toThrow(/decimal/);
  });
});

describe("fromUnits", () => {
  it("round trips", () => {
    expect(fromUnits(125_000_000n)).toBe("12.5");
    expect(fromUnits("100000000")).toBe("10");
    expect(fromUnits(1n)).toBe("0.0000001");
  });
});

describe("shortAddress", () => {
  it("shortens long keys", () => {
    expect(shortAddress("GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCCWN7")).toBe(
      "GAAZ...CWN7",
    );
  });
});

describe("relativeTime", () => {
  const now = Date.parse("2026-10-29T12:00:00Z");
  it("describes future and past", () => {
    expect(relativeTime("2026-11-01T12:00:00Z", now)).toBe("in 3 days");
    expect(relativeTime("2026-10-29T10:00:00Z", now)).toBe("2 hours ago");
    expect(relativeTime("2026-10-29T12:05:00Z", now)).toBe("in 5 minutes");
  });
});
