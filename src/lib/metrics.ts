import type { PressureRecord } from "./types";
import { isNormal } from "./helpers";
import { getPregnancyWeek } from "./pregnancy";

export interface MetricsData {
  totalRecords: number;
  avgSystolic: number;
  avgDiastolic: number;
  avgPulse: number;
  minSystolic: number;
  maxSystolic: number;
  minDiastolic: number;
  maxDiastolic: number;
  minPulse: number;
  maxPulse: number;
  normalCount: number;
  normalPercentage: number;
  pillTakenCount: number;
  pillAdherence: number;
  firstDate: string;
  lastDate: string;
}

export interface WeekGroup {
  week: number;
  avgSystolic: number;
  avgDiastolic: number;
  avgPulse: number;
  count: number;
}

export function calculateMetrics(records: PressureRecord[]): MetricsData {
  if (records.length === 0) {
    return {
      totalRecords: 0,
      avgSystolic: 0,
      avgDiastolic: 0,
      avgPulse: 0,
      minSystolic: 0,
      maxSystolic: 0,
      minDiastolic: 0,
      maxDiastolic: 0,
      minPulse: 0,
      maxPulse: 0,
      normalCount: 0,
      normalPercentage: 0,
      pillTakenCount: 0,
      pillAdherence: 0,
      firstDate: "",
      lastDate: "",
    };
  }

  let sumSystolic = 0;
  let sumDiastolic = 0;
  let sumPulse = 0;
  let minSystolic = Infinity;
  let maxSystolic = -Infinity;
  let minDiastolic = Infinity;
  let maxDiastolic = -Infinity;
  let minPulse = Infinity;
  let maxPulse = -Infinity;
  let normalCount = 0;
  let pillTakenCount = 0;

  for (const r of records) {
    sumSystolic += r.systolic;
    sumDiastolic += r.diastolic;
    sumPulse += r.pulse;
    if (r.systolic < minSystolic) minSystolic = r.systolic;
    if (r.systolic > maxSystolic) maxSystolic = r.systolic;
    if (r.diastolic < minDiastolic) minDiastolic = r.diastolic;
    if (r.diastolic > maxDiastolic) maxDiastolic = r.diastolic;
    if (r.pulse < minPulse) minPulse = r.pulse;
    if (r.pulse > maxPulse) maxPulse = r.pulse;
    if (isNormal(r.systolic, r.diastolic)) normalCount++;
    if (r.pillTaken) pillTakenCount++;
  }

  const n = records.length;
  const sorted = [...records].sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  return {
    totalRecords: n,
    avgSystolic: Math.round(sumSystolic / n),
    avgDiastolic: Math.round(sumDiastolic / n),
    avgPulse: Math.round(sumPulse / n),
    minSystolic,
    maxSystolic,
    minDiastolic,
    maxDiastolic,
    minPulse,
    maxPulse,
    normalCount,
    normalPercentage: Math.round((normalCount / n) * 100),
    pillTakenCount,
    pillAdherence: Math.round((pillTakenCount / n) * 100),
    firstDate: sorted[0].date,
    lastDate: sorted[sorted.length - 1].date,
  };
}

export function getRecordsByWeek(
  records: PressureRecord[]
): WeekGroup[] {
  if (records.length === 0) return [];

  const groups = new Map<
    number,
    { sumSis: number; sumDia: number; sumPul: number; count: number }
  >();

  for (const r of records) {
    const { week } = getPregnancyWeek(
      undefined,
      new Date(r.date + "T12:00:00")
    );
    const g = groups.get(week) ?? {
      sumSis: 0,
      sumDia: 0,
      sumPul: 0,
      count: 0,
    };
    g.sumSis += r.systolic;
    g.sumDia += r.diastolic;
    g.sumPul += r.pulse;
    g.count++;
    groups.set(week, g);
  }

  return Array.from(groups.entries())
    .map(([week, g]) => ({
      week,
      avgSystolic: Math.round(g.sumSis / g.count),
      avgDiastolic: Math.round(g.sumDia / g.count),
      avgPulse: Math.round(g.sumPul / g.count),
      count: g.count,
    }))
    .sort((a, b) => a.week - b.week);
}
