import Fieldset from "@/app/_components/_basics/_form/_fieldset/Fieldset";
import TextInput from "@/app/_components/_basics/_form/_text-input/TextInput";
import CheckboxInput from "@/app/_components/_basics/_form/_checkbox-input/CheckboxInput";
import SelectInput from "@/app/_components/_basics/_form/_select-input/SelectInput";
import { translate } from "@/app/_dictionaries/dictionnary";
import {
  isNpcAttitude,
  NpcAttitudeEnum,
} from "@/app/_lib/enums/npc-attitude.enum";
import { CombatCharacter } from "@/app/_lib/types/combat-character.type";
import CharacterPortrait from "@/app/combat-tracker/_components/character-portrait/CharacterPortrait";
import { isDisplayableImageUrl } from "@/app/combat-tracker/_lib/bg3-wiki/bg3-wiki.images";
import { WikiImportedField } from "@/app/combat-tracker/_lib/bg3-wiki/merge-wiki-character";
import styles from "./fieldsets.module.scss";

type IdentityFieldsetProps = {
  character: CombatCharacter | null;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAttitudeChange: (attitude: NpcAttitudeEnum | undefined) => void;
  /** Highlight of a field filled by the wiki import, if any */
  importedClassName: (field: WikiImportedField) => string | undefined;
};

const IdentityFieldset = ({
  character,
  onInputChange,
  onAttitudeChange,
  importedClassName,
}: IdentityFieldsetProps) => {
  const imageUrl = character?.imageUrl?.trim();

  return (
    <Fieldset
      title={translate("form.basicInfo", "combatTracker")}
      titleIcon="id-card"
    >
      <TextInput
        id="name"
        name="name"
        label={translate("form.name", "combatTracker")}
        value={character?.name || ""}
        onChange={onInputChange}
        className={importedClassName("name")}
        data-testid="name"
      />
      <TextInput
        id="shortDescription"
        name="shortDescription"
        label={translate("form.shortDescription", "combatTracker")}
        value={character?.shortDescription || ""}
        onChange={onInputChange}
        className={importedClassName("shortDescription")}
        data-testid="shortDescription"
      />
      <TextInput
        type="url"
        id="wikiLink"
        name="wikiLink"
        label={translate("form.wikiLink", "combatTracker")}
        placeholder="https://bg3.wiki/wiki/Halsin"
        value={character?.wikiLink || ""}
        onChange={onInputChange}
        className={importedClassName("wikiLink")}
        data-testid="wikiLink"
      />
      <TextInput
        type="url"
        id="imageUrl"
        name="imageUrl"
        label={translate("form.imageUrl", "combatTracker")}
        value={character?.imageUrl || ""}
        onChange={onInputChange}
        className={importedClassName("imageUrl")}
        data-testid="imageUrl"
        adornment={
          // Not while the URL is being typed
          isDisplayableImageUrl(imageUrl) && (
            <CharacterPortrait
              src={imageUrl}
              alt={character?.name ?? ""}
              width={40}
              height={40}
              className={styles["fieldsets__picture"]}
              data-testid="imageUrl-preview"
            />
          )
        }
      />
      <div className={styles["fieldsets__row"]}>
        <CheckboxInput
          id="isNpc"
          name="isNpc"
          label={translate("form.npc", "combatTracker")}
          checked={character?.isNpc || false}
          onChange={onInputChange}
        />
        {character?.isNpc && (
          <SelectInput
            id="attitude"
            name="attitude"
            label={translate("form.attitude", "combatTracker")}
            value={character.attitude ?? ""}
            onChange={(event) => {
              const { value } = event.target;
              onAttitudeChange(isNpcAttitude(value) ? value : undefined);
            }}
            data-testid="attitude"
          >
            <option value="">
              {translate("attitude.unknown", "combatTracker")}
            </option>
            {Object.values(NpcAttitudeEnum).map((attitude) => (
              <option key={attitude} value={attitude}>
                {translate(`attitude.${attitude}`, "combatTracker")}
              </option>
            ))}
          </SelectInput>
        )}
      </div>
    </Fieldset>
  );
};

export default IdentityFieldset;
