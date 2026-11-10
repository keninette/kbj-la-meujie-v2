import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import CustomDialog from "@/app/_components/_basics/custom-dialog/CustomDialog";

// dictionnary.ts uses top-level await, unsupported by Jest's CJS environment.
jest.mock("../app/_dictionaries/dictionnary", () => ({
  translate: (key: string) => key,
}));

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

  it("shows the actions after the content", () => {
    render(
      <CustomDialog
        isOpened
        onClose={jest.fn()}
        title="Importer"
        actions={<button type="button">Valider</button>}
      >
        <p>Contenu</p>
      </CustomDialog>,
    );

    const content = screen.getByText("Contenu");
    const action = screen.getByRole("button", { name: "Valider" });
    expect(
      content.compareDocumentPosition(action) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it("renders nothing when closed", () => {
    render(
      <CustomDialog isOpened={false} onClose={jest.fn()} title="Importer">
        <p>Contenu</p>
      </CustomDialog>,
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes with its close button", () => {
    const onClose = jest.fn();
    render(
      <CustomDialog isOpened onClose={onClose} title="Importer">
        <p>Contenu</p>
      </CustomDialog>,
    );

    fireEvent.click(screen.getByTestId("custom-dialog-close"));

    expect(onClose).toHaveBeenCalledTimes(1);
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
