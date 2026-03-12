import { describe, it, expect } from "vitest";
import { routing } from "@/i18n/routing";

describe("i18n Routing", () => {
  it("locales includes en and ja", () => {
    expect(routing.locales).toContain("en");
    expect(routing.locales).toContain("ja");
  });

  it("locales does not include ko", () => {
    expect(routing.locales).not.toContain("ko");
  });

  it("defaultLocale is en", () => {
    expect(routing.defaultLocale).toBe("en");
  });

  it("locales array has exactly 2 entries", () => {
    expect(routing.locales).toHaveLength(2);
  });
});
