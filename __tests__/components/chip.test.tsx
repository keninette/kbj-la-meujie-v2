import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import Chip from "@/app/_components/_basics/chip/Chip";

describe("Chip", () => {
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
