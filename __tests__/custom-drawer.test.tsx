import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import CustomDrawer from "@/app/_components/_basics/custom-drawer/CustomDrawer";

// dictionnary.ts uses top-level await, unsupported by Jest's CJS environment.
jest.mock("../app/_dictionaries/dictionnary", () => ({
  translate: (key: string) => key,
}));

describe("CustomDrawer", () => {
  it("shows the title followed by a separator, then the content", () => {
    render(
      <CustomDrawer isOpened onClose={jest.fn()} title="Historique">
        <p>Contenu</p>
      </CustomDrawer>,
    );

    expect(
      screen.getByRole("dialog", { name: "Historique" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Historique" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("separator")).toBeInTheDocument();
    expect(screen.getByText("Contenu")).toBeInTheDocument();
    expect(
      screen.queryByTestId("custom-drawer-actions"),
    ).not.toBeInTheDocument();
  });

  it("shows the actions after the content", () => {
    render(
      <CustomDrawer
        isOpened
        onClose={jest.fn()}
        title="Personnage"
        actions={<button type="button">Enregistrer</button>}
      >
        <p>Contenu</p>
      </CustomDrawer>,
    );

    const actions = screen.getByTestId("custom-drawer-actions");
    expect(actions).toContainElement(
      screen.getByRole("button", { name: "Enregistrer" }),
    );
    expect(actions).not.toContainElement(screen.getByText("Contenu"));
    expect(
      screen.getByText("Contenu").compareDocumentPosition(actions) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it("submits a form of the content from an action button", () => {
    const onSubmit = jest.fn((event: React.FormEvent) =>
      event.preventDefault(),
    );
    render(
      <CustomDrawer
        isOpened
        onClose={jest.fn()}
        title="Personnage"
        actions={
          <button type="submit" form="drawer-form">
            Enregistrer
          </button>
        }
      >
        <form id="drawer-form" onSubmit={onSubmit} />
      </CustomDrawer>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("closes with its close button", () => {
    const onClose = jest.fn();
    render(
      <CustomDrawer isOpened onClose={onClose} title="Historique">
        <p>Contenu</p>
      </CustomDrawer>,
    );

    fireEvent.click(screen.getByTestId("custom-drawer-close"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
