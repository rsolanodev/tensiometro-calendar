import { describe, it, expect, beforeEach, vi } from "vitest";
import { formatDateLabel, formatTime, isNormal } from "./helpers";

describe("formatDateLabel", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-22T12:00:00"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns "Hoy" for today\'s date', () => {
    expect(formatDateLabel("2026-05-22")).toBe("Hoy");
  });

  it('returns "Ayer" for yesterday\'s date', () => {
    expect(formatDateLabel("2026-05-21")).toBe("Ayer");
  });

  it("returns day/month for older dates", () => {
    expect(formatDateLabel("2026-05-20")).toBe("20/05");
  });

  it("handles month boundaries correctly", () => {
    expect(formatDateLabel("2026-04-30")).toBe("30/04");
  });
});

describe("formatTime", () => {
  it("extracts HH:MM from an ISO string", () => {
    expect(formatTime("2026-05-22T08:30:00.000Z")).toBe("08:30");
  });

  it("handles midday time", () => {
    expect(formatTime("2026-05-22T14:05:00.000Z")).toBe("14:05");
  });
});

describe("isNormal", () => {
  it("returns true for normal blood pressure", () => {
    expect(isNormal(118, 76)).toBe(true);
  });

  it("returns false when systolic is 130 or higher", () => {
    expect(isNormal(130, 80)).toBe(false);
    expect(isNormal(140, 85)).toBe(false);
  });

  it("returns false when diastolic is 85 or higher", () => {
    expect(isNormal(120, 85)).toBe(false);
    expect(isNormal(118, 90)).toBe(false);
  });

  it("returns false when both are elevated", () => {
    expect(isNormal(135, 90)).toBe(false);
  });
});
