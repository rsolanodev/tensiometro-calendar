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
