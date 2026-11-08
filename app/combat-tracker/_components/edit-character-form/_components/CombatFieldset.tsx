import Fieldset from "@/app/_components/_basics/_form/_fieldset/Fieldset";
import NumberInput from "@/app/_components/_basics/_form/_number-input/NumberInput";
import CheckboxInput from "@/app/_components/_basics/_form/_checkbox-input/CheckboxInput";
import { translate } from "@/app/_dictionaries/dictionnary";
import { CombatCharacter } from "@/app/_lib/types/combat-character.type";
import { WikiImportedField } from "@/app/combat-tracker/_lib/bg3-wiki/merge-wiki-character";
import styles from "./fieldsets.module.scss";

type CombatFieldsetProps = {
  character: CombatCharacter | null;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** Highlight of a field filled by the wiki import, if any */
  importedClassName: (field: WikiImportedField) => string | undefined;
};

const CombatFieldset = ({
  character,
  onInputChange,
  importedClassName,
}: CombatFieldsetProps) => (
  <Fieldset
    title={translate("form.combat", "combatTracker")}
    titleIcon="shield-halved"
  >
    <div className={styles["fieldsets__grid"]}>
      <NumberInput
        id="hp"
        name="hp"
        label={translate("form.hp", "combatTracker")}
        value={character?.hp ?? 0}
        onChange={onInputChange}
        className={importedClassName("hp")}
        data-testid="hp"
      />
      <NumberInput
        id="maxHp"
        name="maxHp"
        label={translate("form.maxHp", "combatTracker")}
        min="1"
        value={character?.maxHp ?? 0}
        onChange={onInputChange}
        className={importedClassName("maxHp")}
        data-testid="maxHp"
      />
      <NumberInput
        id="tempHp"
        name="tempHp"
        label={translate("form.tempHp", "combatTracker")}
        value={character?.tempHp ?? 0}
        onChange={onInputChange}
        data-testid="tempHp"
      />
      <NumberInput
        id="ac"
        name="ac"
        label={translate("form.ac", "combatTracker")}
        value={character?.ac ?? 0}
        onChange={onInputChange}
        className={importedClassName("ac")}
        data-testid="ac"
      />
      <NumberInput
        id="initiativeScore"
        name="initiativeScore"
        label={translate("form.initiative", "combatTracker")}
        value={character?.initiativeScore ?? 0}
        onChange={onInputChange}
        data-testid="initiativeScore"
      />
      <NumberInput
        id="alternativeHp"
        name="alternativeHp"
        label={translate("form.alternativeHp", "combatTracker")}
        value={character?.alternativeHp ?? 0}
        onChange={onInputChange}
        data-testid="alternativeHp"
      />
      <NumberInput
        id="maxAlternativeHp"
        name="maxAlternativeHp"
        label={translate("form.maxAlternativeHp", "combatTracker")}
        value={character?.maxAlternativeHp || ""}
        placeholder={
          character?.alternativeHp ? String(character.alternativeHp) : undefined
        }
        onChange={onInputChange}
        data-testid="maxAlternativeHp"
      />
    </div>
    {character?.isDying && (
      <div className={styles["fieldsets__row"]}>
        <CheckboxInput
          id="isDead"
          name="isDead"
          label={translate("form.isDead", "combatTracker")}
          checked={character?.isDead || false}
          onChange={onInputChange}
          data-testid="isDead"
        />
      </div>
    )}
  </Fieldset>
);

export default CombatFieldset;
