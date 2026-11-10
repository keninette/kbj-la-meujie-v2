import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Tile from "@/app/_components/_basics/tile/Tile";

describe("Tile", () => {
  it("shows its title, then its content", () => {
    render(
      <Tile title="Initiative" data-testid="tile">
        <span>19</span>
      </Tile>,
    );

    const tile = screen.getByTestId("tile");
    expect(tile.firstChild).toHaveTextContent("Initiative");
    expect(tile.lastChild).toHaveTextContent("19");
  });
});
