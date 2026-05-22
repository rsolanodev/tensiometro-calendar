import { describe, it, expect } from "vitest";
import { getPregnancyWeek } from "./pregnancy";

describe("getPregnancyWeek", () => {
  it("returns week 1 day 0 on the start date", () => {
    const result = getPregnancyWeek("23/02/2026", new Date("2026-02-23"));
    expect(result.week).toBe(1);
    expect(result.dayOfWeek).toBe(0);
    expect(result.totalDays).toBe(0);
  });

  it("returns week 2 day 0 after 7 days", () => {
    const result = getPregnancyWeek("23/02/2026", new Date("2026-03-02"));
    expect(result.week).toBe(2);
    expect(result.dayOfWeek).toBe(0);
    expect(result.totalDays).toBe(7);
  });

  it("returns week 13 day 4 on 22/05/2026 from 23/02/2026", () => {
    const result = getPregnancyWeek("23/02/2026", new Date("2026-05-22"));
    expect(result.week).toBe(13);
    expect(result.dayOfWeek).toBe(4);
    expect(result.totalDays).toBe(88);
  });

  it("returns week 41 day 0 on due date (40 weeks from start)", () => {
    const result = getPregnancyWeek("23/02/2026", new Date("2026-11-30"));
    expect(result.week).toBe(41);
    expect(result.dayOfWeek).toBe(0);
    expect(result.totalDays).toBe(280);
  });

  it("returns week 42 day 0 past due date", () => {
    const result = getPregnancyWeek("23/02/2026", new Date("2026-12-07"));
    expect(result.week).toBe(42);
    expect(result.dayOfWeek).toBe(0);
    expect(result.totalDays).toBe(287);
  });

  it("uses default start date from env when not provided", () => {
    const originalEnv = process.env.NEXT_PUBLIC_PREGNANCY_START_DATE;
    process.env.NEXT_PUBLIC_PREGNANCY_START_DATE = "01/01/2026";

    const result = getPregnancyWeek(undefined, new Date("2026-01-01"));

    expect(result.week).toBe(1);
    expect(result.totalDays).toBe(0);

    process.env.NEXT_PUBLIC_PREGNANCY_START_DATE = originalEnv;
  });

  it("handles month boundary correctly", () => {
    const result = getPregnancyWeek("01/01/2026", new Date("2026-02-01"));
    expect(result.week).toBe(5);
    expect(result.dayOfWeek).toBe(3);
    expect(result.totalDays).toBe(31);
  });

  it("handles year boundary correctly", () => {
    const result = getPregnancyWeek("25/12/2025", new Date("2026-01-01"));
    expect(result.week).toBe(2);
    expect(result.dayOfWeek).toBe(0);
    expect(result.totalDays).toBe(7);
  });
});
