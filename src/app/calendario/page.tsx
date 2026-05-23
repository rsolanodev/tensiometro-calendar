"use client";

import { useMemo } from "react";
import { getSpainToday } from "@/lib/helpers";
import BottomNav from "../BottomNav";

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

export default function CalendarioPage() {
  const today = getSpainToday();
  const [year, month] = today.split("-").map(Number);
  const monthName = new Date(year, month - 1).toLocaleString("es-ES", {
    month: "long",
  });
  const todayDay = Number(today.slice(8));

  const grid = useMemo(() => getMonthGrid(year, month - 1), [year, month]);

  return (
    <>
      <header className="app-bar">
        <h1 className="text-headline-sm flex-1">Calendario</h1>
      </header>

      <main className="flex-1 px-lg py-lg">
        <section className="card-surface">
          <h2 className="text-headline-md text-center capitalize mb-lg">
            {monthName} {year}
          </h2>

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
                <div
                  key={day}
                  className={`py-sm rounded-full text-body-sm ${
                    day === todayDay
                      ? "bg-primary text-surface font-semibold"
                      : "text-text-primary"
                  }`}
                >
                  {day}
                </div>
              )
            )}
          </div>
        </section>

        <p className="text-body-sm text-text-secondary text-center mt-lg">
          Selecciona un día para ver o añadir registros
        </p>
      </main>

      <BottomNav />
    </>
  );
}
