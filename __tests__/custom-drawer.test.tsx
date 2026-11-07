import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import CustomDrawer from "@/app/_components/drawer/CustomDrawer";

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
});
