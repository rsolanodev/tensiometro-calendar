import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WheelPicker from "@/app/WheelPicker";

describe("WheelPicker", () => {
  it("renders label", () => {
    render(<WheelPicker value={120} min={60} max={250} label="Sistólica" onChange={vi.fn()} />);
    expect(screen.getByText("Sistólica")).toBeDefined();
  });

  it("renders min and max values", () => {
    render(<WheelPicker value={120} min={60} max={62} label="Test" onChange={vi.fn()} />);
    expect(screen.getByText("60")).toBeDefined();
    expect(screen.getByText("62")).toBeDefined();
  });

  it("highlights current value with primary styling", () => {
    render(<WheelPicker value={120} min={60} max={250} label="Test" onChange={vi.fn()} />);

    const span = screen.getByText("120");
    expect(span.className).toContain("text-primary");
    expect(span.className).toContain("font-semibold");
  });

  it("renders unit when provided", () => {
    render(<WheelPicker value={72} min={30} max={220} label="Pulso" unit="bpm" onChange={vi.fn()} />);
    expect(screen.getByText("bpm")).toBeDefined();
  });

  it("calls onChange when scrolling to a new value", async () => {
    const onChange = vi.fn();
    render(<WheelPicker value={120} min={118} max={122} step={1} label="Test" onChange={onChange} />);

    const container = screen.getByText("118").closest("[style*='scroll-snap-type']")!;
    expect(container).toBeDefined();

    container.dispatchEvent(new Event("scroll", { bubbles: true }));

    await vi.waitFor(() => {
      expect(onChange).toHaveBeenCalled();
    });
  });
});
