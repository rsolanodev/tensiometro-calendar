"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { getAllRecords } from "@/lib/db";
import { isNormal } from "@/lib/helpers";
import { calculateMetrics } from "@/lib/metrics";
import type { PressureRecord } from "@/lib/types";
import BottomNav from "../BottomNav";
import ShareModal from "../ShareModal";

function BPChart({ records }: { records: PressureRecord[] }) {
  const sorted = [...records]
    .filter((r) => r.systolic > 0 && r.diastolic > 0)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-30);
  if (sorted.length < 2) return null;

  const width = 600;
  const height = 200;
  const pad = { top: 20, right: 20, bottom: 30, left: 40 };
  const chartW = width - pad.left - pad.right;
  const chartH = height - pad.top - pad.bottom;

  const allVals = sorted.flatMap((r) => [r.systolic, r.diastolic]);
  const dataMin = Math.min(...allVals);
  const dataMax = Math.max(...allVals);
  const yMin = Math.max(0, dataMin - 10);
  const yMax = dataMax + 10;
  const yRange = yMax - yMin || 1;

  const xScale = (i: number) =>
    pad.left + (i / (sorted.length - 1)) * chartW;
  const yScale = (v: number) =>
    pad.top + chartH - ((v - yMin) / yRange) * chartH;

  const sisPath = sorted
    .map(
      (r, i) =>
        `${i === 0 ? "M" : "L"}${xScale(i).toFixed(1)},${yScale(r.systolic).toFixed(1)}`
    )
    .join(" ");
  const diaPath = sorted
    .map(
      (r, i) =>
        `${i === 0 ? "M" : "L"}${xScale(i).toFixed(1)},${yScale(r.diastolic).toFixed(1)}`
    )
    .join(" ");

  const yTicks = 4;
  const tickStep = yRange / yTicks;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-auto"
      style={{ maxHeight: 220 }}
    >
      {Array.from({ length: yTicks + 1 }, (_, i) => {
        const y = pad.top + chartH - (i * tickStep / yRange) * chartH;
        const val = yMin + i * tickStep;
        return (
          <g key={i}>
            <line
              x1={pad.left}
              y1={y}
              x2={width - pad.right}
              y2={y}
              stroke="#F3E3EA"
              strokeWidth="1"
            />
            <text
              x={pad.left - 4}
              y={y + 4}
              textAnchor="end"
              fill="#808080"
              className="text-label-sm"
            >
              {Math.round(val)}
            </text>
          </g>
        );
      })}

      <path
        d={sisPath}
        fill="none"
        stroke="#FF8AA5"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d={diaPath}
        fill="none"
        stroke="#5BC8A8"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      <g
        transform={`translate(${width - pad.right - 120}, ${pad.top + 4})`}
      >
        <line x1="0" y1="0" x2="16" y2="0" stroke="#FF8AA5" strokeWidth="2.5" />
        <text x="20" y="4" fill="#808080" className="text-label-sm">
          Sistólica
        </text>
        <line
          x1="0"
          y1="16"
          x2="16"
          y2="16"
          stroke="#5BC8A8"
          strokeWidth="2.5"
        />
        <text x="20" y="20" fill="#808080" className="text-label-sm">
          Diastólica
        </text>
      </g>
    </svg>
  );
}

function SummaryCard({ metrics }: { metrics: ReturnType<typeof calculateMetrics> }) {
  return (
    <section className="card-surface">
      <h2 className="text-headline-sm mb-md">Resumen</h2>
      <div className="grid grid-cols-1 gap-md">
        <div className="flex flex-col items-center py-sm px-md rounded-lg bg-surface-variant">
          <span className="text-label-sm text-text-secondary">Total registros</span>
          <span className="text-headline-md text-text-primary">
            {metrics.totalRecords}
          </span>
        </div>
        {metrics.firstDate && (
          <div className="flex flex-col items-center py-sm px-md rounded-lg bg-surface-variant">
            <span className="text-label-sm text-text-secondary">Período</span>
            <span className="text-body-sm text-text-primary">
              {metrics.firstDate} → {metrics.lastDate}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}

function AveragesCard({
  metrics,
}: {
  metrics: ReturnType<typeof calculateMetrics>;
}) {
  return (
    <section className="card-surface">
      <h2 className="text-headline-sm mb-md">Promedios</h2>
      <div className="grid grid-cols-3 gap-md">
        {[
          { label: "Sistólica", value: metrics.avgSystolic, unit: "mmHg" },
          { label: "Diastólica", value: metrics.avgDiastolic, unit: "mmHg" },
          { label: "Pulso", value: metrics.avgPulse, unit: "bpm" },
        ].map((item) => (
          <div
            key={item.label}
            className="flex flex-col items-center py-md px-sm rounded-lg bg-surface-variant"
          >
            <span className="text-label-sm text-text-secondary">
              {item.label}
            </span>
            <span className="text-headline-lg text-text-primary">
              {item.value}
            </span>
            <span className="text-label-sm text-text-secondary">
              {item.unit}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function HealthCard({
  metrics,
}: {
  metrics: ReturnType<typeof calculateMetrics>;
}) {
  return (
    <section className="card-surface">
      <h2 className="text-headline-sm mb-md">Indicadores de salud</h2>
      <div className="space-y-md">
        {[
          {
            label: "Lecturas normales",
            pct: metrics.normalPercentage,
            count: metrics.normalCount,
            total: metrics.totalRecords,
          },
          {
            label: "Adherencia a medicación",
            pct: metrics.pillAdherence,
            count: metrics.pillTakenCount,
            total: metrics.totalRecords,
          },
        ].map((item) => {
          const isGood = item.pct >= 80;
          return (
            <div key={item.label}>
              <div className="flex items-center justify-between mb-xs">
                <span className="text-body-sm text-text-primary">
                  {item.label}
                </span>
                <span
                  className="text-body-sm font-semibold"
                  style={{
                    color: isGood
                      ? "var(--color-success)"
                      : "var(--color-primary)",
                  }}
                >
                  {item.pct}% ({item.count}/{item.total})
                </span>
              </div>
              <div className="h-2 rounded-full bg-chart-secondary overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${item.pct}%`,
                    backgroundColor: isGood
                      ? "var(--color-success)"
                      : "var(--color-primary)",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function RangesCard({
  metrics,
}: {
  metrics: ReturnType<typeof calculateMetrics>;
}) {
  const items = [
    {
      label: "Sistólica",
      min: metrics.minSystolic,
      max: metrics.maxSystolic,
    },
    {
      label: "Diastólica",
      min: metrics.minDiastolic,
      max: metrics.maxDiastolic,
    },
    { label: "Pulso", min: metrics.minPulse, max: metrics.maxPulse },
  ];

  return (
    <section className="card-surface">
      <h2 className="text-headline-sm mb-md">Rangos</h2>
      <div className="space-y-sm">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between py-sm px-md rounded-lg bg-surface-variant"
          >
            <span className="text-body-sm text-text-primary">
              {item.label}
            </span>
            <div className="flex items-center gap-md text-body-sm">
              <span className="text-text-secondary">
                Min:{" "}
                <strong className="text-text-primary">{item.min}</strong>
              </span>
              <span className="text-text-secondary">
                Max:{" "}
                <strong className="text-text-primary">{item.max}</strong>
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function RecordsTable({
  records,
}: {
  records: PressureRecord[];
}) {
  const sorted = [...records].sort((a, b) => {
    const dateCmp = b.date.localeCompare(a.date);
    if (dateCmp !== 0) return dateCmp;
    return (b.time ?? "").localeCompare(a.time ?? "");
  });

  return (
    <section className="card-surface">
      <h2 className="text-headline-sm mb-md">Todos los registros</h2>
      {sorted.length === 0 ? (
        <p className="text-body-sm text-text-secondary text-center py-md">
          No hay registros
        </p>
      ) : (
        <div className="records-table-container">
          <table className="w-full text-left text-body-sm">
            <thead>
              <tr className="text-label-sm text-text-secondary border-b border-border-subtle">
                <th className="py-sm pr-sm">Fecha</th>
                <th className="py-sm pr-sm">Hora</th>
                <th className="py-sm pr-sm">SIS</th>
                <th className="py-sm pr-sm">DIA</th>
                <th className="py-sm pr-sm">PUL</th>
                <th className="py-sm">Pastilla</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-border-subtle"
                >
                  <td className="py-sm pr-sm text-text-primary">
                    {r.date}
                  </td>
                  <td className="py-sm pr-sm text-text-secondary">
                    {r.time ?? "—"}
                  </td>
                  <td
                    className={`py-sm pr-sm font-semibold ${
                      isNormal(r.systolic, r.diastolic)
                        ? ""
                        : "text-primary"
                    }`}
                  >
                    {r.systolic}
                  </td>
                  <td
                    className={`py-sm pr-sm font-semibold ${
                      isNormal(r.systolic, r.diastolic)
                        ? ""
                        : "text-primary"
                    }`}
                  >
                    {r.diastolic}
                  </td>
                  <td className="py-sm pr-sm text-text-primary">
                    {r.pulse}
                  </td>
                  <td className="py-sm">
                    {r.pillTaken ? "✓" : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default function MetricasPage() {
  const [records, setRecords] = useState<PressureRecord[]>([]);
  const [showShare, setShowShare] = useState(false);

  const loadData = useCallback(async () => {
    const allRecords = await getAllRecords();
    setRecords(allRecords);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const metrics = useMemo(() => calculateMetrics(records), [records]);

  return (
    <>
      <header className="app-bar screen-only">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-sm"
        >
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
        <h1 className="text-headline-sm flex-1">Métricas</h1>
        <button
          type="button"
          onClick={() => window.print()}
          className="size-9 flex items-center justify-center rounded-full bg-surface-variant text-text-secondary screen-only"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="12" y1="12" x2="12" y2="18" />
            <polyline points="9 15 12 18 15 15" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => setShowShare(true)}
          className="size-9 flex items-center justify-center rounded-full bg-surface-variant text-text-secondary ml-sm screen-only"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
        </button>
      </header>

      <div className="print-report-header">
        <h1 className="text-headline-lg" style={{ color: "var(--color-primary)" }}>
          Materna — Informe de Tensión Arterial
        </h1>
        <p className="text-body-sm text-text-secondary">
          Generado el {new Date().toLocaleDateString("es-ES")}
        </p>
      </div>

      <main className="flex-1 px-lg py-lg space-y-lg">
        <SummaryCard metrics={metrics} />
        <AveragesCard metrics={metrics} />
        <HealthCard metrics={metrics} />
        <RangesCard metrics={metrics} />

        {records.length >= 2 && (
          <section className="card-surface">
            <h2 className="text-headline-sm mb-md">Evolución</h2>
            <BPChart records={records} />
          </section>
        )}

        <RecordsTable records={records} />
      </main>

      <BottomNav />

      {showShare && <ShareModal onClose={() => setShowShare(false)} />}
    </>
  );
}
