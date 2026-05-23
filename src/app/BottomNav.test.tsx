import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import BottomNav from "@/app/BottomNav";

const mockUsePathname = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}));

describe("BottomNav", () => {
  it("renders all three links", () => {
    mockUsePathname.mockReturnValue("/");
    render(<BottomNav />);

    expect(screen.getByText("Diario")).toBeDefined();
    expect(screen.getByText("Calendario")).toBeDefined();
    expect(screen.getByText("Métricas")).toBeDefined();
  });

  it("highlights Diario when pathname is /", () => {
    mockUsePathname.mockReturnValue("/");
    render(<BottomNav />);

    const diario = screen.getByText("Diario");
    expect(diario.className).toContain("text-primary");

    const calendario = screen.getByText("Calendario");
    expect(calendario.className).toContain("text-text-secondary");

    const metricas = screen.getByText("Métricas");
    expect(metricas.className).toContain("text-text-secondary");
  });

  it("highlights Calendario when pathname is /calendario", () => {
    mockUsePathname.mockReturnValue("/calendario");
    render(<BottomNav />);

    const diario = screen.getByText("Diario");
    expect(diario.className).toContain("text-text-secondary");

    const calendario = screen.getByText("Calendario");
    expect(calendario.className).toContain("text-primary");

    const metricas = screen.getByText("Métricas");
    expect(metricas.className).toContain("text-text-secondary");
  });

  it("highlights Métricas when pathname is /metricas", () => {
    mockUsePathname.mockReturnValue("/metricas");
    render(<BottomNav />);

    const diario = screen.getByText("Diario");
    expect(diario.className).toContain("text-text-secondary");

    const calendario = screen.getByText("Calendario");
    expect(calendario.className).toContain("text-text-secondary");

    const metricas = screen.getByText("Métricas");
    expect(metricas.className).toContain("text-primary");
  });

  it("links point to the correct routes", () => {
    mockUsePathname.mockReturnValue("/");
    render(<BottomNav />);

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(3);
    expect(links[0].getAttribute("href")).toBe("/");
    expect(links[1].getAttribute("href")).toBe("/calendario");
    expect(links[2].getAttribute("href")).toBe("/metricas");
  });
});
