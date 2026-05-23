import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import CalendarioPage from "@/app/calendario/page";

vi.mock("next/navigation", () => ({
  usePathname: () => "/calendario",
}));

describe("CalendarioPage", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-22T10:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the header", () => {
    render(<CalendarioPage />);
    const headers = screen.getAllByText("Calendario");
    expect(headers.length).toBeGreaterThanOrEqual(1);
    expect(headers[0].tagName).toBe("H1");
  });

  it("renders the current month and year", () => {
    render(<CalendarioPage />);
    expect(screen.getByText(/mayo 2026/i)).toBeDefined();
  });

  it("renders all weekday initials", () => {
    render(<CalendarioPage />);
    for (const d of ["L", "M", "X", "J", "V", "S", "D"]) {
      expect(screen.getByText(d)).toBeDefined();
    }
  });

  it("renders the bottom nav", () => {
    render(<CalendarioPage />);
    expect(screen.getByText("Diario")).toBeDefined();
    const calendarLinks = screen.getAllByText("Calendario");
    expect(calendarLinks.length).toBe(2);
  });

  it("renders the legend with all places", () => {
    render(<CalendarioPage />);
    expect(screen.getByText("Lugares")).toBeDefined();
    expect(screen.getByText("Matrona")).toBeDefined();
    expect(screen.getByText("Centro de Salud")).toBeDefined();
    expect(screen.getByText("Hospital General")).toBeDefined();
    expect(screen.getByText("Hospital 9 de Octubre")).toBeDefined();
    expect(screen.getByText("Hospital La Fe")).toBeDefined();
  });

  it("renders month navigation buttons", () => {
    render(<CalendarioPage />);
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });
});
