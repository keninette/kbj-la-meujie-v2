import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import ButtonWithIcon from "@/app/_components/_basics/button-with-icon/ButtonWithIcon";
import IconButton from "@/app/_components/_basics/icon-button/IconButton";
import { ButtonSize } from "@/app/_lib/enums/button-size.enum";

describe("Button sizes", () => {
  it("keeps the regular size by default", () => {
    render(
      <>
        <ButtonWithIcon label="Jouer" faIcon="dice-d20" data-testid="button" />
        <IconButton faIcon="pen" tooltip="Modifier" data-testid="icon" />
      </>,
    );

    // The size class is on the wrapper, which also holds the icon
    expect(screen.getByTestId("button").parentElement).not.toHaveClass(
      "button-with-icon--xs",
    );
    expect(screen.getByTestId("icon")).not.toHaveClass("icon-button--xs");
  });

  it("makes the buttons extra small", () => {
    render(
      <>
        <ButtonWithIcon
          label="Jouer"
          faIcon="dice-d20"
          size={ButtonSize.XS}
          data-testid="button"
        />
        <IconButton
          faIcon="pen"
          tooltip="Modifier"
          size={ButtonSize.XS}
          className="custom"
          data-testid="icon"
        />
      </>,
    );

    expect(screen.getByTestId("button").parentElement).toHaveClass(
      "button-with-icon--xs",
    );
    // The given class is kept
    expect(screen.getByTestId("icon")).toHaveClass("icon-button--xs", "custom");
  });
});
