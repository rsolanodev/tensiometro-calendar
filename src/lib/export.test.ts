import { describe, it, expect, beforeEach } from "vitest";
import { generateExport, decodeExport, mergeImport } from "./export";
import { getRecordByDate, getAppointmentsByDate, getAllRecords, getAllAppointments, clearDB } from "./db";
import type { PressureRecord, Appointment } from "./types";

describe("generateExport / decodeExport", () => {
  beforeEach(async () => {
    await clearDB();
  });

  it("encodes and decodes roundtrip with data", async () => {
    const { saveRecord, addAppointment } = await import("./db");
    await saveRecord({ date: "2026-05-01", systolic: 120, diastolic: 80, pulse: 72, pillTaken: true });
    await addAppointment({ date: "2026-05-01", place: "Matrona", notes: "eco" });

    const encoded = await generateExport();
    const decoded = decodeExport(encoded);

    expect(decoded.version).toBe(1);
    expect(decoded.records).toHaveLength(1);
    expect(decoded.records[0].systolic).toBe(120);
    expect(decoded.appointments).toHaveLength(1);
    expect(decoded.appointments[0].place).toBe("Matrona");
  });

  it("encodes and decodes empty data", async () => {
    const encoded = await generateExport();
    const decoded = decodeExport(encoded);
    expect(decoded.records).toHaveLength(0);
    expect(decoded.appointments).toHaveLength(0);
  });

  it("throws on invalid base64 string", () => {
    expect(() => decodeExport("not-valid-base64!!!")).toThrow("Formato inválido");
  });

  it("throws on empty string", () => {
    expect(() => decodeExport("")).toThrow("Formato inválido");
  });

  it("throws on unknown version", () => {
    const json = JSON.stringify({ version: 99, records: [], appointments: [] });
    const { compressToBase64 } = require("lz-string");
    const encoded = compressToBase64(json);
    expect(() => decodeExport(encoded)).toThrow("Versión de exportación no soportada: 99");
  });
});

describe("mergeImport", () => {
  beforeEach(async () => {
    await clearDB();
  });

  it("imports records into IndexedDB", async () => {
    const data = {
      version: 1 as const,
      exportedAt: new Date().toISOString(),
      records: [
        { date: "2026-05-01", systolic: 120, diastolic: 80, pulse: 72, pillTaken: true, notes: undefined, createdAt: "", updatedAt: "" },
      ],
      appointments: [],
    };

    const result = await mergeImport(data);
    expect(result.recordsImported).toBe(1);

    const rec = await getRecordByDate("2026-05-01");
    expect(rec?.systolic).toBe(120);
  });

  it("imports appointments into IndexedDB", async () => {
    const data = {
      version: 1 as const,
      exportedAt: new Date().toISOString(),
      records: [],
      appointments: [
        { date: "2026-05-01", place: "Matrona" as const, notes: "eco", createdAt: "", updatedAt: "" },
      ],
    };

    const result = await mergeImport(data);
    expect(result.appointmentsImported).toBe(1);

    const apps = await getAppointmentsByDate("2026-05-01");
    expect(apps).toHaveLength(1);
    expect(apps[0].place).toBe("Matrona");
  });

  it("skips duplicate appointments (same date + place)", async () => {
    const { addAppointment } = await import("./db");
    await addAppointment({ date: "2026-05-01", place: "Matrona" });

    const data = {
      version: 1 as const,
      exportedAt: new Date().toISOString(),
      records: [],
      appointments: [
        { date: "2026-05-01", place: "Matrona" as const, notes: "eco", createdAt: "", updatedAt: "" },
      ],
    };

    const result = await mergeImport(data);
    expect(result.appointmentsSkipped).toBe(1);
    expect(result.appointmentsImported).toBe(0);

    const apps = await getAppointmentsByDate("2026-05-01");
    expect(apps).toHaveLength(1);
  });

  it("reports correct counts for mixed data", async () => {
    const data = {
      version: 1 as const,
      exportedAt: new Date().toISOString(),
      records: [
        { date: "2026-05-01", systolic: 120, diastolic: 80, pulse: 72, pillTaken: true, notes: "bien", createdAt: "", updatedAt: "" },
        { date: "2026-05-02", systolic: 130, diastolic: 85, pulse: 75, pillTaken: false, notes: undefined, createdAt: "", updatedAt: "" },
      ],
      appointments: [
        { date: "2026-05-03", place: "Centro de Salud" as const, notes: undefined, createdAt: "", updatedAt: "" },
        { date: "2026-05-03", place: "Hospital General" as const, notes: undefined, createdAt: "", updatedAt: "" },
      ],
    };

    const result = await mergeImport(data);
    expect(result.recordsImported).toBe(2);
    expect(result.appointmentsImported).toBe(2);
    expect(result.appointmentsSkipped).toBe(0);
  });
});
