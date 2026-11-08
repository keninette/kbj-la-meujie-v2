import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import FontAwesomeIcon from "@/app/_components/_basics/font-awesome-icon/FontAwesomeIcon";
import { FaIconSizeEnum } from "@/app/_lib/enums/fa-icon.size.enum";

describe("FontAwesomeIcon", () => {
  it("has the size of the text by default", () => {
    render(
      <FontAwesomeIcon faIcon="play" faIconStyle="solid" data-testid="icon" />,
    );

    expect(screen.getByTestId("icon").className).toBe("fa-solid fa-play");
  });

  it("adds the size class when given", () => {
    render(
      <FontAwesomeIcon
        faIcon="play"
        faIconStyle="solid"
        faSize={FaIconSizeEnum.SM}
        className="my-icon"
        data-testid="icon"
      />,
    );

    expect(screen.getByTestId("icon")).toHaveClass(
      "fa-solid",
      "fa-play",
      "fa-sm",
      "my-icon",
    );
  });
});
