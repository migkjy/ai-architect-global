import { describe, it, expect } from "vitest";
import en from "@/messages/en.json";
import ja from "@/messages/ja.json";
import ko from "@/messages/ko.json";

describe("i18n Nav Messages", () => {
  it("en.json has pricing nav key", () => {
    expect(en.nav.pricing).toBe("Pricing");
  });

  it("ja.json has pricing nav key", () => {
    expect(ja.nav.pricing).toBeTruthy();
  });

  it("ko.json has pricing nav key", () => {
    expect(ko.nav.pricing).toBeTruthy();
  });

  it("all locales have the same nav keys", () => {
    const enKeys = Object.keys(en.nav).sort();
    const jaKeys = Object.keys(ja.nav).sort();
    const koKeys = Object.keys(ko.nav).sort();
    expect(enKeys).toEqual(jaKeys);
    expect(enKeys).toEqual(koKeys);
  });
});
