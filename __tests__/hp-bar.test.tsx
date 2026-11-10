import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import HpBar from "@/app/combat-tracker/_components/character-stats/_components/hp-bar/HpBar";

// dictionnary.ts uses top-level await, unsupported by Jest's CJS environment.
jest.mock("../app/_dictionaries/dictionnary", () => ({
  translate: (
    key: string,
    _namespace: string,
    values?: Record<string, string>,
  ) => (values?.count ? `+ ${values.count} ${key}` : key),
}));

const fills = () =>
  Array.from(
    screen.getByTestId("bar").querySelectorAll<HTMLElement>(".hp-bar__fill"),
  );

describe("HpBar", () => {
  it("shows the hit points out of the max, colored by level", () => {
    render(<HpBar label="PV" hp={9} maxHp={40} data-testid="bar" />);

    expect(screen.getByTestId("bar")).toHaveTextContent("9 / 40");
    // Under 25 %
    expect(screen.getByText("9")).toHaveClass("hp-bar__value--low");
    // The temporary fill is kept empty, to animate when some are gained
    const [temp, hp] = fills();
    expect(temp).toHaveStyle({ width: "0%" });
    expect(hp).toHaveStyle({ width: "22.5%" });
    expect(screen.queryByTestId("bar-temp")).not.toBeInTheDocument();
  });

  it("draws the temporary hit points first", () => {
    render(
      <HpBar label="PV" hp={20} maxHp={40} tempHp={10} data-testid="bar" />,
    );

    expect(screen.getByTestId("bar-temp")).toHaveTextContent(
      "+ 10 stats.tempHpBonus",
    );
    const [temp, hp] = fills();
    expect(temp).toHaveClass("hp-bar__fill--temp");
    expect(temp).toHaveStyle({ width: "25%" });
    expect(hp).toHaveStyle({ width: "50%" });
  });

  it("goes over the max with temporary hit points, without overflowing", () => {
    render(
      <HpBar label="PV" hp={40} maxHp={40} tempHp={10} data-testid="bar" />,
    );

    // 50 hit points in all: the bar is scaled on 50, not 40
    const [temp, hp] = fills();
    expect(temp).toHaveStyle({ width: "20%" });
    expect(hp).toHaveStyle({ width: "80%" });
    // The color follows the hit points only
    expect(screen.getByText("40", { selector: "strong" })).toHaveClass(
      "hp-bar__value--high",
    );
  });
});
