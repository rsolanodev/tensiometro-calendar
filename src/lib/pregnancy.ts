export function getPregnancyWeek(
  startDateStr?: string,
  today?: Date
) {
  const defaultStart =
    process.env.NEXT_PUBLIC_PREGNANCY_START_DATE || "23/02/2026";
  const startStr = startDateStr || defaultStart;

  const [day, month, year] = startStr.split("/").map(Number);
  const start = new Date(year, month - 1, day);
  const referenceDate = today ? new Date(today) : new Date();

  referenceDate.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);

  const diffMs = referenceDate.getTime() - start.getTime();
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const week = Math.floor(totalDays / 7) + 1;
  const dayOfWeek = totalDays % 7;

  return { week, dayOfWeek, totalDays };
}
