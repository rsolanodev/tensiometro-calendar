"use client";

import { useState } from "react";

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

const mockEntries = [
  {
    date: "Hoy",
    systolic: 118,
    diastolic: 76,
    pulse: 72,
    pill: true,
    time: "08:30",
  },
  {
    date: "Ayer",
    systolic: 122,
    diastolic: 80,
    pulse: 75,
    pill: true,
    time: "08:15",
  },
  {
    date: "21 May",
    systolic: 116,
    diastolic: 74,
    pulse: 70,
    pill: false,
    time: "09:00",
  },
  {
    date: "20 May",
    systolic: 120,
    diastolic: 78,
    pulse: 73,
    pill: true,
    time: "08:45",
  },
];

export default function Home() {
  const weekNumber = 24;
  const dayNumber = 3;
  const progressPercent = (weekNumber / 40) * 100;
  const [activeNav, setActiveNav] = useState("home");

  return (
    <>
      <header className="app-bar">
        <h1 className="text-headline-sm flex-1">Materna</h1>
        <button
          type="button"
          className="size-9 flex items-center justify-center rounded-full bg-primary-soft text-primary"
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
            <circle cx="12" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
            <circle cx="5" cy="12" r="1" />
          </svg>
        </button>
      </header>

      <main className="flex-1 px-lg py-lg space-y-lg">
        {/* Welcome + Progress Ring */}
        <section className="card-surface flex flex-col items-center py-xl gap-md">
          <p className="text-body-sm text-text-secondary">Semana de embarazo</p>

          <div className="relative flex items-center justify-center">
            <ProgressRing percentage={progressPercent} size={200} strokeWidth={10} />
            <div className="absolute flex flex-col items-center">
              <span className="text-headline-lg text-primary">{weekNumber}</span>
              <span className="text-label-sm text-text-secondary">semanas</span>
              <span className="text-label-sm text-text-secondary mt-xs">
                Día {dayNumber}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-md w-full mt-md">
            <div className="flex flex-col items-center gap-xs py-sm px-xs rounded-lg bg-surface-variant">
              <span className="text-label-sm text-text-secondary">Sistólica</span>
              <span className="text-headline-sm text-text-primary">118</span>
              <span className="text-label-sm text-success">Normal</span>
            </div>
            <div className="flex flex-col items-center gap-xs py-sm px-xs rounded-lg bg-surface-variant">
              <span className="text-label-sm text-text-secondary">Diastólica</span>
              <span className="text-headline-sm text-text-primary">76</span>
              <span className="text-label-sm text-success">Normal</span>
            </div>
            <div className="flex flex-col items-center gap-xs py-sm px-xs rounded-lg bg-surface-variant">
              <span className="text-label-sm text-text-secondary">Pulso</span>
              <span className="text-headline-sm text-text-primary">72</span>
              <span className="text-label-sm text-text-secondary">bpm</span>
            </div>
          </div>

          <button type="button" className="btn-primary w-full mt-sm">
            Registrar hoy
          </button>
        </section>

        {/* Resumen de hoy */}
        <section className="card-surface">
          <div className="flex items-center justify-between mb-md">
            <h2 className="text-headline-sm">Resumen de hoy</h2>
            <span className="pill-day-counter text-label-sm">08:30</span>
          </div>

          <div className="flex items-center gap-md py-sm">
            <div className="size-10 rounded-full bg-success/20 flex items-center justify-center text-success shrink-0">
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
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-body-sm text-text-primary">
                Pastilla tomada correctamente
              </p>
              <p className="text-label-sm text-text-secondary">
                Registro completo del día
              </p>
            </div>
          </div>
        </section>

        {/* Últimos registros */}
        <section>
          <h2 className="text-headline-sm mb-md">Últimos registros</h2>

          <div className="space-y-sm">
            {mockEntries.map((entry) => (
              <div key={entry.date} className="list-item-article">
                <div className="flex flex-col items-center min-w-12">
                  <span className="text-label-sm text-text-secondary">
                    {entry.date}
                  </span>
                  <span className="text-label-sm text-text-secondary">
                    {entry.time}
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
                    {entry.pill ? (
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
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <button
          type="button"
          className="flex flex-col items-center gap-xs"
          onClick={() => setActiveNav("home")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill={activeNav === "home" ? "var(--color-primary)" : "none"}
            stroke={
              activeNav === "home"
                ? "var(--color-primary)"
                : "var(--color-text-secondary)"
            }
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span
            className={
              activeNav === "home"
                ? "text-label-sm text-primary"
                : "text-label-sm text-text-secondary"
            }
          >
            Inicio
          </span>
        </button>

        <button
          type="button"
          className="flex flex-col items-center gap-xs"
          onClick={() => setActiveNav("calendar")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill={activeNav === "calendar" ? "var(--color-primary)" : "none"}
            stroke={
              activeNav === "calendar"
                ? "var(--color-primary)"
                : "var(--color-text-secondary)"
            }
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span
            className={
              activeNav === "calendar"
                ? "text-label-sm text-primary"
                : "text-label-sm text-text-secondary"
            }
          >
            Calendario
          </span>
        </button>

        <button
          type="button"
          className="flex flex-col items-center gap-xs"
          onClick={() => setActiveNav("stats")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill={activeNav === "stats" ? "var(--color-primary)" : "none"}
            stroke={
              activeNav === "stats"
                ? "var(--color-primary)"
                : "var(--color-text-secondary)"
            }
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
          <span
            className={
              activeNav === "stats"
                ? "text-label-sm text-primary"
                : "text-label-sm text-text-secondary"
            }
          >
            Estadísticas
          </span>
        </button>

        <button
          type="button"
          className="flex flex-col items-center gap-xs"
          onClick={() => setActiveNav("profile")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill={activeNav === "profile" ? "var(--color-primary)" : "none"}
            stroke={
              activeNav === "profile"
                ? "var(--color-primary)"
                : "var(--color-text-secondary)"
            }
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span
            className={
              activeNav === "profile"
                ? "text-label-sm text-primary"
                : "text-label-sm text-text-secondary"
            }
          >
            Perfil
          </span>
        </button>
      </nav>
    </>
  );
}
