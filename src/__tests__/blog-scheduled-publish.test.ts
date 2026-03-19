import { describe, it, expect } from "vitest";
import { isPostVisible } from "@/lib/blog";

describe("isPostVisible", () => {
  const now = new Date("2026-03-19T12:00:00Z");

  it("published 미설정 + scheduledAt 미설정 → true (기본 공개)", () => {
    expect(isPostVisible({}, now)).toBe(true);
  });

  it("published: true + scheduledAt 미설정 → true", () => {
    expect(isPostVisible({ published: true }, now)).toBe(true);
  });

  it("published: false → false (초안)", () => {
    expect(isPostVisible({ published: false }, now)).toBe(false);
  });

  it("published: true + scheduledAt 미래 → false (예약 대기)", () => {
    expect(
      isPostVisible(
        { published: true, scheduledAt: "2026-03-20T12:00:00Z" },
        now
      )
    ).toBe(false);
  });

  it("published: true + scheduledAt 과거 → true (공개)", () => {
    expect(
      isPostVisible(
        { published: true, scheduledAt: "2026-03-18T12:00:00Z" },
        now
      )
    ).toBe(true);
  });

  it("published: true + scheduledAt 현재와 동일 → true (경계값)", () => {
    expect(
      isPostVisible(
        { published: true, scheduledAt: "2026-03-19T12:00:00Z" },
        now
      )
    ).toBe(true);
  });

  it("scheduledAt 빈 문자열 → true (무시)", () => {
    expect(isPostVisible({ scheduledAt: "" }, now)).toBe(true);
  });

  it("scheduledAt 유효하지 않은 문자열 → true (무시, 안전한 기본값)", () => {
    expect(isPostVisible({ scheduledAt: "invalid-date" }, now)).toBe(true);
  });

  it("published: false + scheduledAt 과거 → false (published가 우선)", () => {
    expect(
      isPostVisible(
        { published: false, scheduledAt: "2026-03-18T12:00:00Z" },
        now
      )
    ).toBe(false);
  });
});
