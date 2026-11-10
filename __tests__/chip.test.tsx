import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
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

  it("has no delete button by default", () => {
    render(<Chip label="Poisoned" />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("shows a delete button after the label, named by its tooltip, which calls its onClick", () => {
    const onDelete = jest.fn();
    render(
      <Chip
        label="Poisoned"
        deleteAction={{ onClick: onDelete, tooltip: "Retirer" }}
        data-testid="chip"
      />,
    );

    const button = screen.getByRole("button", { name: "Retirer" });
    expect(button).toHaveAttribute("title", "Retirer");
    expect(screen.getByTestId("chip").lastChild).toBe(button);
    fireEvent.click(button);
    expect(onDelete).toHaveBeenCalledTimes(1);
  });
});
