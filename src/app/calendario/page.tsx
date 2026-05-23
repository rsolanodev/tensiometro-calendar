"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { getSpainToday, isNormal } from "@/lib/helpers";
import {
  addAppointment,
  getAllAppointments,
  getAppointmentsByDate,
  deleteAppointment,
  saveRecord,
  getRecordByDate,
} from "@/lib/db";
import type {
  Appointment,
  NewAppointment,
  Place,
  PressureRecord,
  NewPressureRecord,
} from "@/lib/types";
import { PLACES, PLACE_COLORS } from "@/lib/types";
import BottomNav from "../BottomNav";
import AppointmentForm from "../AppointmentForm";
import RegisterForm from "../RegisterForm";
import ShareModal from "../ShareModal";

const WEEKDAYS = ["L", "M", "X", "J", "V", "S", "D"];

function getMonthGrid(year: number, month: number) {
  const first = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const offset = first === 0 ? 6 : first - 1;
  const grid: (number | null)[] = Array(offset).fill(null);
  for (let d = 1; d <= daysInMonth; d++) grid.push(d);
  while (grid.length % 7 !== 0) grid.push(null);
  return grid;
}

function dateStr(year: number, month: number, day: number) {
  const m = String(month + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

export default function CalendarioPage() {
  const today = getSpainToday();
  const [year, setYear] = useState(() => Number(today.slice(0, 4)));
  const [month, setMonth] = useState(() => Number(today.slice(5, 7)) - 1);
  const [selectedDay, setSelectedDay] = useState<number | null>(
    () => Number(today.slice(8))
  );
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [monthApps, setMonthApps] = useState<Map<string, Place[]>>(new Map());
  const [showAppForm, setShowAppForm] = useState(false);
  const [showRegForm, setShowRegForm] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<
    PressureRecord | undefined
  >();
  const [daysWithRecord, setDaysWithRecord] = useState<Set<string>>(new Set());

  const monthName = new Date(year, month).toLocaleString("es-ES", {
    month: "long",
  });
  const todayDay = Number(today.slice(8));
  const todayMonth = Number(today.slice(5, 7)) - 1;
  const todayYear = Number(today.slice(0, 4));

  const grid = useMemo(() => getMonthGrid(year, month), [year, month]);

  const selectedDate =
    selectedDay !== null ? dateStr(year, month, selectedDay) : null;

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const loadAll = useCallback(async () => {
    const all = await getAllAppointments();
    const from = dateStr(year, month, 1);
    const to = dateStr(year, month, daysInMonth);

    const appMap = new Map<string, Place[]>();
    for (const app of all) {
      if (app.date >= from && app.date <= to) {
        const existing = appMap.get(app.date) ?? [];
        existing.push(app.place);
        appMap.set(app.date, existing);
      }
    }
    setMonthApps(appMap);

    if (selectedDate) {
      const dayApps = await getAppointmentsByDate(selectedDate);
      setAppointments(dayApps);
      const rec = await getRecordByDate(selectedDate);
      setSelectedRecord(rec);
    }

    const { getAllRecords } = await import("@/lib/db");
    const allRecords = await getAllRecords();
    const recSet = new Set<string>();
    for (const r of allRecords) {
      recSet.add(r.date);
    }
    setDaysWithRecord(recSet);
  }, [year, month, selectedDate, daysInMonth]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  async function handleSaveApp(data: NewAppointment) {
    await addAppointment(data);
    setShowAppForm(false);
    await loadAll();
  }

  async function handleDeleteApp(id: number) {
    await deleteAppointment(id);
    await loadAll();
  }

  async function handleSaveRecord(data: NewPressureRecord) {
    await saveRecord(data);
    setShowRegForm(false);
    await loadAll();
  }

  function prevMonth() {
    if (month === 0) {
      setYear((y) => y - 1);
      setMonth(11);
    } else {
      setMonth((m) => m - 1);
    }
    setSelectedDay(null);
  }

  function nextMonth() {
    if (month === 11) {
      setYear((y) => y + 1);
      setMonth(0);
    } else {
      setMonth((m) => m + 1);
    }
    setSelectedDay(null);
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
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        <h1 className="text-headline-sm flex-1">Calendario</h1>
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
        <section className="card-surface">
          <div className="flex items-center justify-between mb-lg">
            <button
              type="button"
              onClick={prevMonth}
              className="size-9 flex items-center justify-center rounded-full bg-surface-variant text-text-secondary"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <h2 className="text-headline-md capitalize">
              {monthName} {year}
            </h2>
            <button
              type="button"
              onClick={nextMonth}
              className="size-9 flex items-center justify-center rounded-full bg-surface-variant text-text-secondary"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center mb-sm">
            {WEEKDAYS.map((d) => (
              <span key={d} className="text-label-sm text-text-secondary py-xs">
                {d}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {grid.map((day, i) =>
              day === null ? (
                <div key={`e-${i}`} />
              ) : (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedDay(day)}
                  className={`relative py-sm rounded-full text-body-sm transition-colors ${
                    day === selectedDay && day === todayDay && month === todayMonth && year === todayYear
                      ? "bg-primary text-surface font-semibold ring-2 ring-primary-soft"
                      : day === selectedDay
                        ? "bg-primary-soft text-text-primary font-semibold"
                        : day === todayDay && month === todayMonth && year === todayYear
                          ? "text-text-primary font-semibold"
                          : "text-text-primary"
                  }`}
                >
                  {day}
                  {(monthApps.has(dateStr(year, month, day)) ||
                    daysWithRecord.has(dateStr(year, month, day))) && (
                    <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 flex gap-0.5">
                      {daysWithRecord.has(dateStr(year, month, day)) && (
                        <span className="size-1.5 rounded-full bg-success" />
                      )}
                      {monthApps.get(dateStr(year, month, day))?.map((p, idx) => (
                        <span
                          key={idx}
                          className="size-1.5 rounded-full"
                          style={{ backgroundColor: PLACE_COLORS[p] }}
                        />
                      ))}
                    </span>
                  )}
                </button>
              )
            )}
          </div>
        </section>

        {selectedDate && (
          <>
            {/* Pressure record for the selected day */}
            <section className="card-surface">
              <div className="flex items-center justify-between mb-md">
                <h3 className="text-headline-sm">Registro de tensión</h3>
                <button
                  type="button"
                  onClick={() => setShowRegForm(true)}
                  className="btn-secondary text-label-sm !py-xs !px-md"
                >
                  {selectedRecord ? "Editar" : "+ Añadir"}
                </button>
              </div>

              {selectedRecord ? (
                <div className="grid grid-cols-3 gap-md">
                  <div className="flex flex-col items-center gap-xs py-sm rounded-lg bg-surface-variant">
                    <span className="text-label-sm text-text-secondary">
                      Sistólica
                    </span>
                    <span className="text-headline-sm text-text-primary">
                      {selectedRecord.systolic}
                    </span>
                    <span
                      className={`text-label-sm ${
                        isNormal(
                          selectedRecord.systolic,
                          selectedRecord.diastolic
                        )
                          ? "text-success"
                          : "text-primary"
                      }`}
                    >
                      {isNormal(
                        selectedRecord.systolic,
                        selectedRecord.diastolic
                      )
                        ? "Normal"
                        : "Alerta"}
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-xs py-sm rounded-lg bg-surface-variant">
                    <span className="text-label-sm text-text-secondary">
                      Diastólica
                    </span>
                    <span className="text-headline-sm text-text-primary">
                      {selectedRecord.diastolic}
                    </span>
                    <span
                      className={`text-label-sm ${
                        isNormal(
                          selectedRecord.systolic,
                          selectedRecord.diastolic
                        )
                          ? "text-success"
                          : "text-primary"
                      }`}
                    >
                      {isNormal(
                        selectedRecord.systolic,
                        selectedRecord.diastolic
                      )
                        ? "Normal"
                        : "Alerta"}
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-xs py-sm rounded-lg bg-surface-variant">
                    <span className="text-label-sm text-text-secondary">
                      Pulso
                    </span>
                    <span className="text-headline-sm text-text-primary">
                      {selectedRecord.pulse}
                    </span>
                    <span className="text-label-sm text-text-secondary">
                      bpm
                    </span>
                  </div>
                  {selectedRecord.time && (
                    <div className="col-span-3 text-center">
                      <span className="text-label-sm text-text-secondary">
                        {selectedRecord.time}
                      </span>
                    </div>
                  )}
                  {selectedRecord.pillTaken && (
                    <div className="col-span-3 flex items-center gap-sm py-sm px-md rounded-lg bg-success/10 text-success">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span className="text-label-sm font-medium">
                        Pastilla tomada
                      </span>
                    </div>
                  )}
                  {selectedRecord.notes && (
                    <div className="col-span-3">
                      <p className="text-label-sm text-text-secondary">
                        {selectedRecord.notes}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-body-sm text-text-secondary text-center py-md">
                  No hay registro para este día
                </p>
              )}
            </section>

            {/* Appointments for the selected day */}
            <section className="card-surface">
              <div className="flex items-center justify-between mb-md">
                <h3 className="text-headline-sm">Citas médicas</h3>
                <button
                  type="button"
                  onClick={() => setShowAppForm(true)}
                  className="btn-secondary text-label-sm !py-xs !px-md"
                >
                  + Añadir
                </button>
              </div>

              {appointments.length === 0 ? (
                <p className="text-body-sm text-text-secondary text-center py-md">
                  No hay citas para este día
                </p>
              ) : (
                <div className="space-y-sm">
                  {appointments.map((app) => (
                    <div key={app.id} className="list-item-article">
                      <span
                        className="size-3 rounded-full shrink-0"
                        style={{ backgroundColor: PLACE_COLORS[app.place] }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-body-sm font-semibold text-text-primary">
                          {app.place}
                        </p>
                        {app.notes && (
                          <p className="text-label-sm text-text-secondary truncate">
                            {app.notes}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          app.id !== undefined && handleDeleteApp(app.id)
                        }
                        className="size-8 flex items-center justify-center rounded-full bg-surface-variant text-text-secondary shrink-0"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        <section>
          <h4 className="text-label-sm text-text-secondary mb-sm">Lugares</h4>
          <div className="flex flex-wrap gap-sm">
            {PLACES.map((p) => (
              <span
                key={p}
                className="chip-topic"
                style={
                  {
                    backgroundColor: PLACE_COLORS[p] + "20",
                    color: PLACE_COLORS[p],
                  } as React.CSSProperties
                }
              >
                <span
                  className="size-2 rounded-full mr-xs"
                  style={{ backgroundColor: PLACE_COLORS[p] }}
                />
                {p}
              </span>
            ))}
          </div>
        </section>
      </main>

      <BottomNav />

      {showAppForm && (
        <AppointmentForm
          initialDate={selectedDate ?? undefined}
          onSave={handleSaveApp}
          onCancel={() => setShowAppForm(false)}
        />
      )}

      {showRegForm && (
        <RegisterForm
          initialDate={selectedDate ?? undefined}
          initialSystolic={selectedRecord?.systolic}
          initialDiastolic={selectedRecord?.diastolic}
          initialPulse={selectedRecord?.pulse}
          onSave={handleSaveRecord}
          onCancel={() => setShowRegForm(false)}
        />
      )}

      {showShare && (
        <ShareModal onClose={() => setShowShare(false)} />
      )}
    </>
  );
}
