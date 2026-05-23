import { compressToBase64, decompressFromBase64 } from "lz-string";
import type { ExportData, ExportDataV1, PressureRecord, Appointment } from "./types";
import { saveRecord, getAppointmentsByDate, addAppointment, getAllRecords, getAllAppointments } from "./db";

const CURRENT_VERSION = 1 as const;

export async function generateExport(): Promise<string> {
  const records = await getAllRecords();
  const appointments = await getAllAppointments();

  const data: ExportDataV1 = {
    version: CURRENT_VERSION,
    exportedAt: new Date().toISOString(),
    records,
    appointments,
  };

  const json = JSON.stringify(data);
  return compressToBase64(json);
}

export function decodeExport(encoded: string): ExportData {
  const json = decompressFromBase64(encoded);
  if (json === null || json === undefined || json === "") {
    throw new Error("Formato inválido o datos corruptos");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new Error("Formato inválido o datos corruptos");
  }

  const data = parsed as ExportData;

  if (typeof data !== "object" || data === null) {
    throw new Error("Formato inválido o datos corruptos");
  }

  if (data.version !== 1) {
    throw new Error(`Versión de exportación no soportada: ${data.version}`);
  }

  return data;
}

export interface MergeResult {
  recordsImported: number;
  appointmentsImported: number;
  appointmentsSkipped: number;
}

export async function mergeImport(data: ExportData): Promise<MergeResult> {
  const result: MergeResult = { recordsImported: 0, appointmentsImported: 0, appointmentsSkipped: 0 };

  for (const record of data.records) {
    await saveRecord({
      date: record.date,
      systolic: record.systolic,
      diastolic: record.diastolic,
      pulse: record.pulse,
      pillTaken: record.pillTaken,
      notes: record.notes,
    });
    result.recordsImported++;
  }

  for (const appt of data.appointments) {
    const existing = await getAppointmentsByDate(appt.date);
    const dup = existing.find((e) => e.place === appt.place);
    if (dup) {
      result.appointmentsSkipped++;
    } else {
      await addAppointment({
        date: appt.date,
        place: appt.place,
        notes: appt.notes,
      });
      result.appointmentsImported++;
    }
  }

  return result;
}
