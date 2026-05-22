export function formatDateLabel(dateStr: string) {
  const today = new Date();
  const date = new Date(dateStr + "T00:00:00");
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  const diff = (today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);

  if (diff === 0) return "Hoy";
  if (diff === 1) return "Ayer";

  return dateStr.slice(8) + "/" + dateStr.slice(5, 7);
}

export function formatTime(isoStr: string) {
  return isoStr.slice(11, 16);
}

export function isNormal(systolic: number, diastolic: number) {
  return systolic < 130 && diastolic < 85;
}
