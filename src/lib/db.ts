import { openDB, type IDBPDatabase } from "idb";
import type {
  PressureRecord,
  NewPressureRecord,
  Appointment,
  NewAppointment,
} from "./types";

const DB_NAME = "materna";
const DB_VERSION = 2;
const RECORDS_STORE = "records";
const APPOINTMENTS_STORE = "appointments";

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDb() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion) {
        if (oldVersion < 1) {
          const store = db.createObjectStore(RECORDS_STORE, {
            keyPath: "id",
            autoIncrement: true,
          });
          store.createIndex("by-date", "date", { unique: true });
        }
        if (oldVersion < 2) {
          const store = db.createObjectStore(APPOINTMENTS_STORE, {
            keyPath: "id",
            autoIncrement: true,
          });
          store.createIndex("by-date", "date", { unique: false });
        }
      },
    });
  }
  return dbPromise;
}

export async function addRecord(
  data: NewPressureRecord
): Promise<number> {
  const db = await getDb();
  const now = new Date().toISOString();
  const record: PressureRecord = {
    ...data,
    createdAt: now,
    updatedAt: now,
  };
  return db.add(RECORDS_STORE, record) as Promise<number>;
}

export async function saveRecord(
  data: NewPressureRecord
): Promise<number> {
  const existing = await getRecordByDate(data.date);
  if (existing) {
    await updateRecord({ ...existing, ...data });
    return existing.id!;
  }
  return addRecord(data);
}

export async function updateRecord(
  data: PressureRecord
): Promise<void> {
  const db = await getDb();
  const record = {
    ...data,
    updatedAt: new Date().toISOString(),
  };
  await db.put(RECORDS_STORE, record);
}

export async function getRecordByDate(
  date: string
): Promise<PressureRecord | undefined> {
  const db = await getDb();
  const index = db.transaction(RECORDS_STORE).store.index("by-date");
  return index.get(date);
}

export async function getAllRecords(): Promise<PressureRecord[]> {
  const db = await getDb();
  const records = await db.getAll(RECORDS_STORE);
  return records.reverse();
}

export async function getRecordsInRange(
  fromDate: string,
  toDate: string
): Promise<PressureRecord[]> {
  const db = await getDb();
  const index = db.transaction(RECORDS_STORE).store.index("by-date");
  const range = IDBKeyRange.bound(fromDate, toDate);
  const records = await index.getAll(range);
  return records.reverse();
}

export async function deleteRecord(id: number): Promise<void> {
  const db = await getDb();
  await db.delete(RECORDS_STORE, id);
}

// ─── Appointments ───────────────────────────────────────────

export async function addAppointment(
  data: NewAppointment
): Promise<number> {
  const db = await getDb();
  const now = new Date().toISOString();
  const appointment: Appointment = {
    ...data,
    createdAt: now,
    updatedAt: now,
  };
  return db.add(APPOINTMENTS_STORE, appointment) as Promise<number>;
}

export async function updateAppointment(
  data: Appointment
): Promise<void> {
  const db = await getDb();
  await db.put(APPOINTMENTS_STORE, {
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

export async function getAppointmentsByDate(
  date: string
): Promise<Appointment[]> {
  const db = await getDb();
  const index = db.transaction(APPOINTMENTS_STORE).store.index("by-date");
  return index.getAll(date);
}

export async function getAllAppointments(): Promise<Appointment[]> {
  const db = await getDb();
  const records = await db.getAll(APPOINTMENTS_STORE);
  return records.reverse();
}

export async function deleteAppointment(id: number): Promise<void> {
  const db = await getDb();
  await db.delete(APPOINTMENTS_STORE, id);
}
