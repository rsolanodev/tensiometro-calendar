import { openDB, type IDBPDatabase } from "idb";
import type { PressureRecord, NewPressureRecord } from "./types";

const DB_NAME = "materna";
const DB_VERSION = 1;
const STORE_NAME = "records";

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDb() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, {
            keyPath: "id",
            autoIncrement: true,
          });
          store.createIndex("by-date", "date", { unique: true });
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
  return db.add(STORE_NAME, record) as Promise<number>;
}

export async function updateRecord(
  data: PressureRecord
): Promise<void> {
  const db = await getDb();
  const record = {
    ...data,
    updatedAt: new Date().toISOString(),
  };
  await db.put(STORE_NAME, record);
}

export async function getRecordByDate(
  date: string
): Promise<PressureRecord | undefined> {
  const db = await getDb();
  const index = db.transaction(STORE_NAME).store.index("by-date");
  return index.get(date);
}

export async function getAllRecords(): Promise<PressureRecord[]> {
  const db = await getDb();
  const records = await db.getAll(STORE_NAME);
  return records.reverse();
}

export async function getRecordsInRange(
  fromDate: string,
  toDate: string
): Promise<PressureRecord[]> {
  const db = await getDb();
  const index = db.transaction(STORE_NAME).store.index("by-date");
  const range = IDBKeyRange.bound(fromDate, toDate);
  const records = await index.getAll(range);
  return records.reverse();
}

export async function deleteRecord(id: number): Promise<void> {
  const db = await getDb();
  await db.delete(STORE_NAME, id);
}
