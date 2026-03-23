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

describe("isPostVisible — date 필터링", () => {
  const now = new Date("2026-03-19T12:00:00Z");

  it("date 미래 → false (예약발행 대기)", () => {
    expect(
      isPostVisible({ date: "2026-03-25T00:00:00Z" }, now)
    ).toBe(false);
  });

  it("date 과거 → true (공개)", () => {
    expect(
      isPostVisible({ date: "2026-03-10T00:00:00Z" }, now)
    ).toBe(true);
  });

  it("date 현재와 동일 → true (경계값)", () => {
    expect(
      isPostVisible({ date: "2026-03-19T12:00:00Z" }, now)
    ).toBe(true);
  });

  it("date 미설정 → true (기본 공개)", () => {
    expect(isPostVisible({}, now)).toBe(true);
  });

  it("date 빈 문자열 → true (무시)", () => {
    expect(isPostVisible({ date: "" }, now)).toBe(true);
  });

  it("date 유효하지 않은 문자열 → true (무시, 안전한 기본값)", () => {
    expect(isPostVisible({ date: "not-a-date" }, now)).toBe(true);
  });

  it("date 미래 + published: true → false (date가 미래이면 비공개)", () => {
    expect(
      isPostVisible({ published: true, date: "2026-03-25T00:00:00Z" }, now)
    ).toBe(false);
  });

  it("date 미래 + scheduledAt 과거 → false (date 미래가 우선)", () => {
    expect(
      isPostVisible(
        { date: "2026-03-25T00:00:00Z", scheduledAt: "2026-03-18T12:00:00Z" },
        now
      )
    ).toBe(false);
  });

  it("date 과거 + scheduledAt 미래 → false (scheduledAt 미래가 우선)", () => {
    expect(
      isPostVisible(
        { date: "2026-03-10T00:00:00Z", scheduledAt: "2026-03-25T12:00:00Z" },
        now
      )
    ).toBe(false);
  });

  it("date 과거 + scheduledAt 과거 + published: true → true (모두 통과)", () => {
    expect(
      isPostVisible(
        {
          published: true,
          date: "2026-03-10T00:00:00Z",
          scheduledAt: "2026-03-18T12:00:00Z",
        },
        now
      )
    ).toBe(true);
  });

  it("published: false + date 과거 → false (published가 최우선)", () => {
    expect(
      isPostVisible(
        { published: false, date: "2026-03-10T00:00:00Z" },
        now
      )
    ).toBe(false);
  });
});
