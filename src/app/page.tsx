"use client";

import { useEffect, useState, useCallback } from "react";
import { getPregnancyWeek } from "@/lib/pregnancy";
import {
  addRecord,
  getAllRecords,
  getRecordByDate,
} from "@/lib/db";
import type { PressureRecord, NewPressureRecord } from "@/lib/types";
import { formatDateLabel, formatSpainTime, getSpainToday, isNormal } from "@/lib/helpers";
import RegisterForm from "./RegisterForm";

function ProgressRing({
  percentage,
  size = 220,
  strokeWidth = 12,
}: {
  percentage: number;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="var(--color-chart-secondary)"
        strokeWidth={strokeWidth}
        fill="none"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="var(--color-chart-primary)"
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="transition-all duration-700 ease-out"
      />
    </svg>
  );
}

export default function Home() {
  const { week, dayOfWeek } = getPregnancyWeek();
  const progressPercent = Math.min((week / 40) * 100, 100);
  const [records, setRecords] = useState<PressureRecord[]>([]);
  const [todayRecord, setTodayRecord] = useState<PressureRecord | undefined>();
  const [showForm, setShowForm] = useState(false);

  const today = getSpainToday();

  const loadRecords = useCallback(async () => {
    const all = await getAllRecords();
    setRecords(all);
    const todayRec = await getRecordByDate(today);
    setTodayRecord(todayRec);
  }, [today]);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  const latest = records.length > 0 ? records[0] : undefined;

  async function handleSave(data: NewPressureRecord) {
    await addRecord(data);
    setShowForm(false);
    await loadRecords();
  }

  return (
    <>
      <header className="app-bar">
        <h1 className="text-headline-sm flex-1">👶🏽 ¡Hola mamá!</h1>
      </header>

      <main className="flex-1 px-lg py-lg space-y-lg">
        <section className="card-surface flex flex-col items-center py-xl gap-md">
          <p className="text-body-sm text-text-secondary">Semana de embarazo</p>

          <div className="relative flex items-center justify-center">
            <ProgressRing
              percentage={progressPercent}
              size={200}
              strokeWidth={10}
            />
            <div className="absolute flex flex-col items-center">
              <span className="text-headline-lg text-primary">{week}</span>
              <span className="text-label-sm text-text-secondary">semanas</span>
              <span className="text-label-sm text-text-secondary mt-xs">
                Día {dayOfWeek}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-md w-full mt-md">
            <div className="flex flex-col items-center gap-xs py-sm px-xs rounded-lg bg-surface-variant">
              <span className="text-label-sm text-text-secondary">Sistólica</span>
              <span className="text-headline-sm text-text-primary">
                {latest?.systolic ?? "—"}
              </span>
              {latest && (
                <span
                  className={`text-label-sm ${
                    isNormal(latest.systolic, latest.diastolic)
                      ? "text-success"
                      : "text-primary"
                  }`}
                >
                  {isNormal(latest.systolic, latest.diastolic)
                    ? "Normal"
                    : "Alerta"}
                </span>
              )}
            </div>
            <div className="flex flex-col items-center gap-xs py-sm px-xs rounded-lg bg-surface-variant">
              <span className="text-label-sm text-text-secondary">Diastólica</span>
              <span className="text-headline-sm text-text-primary">
                {latest?.diastolic ?? "—"}
              </span>
              {latest && (
                <span
                  className={`text-label-sm ${
                    isNormal(latest.systolic, latest.diastolic)
                      ? "text-success"
                      : "text-primary"
                  }`}
                >
                  {isNormal(latest.systolic, latest.diastolic)
                    ? "Normal"
                    : "Alerta"}
                </span>
              )}
            </div>
            <div className="flex flex-col items-center gap-xs py-sm px-xs rounded-lg bg-surface-variant">
              <span className="text-label-sm text-text-secondary">Pulso</span>
              <span className="text-headline-sm text-text-primary">
                {latest?.pulse ?? "—"}
              </span>
              <span className="text-label-sm text-text-secondary">bpm</span>
            </div>
          </div>

          <button
            type="button"
            className="btn-primary w-full mt-sm"
            onClick={() => setShowForm(true)}
          >
            Registrar hoy
          </button>
        </section>

        {todayRecord && (
          <section className="card-surface">
            <div className="flex items-center justify-between mb-md">
              <h2 className="text-headline-sm">Resumen de hoy</h2>
              <span className="pill-day-counter text-label-sm">
                {formatSpainTime(todayRecord.createdAt)}
              </span>
            </div>

            <div className="flex items-center gap-md py-sm">
              <div
                className={`size-10 rounded-full flex items-center justify-center shrink-0 ${
                  todayRecord.pillTaken
                    ? "bg-success/20 text-success"
                    : "bg-primary/20 text-primary"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {todayRecord.pillTaken ? (
                    <polyline points="20 6 9 17 4 12" />
                  ) : (
                    <line x1="18" y1="6" x2="6" y2="18" />
                  )}
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-body-sm text-text-primary">
                  {todayRecord.pillTaken
                    ? "Pastilla tomada correctamente"
                    : "Pastilla pendiente de tomar"}
                </p>
                <p className="text-label-sm text-text-secondary">
                  {todayRecord.systolic}/{todayRecord.diastolic} mmHg ·{" "}
                  {todayRecord.pulse} bpm
                </p>
              </div>
            </div>
          </section>
        )}

        <section>
          <h2 className="text-headline-sm mb-md">Últimos registros</h2>

          {records.length === 0 ? (
            <p className="text-body-md text-text-secondary text-center py-lg">
              Aún no hay registros. ¡Añade tu primer registro!
            </p>
          ) : (
            <div className="space-y-sm">
              {records.map((entry) => (
                <div key={entry.id} className="list-item-article">
                  <div className="flex flex-col items-center min-w-12">
                    <span className="text-label-sm text-text-secondary">
                      {formatDateLabel(entry.date)}
                    </span>
                    <span className="text-label-sm text-text-secondary">
                      {formatSpainTime(entry.createdAt)}
                    </span>
                  </div>

                  <div className="flex-1 grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-body-sm font-semibold text-text-primary">
                        {entry.systolic}/{entry.diastolic}
                      </p>
                      <p className="text-label-sm text-text-secondary">mmHg</p>
                    </div>
                    <div>
                      <p className="text-body-sm font-semibold text-text-primary">
                        {entry.pulse}
                      </p>
                      <p className="text-label-sm text-text-secondary">bpm</p>
                    </div>
                    <div className="flex items-center justify-center">
                      {entry.pillTaken ? (
                        <span className="text-label-sm text-success font-medium">
                          Tomada
                        </span>
                      ) : (
                        <span className="text-label-sm text-primary font-medium">
                          Pendiente
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {showForm && (
        <RegisterForm
          initialDate={todayRecord ? undefined : today}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
        />
      )}
    </>
  );
}
