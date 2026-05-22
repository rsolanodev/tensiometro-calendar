const SPAIN_TZ = "Europe/Madrid";

function formatToSpainParts(date: Date) {
  return new Intl.DateTimeFormat("es-ES", {
    timeZone: SPAIN_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
}

export function getSpainToday(): string {
  const parts = formatToSpainParts(new Date());
  const year = parts.find((p) => p.type === "year")!.value;
  const month = parts.find((p) => p.type === "month")!.value;
  const day = parts.find((p) => p.type === "day")!.value;
  return `${year}-${month}-${day}`;
}

export function getSpainNow(): Date {
  const str = new Intl.DateTimeFormat("es-ES", {
    timeZone: SPAIN_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(new Date());

  const get = (t: string) => Number(str.find((p) => p.type === t)!.value);
  return new Date(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second"));
}

export function formatDateLabel(dateStr: string) {
  const todayParts = formatToSpainParts(new Date());
  const todayStr = `${todayParts.find((p) => p.type === "year")!.value}-${todayParts.find((p) => p.type === "month")!.value}-${todayParts.find((p) => p.type === "day")!.value}`;

  if (dateStr === todayStr) return "Hoy";

  const yesterday = new Date(todayStr + "T00:00:00");
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  if (dateStr === yesterdayStr) return "Ayer";

  return dateStr.slice(8) + "/" + dateStr.slice(5, 7);
}

export function formatSpainTime(isoStr: string) {
  const date = new Date(isoStr);
  return date.toLocaleTimeString("es-ES", {
    timeZone: SPAIN_TZ,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function isNormal(systolic: number, diastolic: number) {
  return systolic < 140 && diastolic < 90;
}
