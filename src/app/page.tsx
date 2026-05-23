"use client";

import { useEffect, useState, useCallback } from "react";
import { getPregnancyWeek } from "@/lib/pregnancy";
import {
  saveRecord, getAllRecords, getRecordByDate,
} from "@/lib/db";
import type { PressureRecord, NewPressureRecord } from "@/lib/types";
import { formatDateLabel, formatSpainTime, getSpainToday, isNormal } from "@/lib/helpers";
import RegisterForm from "./RegisterForm";
import BottomNav from "./BottomNav";
import ShareModal from "./ShareModal";

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
  const [showShare, setShowShare] = useState(false);

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
    await saveRecord(data);
    setShowForm(false);
    await loadRecords();
  }

  return (
    <>
      <header className="app-bar">
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
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
        <h1 className="text-headline-sm flex-1">Diario</h1>
        <button
          type="button"
          onClick={() => setShowShare(true)}
          className="size-9 flex items-center justify-center rounded-full bg-surface-variant text-text-secondary"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
        </button>
      </header>

      <main className="flex-1 px-lg py-lg space-y-lg">
        <section className="card-surface flex flex-col items-center py-xl gap-md">
          <p className="text-body-sm text-text-secondary">Semana de embarazo</p>

          <div className="flex flex-row items-center gap-lg w-full justify-center">
            <div className="relative shrink-0">
              <ProgressRing
                percentage={progressPercent}
                size={150}
                strokeWidth={12}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-headline-lg text-primary">{week}</span>
                <span className="text-label-sm text-text-secondary -mt-1">semanas</span>
                <span className="text-label-sm text-text-secondary">
                  Día {dayOfWeek}
                </span>
              </div>
            </div>

              <div className="flex flex-col gap-2 min-w-0">
              <div className="flex flex-col gap-0.5 py-2.5 px-4 rounded-lg bg-surface-variant">
                <span className="text-label-sm text-text-secondary">Sistólica</span>
                <div className="flex items-baseline gap-2">
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
              </div>
              <div className="flex flex-col gap-0.5 py-2.5 px-4 rounded-lg bg-surface-variant">
                <span className="text-label-sm text-text-secondary">Diastólica</span>
                <div className="flex items-baseline gap-2">
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
              </div>
              <div className="flex flex-col gap-0.5 py-2.5 px-4 rounded-lg bg-surface-variant">
                <span className="text-label-sm text-text-secondary">Pulso</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-headline-sm text-text-primary">
                    {latest?.pulse ?? "—"}
                  </span>
                  <span className="text-label-sm text-text-secondary">bpm</span>
                </div>
              </div>
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

      <BottomNav />

      {showForm && (
        <RegisterForm
          initialDate={todayRecord ? undefined : today}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
        />
      )}

      {showShare && (
        <ShareModal onClose={() => setShowShare(false)} />
      )}
    </>
  );
}
