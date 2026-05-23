import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import MetricasPage from "@/app/metricas/page";

vi.mock("next/navigation", () => ({
  usePathname: () => "/metricas",
}));

describe("MetricasPage", () => {
  beforeEach(async () => {
    const { clearDB } = await import("@/lib/db");
    await clearDB();
  });

  it("renders the header", () => {
    render(<MetricasPage />);
    const headers = screen.getAllByText("Métricas");
    expect(headers.length).toBeGreaterThanOrEqual(1);
    const h1 = headers.find((h) => h.tagName === "H1");
    expect(h1).toBeDefined();
  });

  it("shows section titles when no records exist", () => {
    render(<MetricasPage />);
    expect(screen.getByText("Promedios")).toBeDefined();
    expect(screen.getByText("Indicadores de salud")).toBeDefined();
    expect(screen.getByText("Rangos")).toBeDefined();
    expect(screen.getByText("Todos los registros")).toBeDefined();
  });

  it("shows empty state message in records table", () => {
    render(<MetricasPage />);
    expect(screen.getByText("No hay registros")).toBeDefined();
  });

  it("displays metrics after adding records", async () => {
    const { addRecord } = await import("@/lib/db");

    await addRecord({
      date: "2026-05-20",
      time: "10:00",
      systolic: 120,
      diastolic: 80,
      pulse: 72,
      pillTaken: true,
      notes: undefined,
    });

    await addRecord({
      date: "2026-05-21",
      time: "11:00",
      systolic: 130,
      diastolic: 85,
      pulse: 76,
      pillTaken: false,
      notes: undefined,
    });

    render(<MetricasPage />);

    await waitFor(() => {
      expect(screen.getByText("125")).toBeDefined();
    });

    expect(screen.getByText("83")).toBeDefined();
    expect(screen.getByText("74")).toBeDefined();
    expect(screen.getByText("50% (1/2)")).toBeDefined();

    const maxDiaEls = screen.getAllByText("85");
    expect(maxDiaEls.length).toBeGreaterThanOrEqual(1);

    const maxSisEls = screen.getAllByText("130");
    expect(maxSisEls.length).toBeGreaterThanOrEqual(1);

    expect(screen.getByText("2026-05-21")).toBeDefined();
    expect(screen.getByText("2026-05-20")).toBeDefined();
  });

  it("renders the chart when 2+ records exist", async () => {
    const { addRecord } = await import("@/lib/db");

    await addRecord({
      date: "2026-05-20",
      time: "10:00",
      systolic: 120,
      diastolic: 80,
      pulse: 72,
      pillTaken: true,
      notes: undefined,
    });

    await addRecord({
      date: "2026-05-21",
      time: "11:00",
      systolic: 130,
      diastolic: 85,
      pulse: 76,
      pillTaken: false,
      notes: undefined,
    });

    render(<MetricasPage />);

    await waitFor(() => {
      expect(screen.getByText("Evolución")).toBeDefined();
    });

    const sisEls = screen.getAllByText("Sistólica");
    expect(sisEls.length).toBeGreaterThanOrEqual(2);

    const diaEls = screen.getAllByText("Diastólica");
    expect(diaEls.length).toBeGreaterThanOrEqual(2);
  });

  it("renders the bottom nav", () => {
    render(<MetricasPage />);
    expect(screen.getByText("Diario")).toBeDefined();
    expect(screen.getByText("Calendario")).toBeDefined();
    const metricasEls = screen.getAllByText("Métricas");
    expect(metricasEls.length).toBeGreaterThanOrEqual(2);
  });

  it("renders header action buttons", () => {
    render(<MetricasPage />);
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });
});
