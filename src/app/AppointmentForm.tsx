"use client";

import { useState } from "react";
import type { NewAppointment, Place } from "@/lib/types";
import { PLACES, PLACE_COLORS } from "@/lib/types";
import { getSpainToday } from "@/lib/helpers";

type Props = {
  onSave: (data: NewAppointment) => void;
  onCancel: () => void;
  initialDate?: string;
};

export default function AppointmentForm({
  onSave,
  onCancel,
  initialDate,
}: Props) {
  const [date, setDate] = useState(initialDate ?? getSpainToday());
  const [place, setPlace] = useState<Place>(PLACES[0]);
  const [notes, setNotes] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({ date, place, notes: notes || undefined });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30">
      <form
        onSubmit={handleSubmit}
        className="card-surface w-full sm:max-w-md rounded-b-none sm:rounded-b-md max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-lg">
          <h2 className="text-headline-sm">Nueva cita</h2>
          <button
            type="button"
            onClick={onCancel}
            className="size-9 flex items-center justify-center rounded-full bg-surface-variant text-text-secondary"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="space-y-md">
          <div>
            <label className="text-label-sm text-text-secondary block mb-xs">
              Fecha
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-full border border-border-subtle bg-surface px-md py-sm text-body-md text-text-primary outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-label-sm text-text-secondary block mb-xs">
              Lugar
            </label>
            <div className="space-y-sm">
              {PLACES.map((p) => {
                const color = PLACE_COLORS[p];
                return (
                  <label
                    key={p}
                    className={`flex items-center gap-md px-md py-sm rounded-full border-2 cursor-pointer transition-colors ${
                      place === p
                        ? "border-[var(--place-color)]"
                        : "border-border-subtle"
                    }`}
                    style={
                      { "--place-color": color } as React.CSSProperties
                    }
                  >
                    <input
                      type="radio"
                      name="place"
                      value={p}
                      checked={place === p}
                      onChange={() => setPlace(p)}
                      className="sr-only"
                    />
                    <span
                      className="size-4 rounded-full shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-body-md text-text-primary flex-1">
                      {p}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-label-sm text-text-secondary block mb-xs">
              Notas
            </label>
            <textarea
              placeholder="Opcional — motivo, indicaciones..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full rounded-md border border-border-subtle bg-surface px-md py-sm text-body-md text-text-primary outline-none focus:border-primary resize-none"
            />
          </div>
        </div>

        <div className="flex gap-sm mt-xl">
          <button type="button" onClick={onCancel} className="btn-secondary flex-1">
            Cancelar
          </button>
          <button type="submit" className="btn-primary flex-1">
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}
