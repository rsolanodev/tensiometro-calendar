import { describe, it, expect } from "vitest";
import { calculateMetrics, getRecordsByWeek } from "./metrics";
import type { PressureRecord } from "./types";

const baseRecord = {
  time: "10:00",
  pulse: 72,
  pillTaken: false,
  notes: undefined,
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-01T00:00:00Z",
};

function makeRecord(
  overrides: Partial<PressureRecord>
): PressureRecord {
  return { ...baseRecord, ...overrides } as PressureRecord;
}

describe("calculateMetrics", () => {
  it("returns zeros for empty records", () => {
    const m = calculateMetrics([]);
    expect(m.totalRecords).toBe(0);
    expect(m.avgSystolic).toBe(0);
    expect(m.avgDiastolic).toBe(0);
    expect(m.avgPulse).toBe(0);
    expect(m.normalPercentage).toBe(0);
    expect(m.pillAdherence).toBe(0);
    expect(m.firstDate).toBe("");
    expect(m.lastDate).toBe("");
  });

  it("calculates metrics for a single record", () => {
    const m = calculateMetrics([
      makeRecord({
        date: "2026-05-20",
        systolic: 120,
        diastolic: 80,
        pulse: 70,
        pillTaken: true,
      }),
    ]);

    expect(m.totalRecords).toBe(1);
    expect(m.avgSystolic).toBe(120);
    expect(m.avgDiastolic).toBe(80);
    expect(m.avgPulse).toBe(70);
    expect(m.minSystolic).toBe(120);
    expect(m.maxSystolic).toBe(120);
    expect(m.normalCount).toBe(1);
    expect(m.normalPercentage).toBe(100);
    expect(m.pillTakenCount).toBe(1);
    expect(m.pillAdherence).toBe(100);
    expect(m.firstDate).toBe("2026-05-20");
    expect(m.lastDate).toBe("2026-05-20");
  });

  it("calculates averages for multiple records", () => {
    const m = calculateMetrics([
      makeRecord({
        date: "2026-05-20",
        systolic: 120,
        diastolic: 80,
        pulse: 70,
      }),
      makeRecord({
        date: "2026-05-21",
        systolic: 130,
        diastolic: 85,
        pulse: 76,
      }),
    ]);

    expect(m.totalRecords).toBe(2);
    expect(m.avgSystolic).toBe(125);
    expect(m.avgDiastolic).toBe(83);
    expect(m.avgPulse).toBe(73);
  });

  it("tracks min and max values", () => {
    const m = calculateMetrics([
      makeRecord({
        date: "2026-05-20",
        systolic: 100,
        diastolic: 60,
        pulse: 60,
      }),
      makeRecord({
        date: "2026-05-21",
        systolic: 150,
        diastolic: 95,
        pulse: 100,
      }),
      makeRecord({
        date: "2026-05-22",
        systolic: 120,
        diastolic: 80,
        pulse: 80,
      }),
    ]);

    expect(m.minSystolic).toBe(100);
    expect(m.maxSystolic).toBe(150);
    expect(m.minDiastolic).toBe(60);
    expect(m.maxDiastolic).toBe(95);
    expect(m.minPulse).toBe(60);
    expect(m.maxPulse).toBe(100);
  });

  it("calculates normal percentage (sis<140 && dia<90)", () => {
    const m = calculateMetrics([
      makeRecord({
        date: "2026-05-20",
        systolic: 120,
        diastolic: 80,
      }),
      makeRecord({
        date: "2026-05-21",
        systolic: 150,
        diastolic: 95,
      }),
      makeRecord({
        date: "2026-05-22",
        systolic: 110,
        diastolic: 70,
      }),
      makeRecord({
        date: "2026-05-23",
        systolic: 139,
        diastolic: 89,
      }),
    ]);

    expect(m.normalCount).toBe(3);
    expect(m.normalPercentage).toBe(75);
  });

  it("calculates pill adherence percentage", () => {
    const m = calculateMetrics([
      makeRecord({
        date: "2026-05-20",
        pillTaken: true,
      }),
      makeRecord({
        date: "2026-05-21",
        pillTaken: false,
      }),
      makeRecord({
        date: "2026-05-22",
        pillTaken: true,
      }),
      makeRecord({
        date: "2026-05-23",
        pillTaken: true,
      }),
    ]);

    expect(m.pillTakenCount).toBe(3);
    expect(m.pillAdherence).toBe(75);
  });

  it("detects first and last date by chronological order", () => {
    const m = calculateMetrics([
      makeRecord({
        date: "2026-05-22",
        systolic: 120,
        diastolic: 80,
      }),
      makeRecord({
        date: "2026-05-20",
        systolic: 120,
        diastolic: 80,
      }),
      makeRecord({
        date: "2026-05-21",
        systolic: 120,
        diastolic: 80,
      }),
    ]);

    expect(m.firstDate).toBe("2026-05-20");
    expect(m.lastDate).toBe("2026-05-22");
  });

  it("handles systolic at exactly 140 as alert (not normal)", () => {
    const m = calculateMetrics([
      makeRecord({
        date: "2026-05-20",
        systolic: 140,
        diastolic: 80,
      }),
    ]);

    expect(m.normalCount).toBe(0);
    expect(m.normalPercentage).toBe(0);
  });

  it("handles diastolic at exactly 90 as alert (not normal)", () => {
    const m = calculateMetrics([
      makeRecord({
        date: "2026-05-20",
        systolic: 120,
        diastolic: 90,
      }),
    ]);

    expect(m.normalCount).toBe(0);
    expect(m.normalPercentage).toBe(0);
  });
});

describe("getRecordsByWeek", () => {
  it("returns empty array for no records", () => {
    expect(getRecordsByWeek([])).toEqual([]);
  });

  it("groups records by pregnancy week", () => {
    const groups = getRecordsByWeek([
      makeRecord({
        date: "2026-02-23",
        systolic: 120,
        diastolic: 80,
        pulse: 70,
      }),
      makeRecord({
        date: "2026-03-02",
        systolic: 125,
        diastolic: 82,
        pulse: 72,
      }),
      makeRecord({
        date: "2026-03-09",
        systolic: 130,
        diastolic: 85,
        pulse: 74,
      }),
    ]);

    expect(groups).toHaveLength(3);
    expect(groups[0].week).toBe(0);
    expect(groups[0].count).toBe(1);
    expect(groups[1].week).toBe(1);
    expect(groups[1].count).toBe(1);
    expect(groups[2].week).toBe(2);
    expect(groups[2].count).toBe(1);
  });

  it("averages values within the same week", () => {
    const groups = getRecordsByWeek([
      makeRecord({
        date: "2026-02-24",
        systolic: 120,
        diastolic: 80,
        pulse: 70,
      }),
      makeRecord({
        date: "2026-02-25",
        systolic: 130,
        diastolic: 84,
        pulse: 72,
      }),
    ]);

    expect(groups).toHaveLength(1);
    expect(groups[0].week).toBe(0);
    expect(groups[0].count).toBe(2);
    expect(groups[0].avgSystolic).toBe(125);
    expect(groups[0].avgDiastolic).toBe(82);
    expect(groups[0].avgPulse).toBe(71);
  });

  it("sorts groups by week ascending", () => {
    const groups = getRecordsByWeek([
      makeRecord({
        date: "2026-03-09",
        systolic: 130,
        diastolic: 85,
        pulse: 74,
      }),
      makeRecord({
        date: "2026-02-23",
        systolic: 120,
        diastolic: 80,
        pulse: 70,
      }),
    ]);

    expect(groups[0].week).toBe(0);
    expect(groups[1].week).toBe(2);
  });
});
