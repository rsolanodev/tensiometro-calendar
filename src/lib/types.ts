export const PLACES = [
  "Matrona",
  "Centro de Salud",
  "Hospital General",
  "Hospital 9 de Octubre",
  "Hospital La Fe",
] as const;

export type Place = (typeof PLACES)[number];

export const PLACE_COLORS: Record<Place, string> = {
  Matrona: "#FF8AA5",
  "Centro de Salud": "#5BC8A8",
  "Hospital General": "#4A90D9",
  "Hospital 9 de Octubre": "#FF9F43",
  "Hospital La Fe": "#A66CFF",
};

export interface PressureRecord {
  id?: number;
  date: string;
  systolic: number;
  diastolic: number;
  pulse: number;
  pillTaken: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type NewPressureRecord = Omit<
  PressureRecord,
  "id" | "createdAt" | "updatedAt"
>;

export interface Appointment {
  id?: number;
  date: string;
  place: Place;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type NewAppointment = Omit<
  Appointment,
  "id" | "createdAt" | "updatedAt"
>;

export type ExportDataV1 = {
  version: 1;
  exportedAt: string;
  records: PressureRecord[];
  appointments: Appointment[];
};

export type ExportData = ExportDataV1;
