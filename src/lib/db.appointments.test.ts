import { describe, it, expect, beforeEach } from "vitest";
import {
  addAppointment,
  getAppointmentsByDate,
  getAllAppointments,
  deleteAppointment,
} from "./db";

const baseApp = {
  date: "2026-05-22",
  place: "Matrona" as const,
};

beforeEach(async () => {
  const existing = await getAllAppointments();
  for (const a of existing) {
    if (a.id !== undefined) await deleteAppointment(a.id);
  }
});

describe("appointments db", () => {
  it("adds an appointment and returns an id", async () => {
    const id = await addAppointment(baseApp);
    expect(id).toBeGreaterThan(0);
  });

  it("retrieves appointments by date", async () => {
    await addAppointment(baseApp);
    await addAppointment({ ...baseApp, place: "Centro de Salud" });

    const apps = await getAppointmentsByDate("2026-05-22");
    expect(apps).toHaveLength(2);
    expect(apps[0].place).toBe("Matrona");
    expect(apps[1].place).toBe("Centro de Salud");
  });

  it("returns empty array for a date with no appointments", async () => {
    const apps = await getAppointmentsByDate("2026-01-01");
    expect(apps).toEqual([]);
  });

  it("retrieves all appointments ordered by date desc", async () => {
    await addAppointment({ date: "2026-05-21", place: "Matrona" });
    await addAppointment({ date: "2026-05-23", place: "Hospital General" });

    const all = await getAllAppointments();
    expect(all).toHaveLength(2);
    expect(all[0].date).toBe("2026-05-23");
    expect(all[1].date).toBe("2026-05-21");
  });

  it("handles multiple appointments on the same date", async () => {
    await addAppointment({ date: "2026-05-22", place: "Matrona" });
    await addAppointment({ date: "2026-05-22", place: "Hospital La Fe" });

    const apps = await getAppointmentsByDate("2026-05-22");
    expect(apps).toHaveLength(2);
  });

  it("deletes an appointment", async () => {
    const id = await addAppointment(baseApp);
    await deleteAppointment(id);

    const apps = await getAppointmentsByDate("2026-05-22");
    expect(apps).toEqual([]);
  });
});
