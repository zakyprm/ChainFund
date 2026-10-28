import { describe, expect, it } from "vitest";
import {
  canWithdraw,
  isGoalReached,
  parseError,
  progressPercent,
  shortAddress,
} from "./format.js";

const OWNER = "0xAbCdEf0000000000000000000000000000001234";
const ONE = 10n ** 18n;

describe("shortAddress", () => {
  it("memendekkan alamat", () => {
    expect(shortAddress(OWNER)).toBe("0xAbCd...1234");
  });
  it("aman untuk nilai kosong", () => {
    expect(shortAddress("")).toBe("");
    expect(shortAddress(undefined)).toBe("");
  });
});

describe("progressPercent", () => {
  it("menghitung persentase", () => {
    expect(progressPercent(ONE / 2n, ONE)).toBe(50);
  });
  it("dibatasi maksimal 100", () => {
    expect(progressPercent(ONE * 3n, ONE)).toBe(100);
  });
  it("0 kalau goal 0", () => {
    expect(progressPercent(ONE, 0n)).toBe(0);
  });
});

describe("isGoalReached", () => {
  it("true kalau raised >= goal", () => {
    expect(isGoalReached(ONE, ONE)).toBe(true);
    expect(isGoalReached(ONE - 1n, ONE)).toBe(false);
  });
});

describe("canWithdraw", () => {
  const base = { owner: OWNER, totalRaised: ONE, goal: ONE, withdrawn: false };

  it("true untuk owner setelah target tercapai", () => {
    expect(canWithdraw(base, OWNER.toLowerCase())).toBe(true);
  });
  it("false untuk bukan owner", () => {
    expect(canWithdraw(base, "0x0000000000000000000000000000000000000001")).toBe(false);
  });
  it("false kalau target belum tercapai", () => {
    expect(canWithdraw({ ...base, totalRaised: ONE - 1n }, OWNER)).toBe(false);
  });
  it("false kalau sudah ditarik", () => {
    expect(canWithdraw({ ...base, withdrawn: true }, OWNER)).toBe(false);
  });
  it("false kalau wallet belum terhubung", () => {
    expect(canWithdraw(base, null)).toBe(false);
  });
});

describe("parseError", () => {
  it("mengenali penolakan di wallet", () => {
    expect(parseError({ code: "ACTION_REJECTED" })).toMatch(/dibatalkan/);
  });
  it("memetakan custom error contract", () => {
    expect(parseError({ revert: { name: "ZeroDonation" } })).toMatch(/lebih dari 0/);
  });
  it("fallback ke shortMessage", () => {
    expect(parseError({ shortMessage: "boom" })).toBe("boom");
  });
});
