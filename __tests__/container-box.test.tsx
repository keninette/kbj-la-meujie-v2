import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import ContainerBox from "@/app/_components/_basics/container-box/ContainerBox";

describe("ContainerBox", () => {
  it("draws its content in a card, as a div by default", () => {
    render(
      <ContainerBox className="my-layout" data-testid="box">
        <p>Contenu</p>
      </ContainerBox>,
    );

    const box = screen.getByTestId("box");
    expect(box.tagName).toBe("DIV");
    expect(box).toHaveClass("container-box", "my-layout");
    expect(box).not.toHaveClass("container-box--highlighted");
    expect(screen.getByText("Contenu")).toBeInTheDocument();
  });

  it("can be another element, with its attributes, and highlighted", () => {
    render(
      <ContainerBox as="section" aria-label="Tour 2" isHighlighted>
        <p>Contenu</p>
      </ContainerBox>,
    );

    const box = screen.getByRole("region", { name: "Tour 2" });
    expect(box.tagName).toBe("SECTION");
    expect(box).toHaveClass("container-box--highlighted");
  });
});
