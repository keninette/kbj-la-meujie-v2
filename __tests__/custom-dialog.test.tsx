import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import CustomDialog from "@/app/_components/_basics/custom-dialog/CustomDialog";

describe("CustomDialog", () => {
  it("shows the title, which names the dialog, and the content", () => {
    render(
      <CustomDialog isOpened onClose={jest.fn()} title="Importer">
        <p>Contenu</p>
      </CustomDialog>,
    );

    expect(screen.getByRole("dialog", { name: "Importer" })).toHaveTextContent(
      "Contenu",
    );
  });

  it("renders nothing when closed", () => {
    render(
      <CustomDialog isOpened={false} onClose={jest.fn()} title="Importer">
        <p>Contenu</p>
      </CustomDialog>,
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes with the Escape key", () => {
    const onClose = jest.fn();
    render(
      <CustomDialog isOpened onClose={onClose} title="Importer">
        <p>Contenu</p>
      </CustomDialog>,
    );

    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });

    expect(onClose).toHaveBeenCalled();
  });
});
