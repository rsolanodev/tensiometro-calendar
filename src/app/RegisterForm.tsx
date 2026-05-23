"use client";

import { useState } from "react";
import type { NewPressureRecord } from "@/lib/types";
import { getSpainToday, getSpainTimeString } from "@/lib/helpers";

type Props = {
  onSave: (data: NewPressureRecord) => void | Promise<void>;
  onCancel: () => void;
  initialDate?: string;
};

export default function RegisterForm({ onSave, onCancel, initialDate }: Props) {
  const [date, setDate] = useState(initialDate ?? getSpainToday());
  const [time, setTime] = useState(getSpainTimeString());
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [pulse, setPulse] = useState("");
  const [pillTaken, setPillTaken] = useState(false);
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  function validate() {
    const errs: Record<string, string> = {};
    const sys = Number(systolic);
    const dia = Number(diastolic);
    const pul = Number(pulse);

    if (!systolic || sys < 60 || sys > 250)
      errs.systolic = "Valor entre 60 y 250";
    if (!diastolic || dia < 30 || dia > 150)
      errs.diastolic = "Valor entre 30 y 150";
    if (!pulse || pul < 30 || pul > 220)
      errs.pulse = "Valor entre 30 y 220";
    if (!date) errs.date = "Selecciona una fecha";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSaveError("");
    setSaving(true);
    try {
      await onSave({
        date,
        time: time || undefined,
        systolic: Number(systolic),
        diastolic: Number(diastolic),
        pulse: Number(pulse),
        pillTaken,
        notes: notes || undefined,
      });
    } catch {
      setSaveError("Error al guardar. Inténtalo de nuevo.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30">
      <form
        onSubmit={handleSubmit}
        className="card-surface w-full sm:max-w-md rounded-b-none sm:rounded-b-md max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-lg">
          <h2 className="text-headline-sm">Nuevo registro</h2>
          <button
            type="button"
            onClick={onCancel}
            className="size-9 flex items-center justify-center rounded-full bg-surface-variant text-text-secondary"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="space-y-md">
          <div>
            <label className="text-label-sm text-text-secondary block mb-xs">Fecha</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-full border border-border-subtle bg-surface px-md py-sm text-body-md text-text-primary outline-none focus:border-primary"
            />
            {errors.date && <p className="text-label-sm text-primary mt-xs">{errors.date}</p>}
          </div>

          <div>
            <label className="text-label-sm text-text-secondary block mb-xs">Hora</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full rounded-full border border-border-subtle bg-surface px-md py-sm text-body-md text-text-primary outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-3 gap-sm">
            <div>
              <label className="text-label-sm text-text-secondary block mb-xs">Sistólica</label>
              <input
                type="number"
                inputMode="numeric"
                placeholder="120"
                value={systolic}
                onChange={(e) => setSystolic(e.target.value)}
                className="w-full rounded-full border border-border-subtle bg-surface px-md py-sm text-body-md text-text-primary outline-none focus:border-primary text-center"
              />
              {errors.systolic && <p className="text-label-sm text-primary mt-xs text-center">{errors.systolic}</p>}
            </div>
            <div>
              <label className="text-label-sm text-text-secondary block mb-xs">Diastólica</label>
              <input
                type="number"
                inputMode="numeric"
                placeholder="80"
                value={diastolic}
                onChange={(e) => setDiastolic(e.target.value)}
                className="w-full rounded-full border border-border-subtle bg-surface px-md py-sm text-body-md text-text-primary outline-none focus:border-primary text-center"
              />
              {errors.diastolic && <p className="text-label-sm text-primary mt-xs text-center">{errors.diastolic}</p>}
            </div>
            <div>
              <label className="text-label-sm text-text-secondary block mb-xs">Pulso</label>
              <input
                type="number"
                inputMode="numeric"
                placeholder="72"
                value={pulse}
                onChange={(e) => setPulse(e.target.value)}
                className="w-full rounded-full border border-border-subtle bg-surface px-md py-sm text-body-md text-text-primary outline-none focus:border-primary text-center"
              />
              {errors.pulse && <p className="text-label-sm text-primary mt-xs text-center">{errors.pulse}</p>}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-md cursor-pointer py-sm">
              <button
                type="button"
                onClick={() => setPillTaken(!pillTaken)}
                className={`size-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  pillTaken
                    ? "bg-success border-success"
                    : "border-border-subtle bg-surface"
                }`}
              >
                {pillTaken && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
              <span className="text-body-md text-text-primary flex-1">
                Pastilla tomada
              </span>
            </label>
          </div>

          <div>
            <label className="text-label-sm text-text-secondary block mb-xs">Notas o síntomas</label>
            <textarea
              placeholder="Opcional — cómo te sientes hoy..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full rounded-md border border-border-subtle bg-surface px-md py-sm text-body-md text-text-primary outline-none focus:border-primary resize-none"
            />
          </div>
        </div>

        {saveError && (
          <p className="text-label-sm text-primary text-center mt-md">{saveError}</p>
        )}

        <div className="flex gap-sm mt-xl">
          <button type="button" onClick={onCancel} className="btn-secondary flex-1">
            Cancelar
          </button>
          <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-50">
            {saving ? "Guardando…" : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}
