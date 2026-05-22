"use client";

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
  return (
    <>
      <header className="app-bar">
        <h1 className="text-headline-sm flex-1">¡Hola mamá!</h1>
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


    </>
  );
}
