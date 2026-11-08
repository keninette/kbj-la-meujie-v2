import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Fieldset from "@/app/_components/_basics/form/fieldset/Fieldset";
import TextInput from "@/app/_components/_basics/form/text-input/TextInput";
import NumberInput from "@/app/_components/_basics/form/number-input/NumberInput";
import CheckboxInput from "@/app/_components/_basics/form/checkbox-input/CheckboxInput";
import SelectInput from "@/app/_components/_basics/form/select-input/SelectInput";

describe("Fieldset", () => {
  it("is named by its title and holds its content", () => {
    render(
      <Fieldset title="Combat" isHighlighted>
        <p>Contenu</p>
      </Fieldset>,
    );

    const group = screen.getByRole("group", { name: "Combat" });
    expect(group).toHaveTextContent("Contenu");
    expect(group).toHaveClass("container-box--highlighted");
  });

  it("can have no title", () => {
    render(<Fieldset />);

    expect(screen.getByRole("group")).not.toHaveClass(
      "container-box--highlighted",
    );
    expect(screen.getByRole("group")).toBeEmptyDOMElement();
  });
});

describe("form inputs", () => {
  it("label their input", () => {
    render(
      <>
        <TextInput id="name" label="Nom" defaultValue="Kagha" />
        <TextInput id="link" label="Lien" type="url" />
        <NumberInput id="hp" label="PV" defaultValue={12} />
        <CheckboxInput id="npc" label="PNJ" defaultChecked />
        <SelectInput id="attitude" label="Attitude" defaultValue="enemy">
          <option value="friend">Allié</option>
          <option value="enemy">Ennemi</option>
        </SelectInput>
      </>,
    );

    expect(screen.getByLabelText("Nom")).toHaveValue("Kagha");
    expect(screen.getByLabelText("Lien")).toHaveAttribute("type", "url");
    expect(screen.getByLabelText("PV")).toHaveValue(12);
    expect(screen.getByLabelText("PNJ")).toBeChecked();
    expect(screen.getByLabelText("Attitude")).toHaveValue("enemy");
  });

  it("puts the class on the field and shows the adornment", () => {
    render(
      <TextInput
        id="picture"
        label="Image"
        className="highlighted"
        adornment={<span>aperçu</span>}
      />,
    );

    expect(screen.getByLabelText("Image").closest(".highlighted")).not.toBe(
      null,
    );
    expect(screen.getByText("aperçu")).toBeInTheDocument();
  });
});
