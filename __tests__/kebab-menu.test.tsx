import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import KebabMenu from "@/app/_components/_basics/kebab-menu/KebabMenu";

describe("KebabMenu", () => {
  const renderMenu = (onEdit = jest.fn()) =>
    render(
      <KebabMenu
        label="Actions de Kagha"
        data-testid="menu"
        items={[
          {
            label: "Voir la page du wiki",
            faIcon: "arrow-up-right-from-square",
            href: "https://bg3.wiki/wiki/Kagha",
            openInNewTab: true,
          },
          { label: "Éditer", faIcon: "pen", onClick: onEdit },
        ]}
      />,
    );

  it("is a closed ⋮ button with an accessible name", () => {
    renderMenu();

    const button = screen.getByRole("button", { name: "Actions de Kagha" });
    expect(button).toHaveAttribute("aria-haspopup", "menu");
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("lists the actions and links when opened", () => {
    renderMenu();

    fireEvent.click(screen.getByTestId("menu"));

    expect(screen.getByTestId("menu")).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByRole("menuitem", { name: "Éditer" }),
    ).toBeInTheDocument();
    const link = screen.getByRole("menuitem", { name: "Voir la page du wiki" });
    expect(link).toHaveAttribute("href", "https://bg3.wiki/wiki/Kagha");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("runs the action and closes", () => {
    const onEdit = jest.fn();
    renderMenu(onEdit);

    fireEvent.click(screen.getByTestId("menu"));
    fireEvent.click(screen.getByRole("menuitem", { name: "Éditer" }));

    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("menu")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });
});
