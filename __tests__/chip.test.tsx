import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Chip from "@/app/_components/_basics/chip/Chip";

describe("Chip", () => {
  it("shows its label, without icon nor tooltip by default", () => {
    render(<Chip label="Ennemi" data-testid="chip" />);

    const chip = screen.getByTestId("chip");
    expect(chip).toHaveTextContent("Ennemi");
    expect(chip).toHaveClass("chip");
    expect(chip).not.toHaveAttribute("title");
  });

  it("shows the icon before the label, and the tooltip", () => {
    render(
      <Chip
        label="Ennemi"
        icon={<i data-testid="icon" />}
        tooltip="Attitude"
        data-testid="chip"
      />,
    );

    const chip = screen.getByTestId("chip");
    // In its own wrapper, before the label
    expect(chip.firstChild?.firstChild).toBe(screen.getByTestId("icon"));
    expect(chip).toHaveAttribute("title", "Attitude");
  });
});
