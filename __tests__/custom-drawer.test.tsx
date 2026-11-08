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
      screen.getByRole("heading", { name: "Historique" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("separator")).toBeInTheDocument();
    expect(screen.getByText("Contenu")).toBeInTheDocument();
  });

  it("shows only the content without a title", () => {
    render(
      <CustomDrawer isOpened onClose={jest.fn()}>
        <p>Contenu</p>
      </CustomDrawer>,
    );

    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    expect(screen.queryByRole("separator")).not.toBeInTheDocument();
    expect(screen.getByText("Contenu")).toBeInTheDocument();
  });

  it("closes with its close button, with or without a title", () => {
    const onClose = jest.fn();
    const { rerender } = render(
      <CustomDrawer isOpened onClose={onClose} title="Historique">
        <p>Contenu</p>
      </CustomDrawer>,
    );

    fireEvent.click(screen.getByRole("button", { name: "close" }));
    expect(onClose).toHaveBeenCalledTimes(1);

    rerender(
      <CustomDrawer isOpened onClose={onClose}>
        <p>Contenu</p>
      </CustomDrawer>,
    );
    fireEvent.click(screen.getByTestId("custom-drawer-close"));
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
