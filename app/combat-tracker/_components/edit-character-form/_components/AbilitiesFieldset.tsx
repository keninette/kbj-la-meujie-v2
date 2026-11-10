import Fieldset, {
  FieldsetGrid,
} from "@/app/_components/_basics/form/fieldset/Fieldset";
import NumberInput from "@/app/_components/_basics/form/number-input/NumberInput";
import { translate } from "@/app/_dictionaries/dictionnary";
import { ABILITIES, AbilityEnum } from "@/app/_lib/enums/ability.enum";
import { CombatCharacter } from "@/app/_lib/types/combat-character.type";

type AbilityValues = Partial<Record<AbilityEnum, number>>;

type AbilitiesFieldsetProps = {
  abilities?: AbilityValues;
  savingThrows?: AbilityValues;
  onChange: (
    changes: Pick<CombatCharacter, "abilities" | "savingThrows">,
  ) => void;
  isHighlighted?: boolean;
};

const withValue = (
  values: AbilityValues | undefined,
  ability: AbilityEnum,
  value: string,
): AbilityValues | undefined => {
  const updated = { ...values };
  if (value === "") {
    delete updated[ability];
  } else {
    updated[ability] = +value;
  }
  return Object.keys(updated).length ? updated : undefined;
};

const AbilitiesFieldset = ({
  abilities,
  savingThrows,
  onChange,
  isHighlighted,
}: AbilitiesFieldsetProps) => (
  <Fieldset
    title={translate("form.abilities", "combatTracker")}
    titleIcon="dumbbell"
    isHighlighted={isHighlighted}
    data-testid="abilities-fieldset"
  >
    <FieldsetGrid>
      {ABILITIES.map((ability) => (
        <NumberInput
          key={ability}
          id={`abilityScore-${ability}`}
          label={translate(`ability.${ability}`, "combatTracker")}
          value={abilities?.[ability] ?? ""}
          onChange={(event) =>
            onChange({
              abilities: withValue(abilities, ability, event.target.value),
            })
          }
          data-testid={`abilityScore-${ability}`}
        />
      ))}
    </FieldsetGrid>
    <FieldsetGrid>
      {ABILITIES.map((ability) => (
        <NumberInput
          key={ability}
          id={`savingThrow-${ability}`}
          label={`${translate("stats.savingThrows", "combatTracker")} ${translate(`ability.${ability}`, "combatTracker")}`}
          value={savingThrows?.[ability] ?? ""}
          onChange={(event) =>
            onChange({
              savingThrows: withValue(
                savingThrows,
                ability,
                event.target.value,
              ),
            })
          }
          data-testid={`savingThrow-${ability}`}
        />
      ))}
    </FieldsetGrid>
  </Fieldset>
);

export default AbilitiesFieldset;
