import { useState } from "react";
import Fieldset, {
  FieldsetChips,
  FieldsetRow,
} from "@/app/_components/_basics/form/fieldset/Fieldset";
import AutocompleteInput from "@/app/_components/_basics/form/autocomplete-input/AutocompleteInput";
import TextInput from "@/app/_components/_basics/form/text-input/TextInput";
import ButtonWithIcon from "@/app/_components/_basics/button-with-icon/ButtonWithIcon";
import { ButtonVariant } from "@/app/_lib/enums/button-variant.enum";
import { FaIconStyleEnum } from "@/app/_lib/enums/fa-icon.style.enum";
import { translate } from "@/app/_dictionaries/dictionnary";
import { CombatPassive } from "@/app/_lib/types/combat-passive.type";
import { BG3_PASSIVES } from "@/app/combat-tracker/_lib/bg3-passives";
import { getPassiveText } from "@/app/combat-tracker/_lib/passive-text.helper";
import {
  addCustomPassive,
  draftFromPassive,
  EMPTY_PASSIVE_DRAFT,
  getPassiveKey,
  isSamePassive,
  passiveFromDraft,
} from "@/app/combat-tracker/_lib/combat-passive.helper";
import {
  loadCustomPassives,
  saveCustomPassives,
} from "@/app/combat-tracker/_lib/local-storage";
import { createPassiveFromWiki } from "@/app/combat-tracker/_lib/bg3-wiki/bg3-wiki.actions";
import PassiveChip from "@/app/combat-tracker/_components/passive-chip/PassiveChip";
import WikiImportDialog from "@/app/combat-tracker/_components/wiki-import-dialog/WikiImportDialog";
import AddItemButton from "../AddItemButton";
import ExistingPassiveDialog from "../existing-passive-dialog/ExistingPassiveDialog";
import { useNewItem } from "../../_hooks/use-new-item.hook";
import styles from "./passives-fieldset.module.scss";

type PassivesFieldsetProps = {
  passives: CombatPassive[];
  onChange: (passives: CombatPassive[]) => void;
  isHighlighted?: boolean;
};

/** Our Baldur's Gate 3 passives, then the ones added by hand or from the wiki */
const getListedPassives = (
  customPassives: CombatPassive[],
): CombatPassive[] => [
  ...BG3_PASSIVES.map((bg3Passive) => ({
    name: bg3Passive.name,
    bg3PassiveId: bg3Passive.id,
  })),
  ...customPassives,
];

/**
 * The listed passives, in french and searched in english too, shown like the
 * character's own: a chip with its tooltip
 */
const getPassiveOptions = (listedPassives: CombatPassive[]) =>
  listedPassives
    .map((passive) => ({
      value: getPassiveKey(passive),
      label: getPassiveText(passive).name,
      keywords: passive.name,
      display: <PassiveChip passive={passive} />,
    }))
    .sort((a, b) => a.label.localeCompare(b.label, "fr"));

/**
 * A passive of the list is added as soon as it's picked. Another one is typed
 * (name and description), or filled by an import from the wiki, then added
 * with the button: it then joins the list.
 */
const PassivesFieldset = ({
  passives,
  onChange,
  isHighlighted,
}: PassivesFieldsetProps) => {
  const [isWikiDialogOpened, setIsWikiDialogOpened] = useState(false);
  // A passive already in the list (imported again) or on the character
  const [existingPassive, setExistingPassive] = useState<CombatPassive | null>(
    null,
  );
  const [customPassives, setCustomPassives] = useState(loadCustomPassives);
  const listedPassives = getListedPassives(customPassives);

  // Added to the character, and to the list to be picked next time. One the
  // character already has isn't: the dialog says so. False when not added.
  const addPassive = (passive: CombatPassive): boolean => {
    const ownPassive = passives.find((own) => isSamePassive(own, passive));
    if (ownPassive) {
      setExistingPassive(ownPassive);
      return false;
    }
    onChange([...passives, passive]);
    const updatedCustomPassives = addCustomPassive(customPassives, passive);
    setCustomPassives(updatedCustomPassives);
    saveCustomPassives(updatedCustomPassives);
    return true;
  };

  const { draft, setDraft, submit, submitOnEnter } = useNewItem(
    EMPTY_PASSIVE_DRAFT,
    (newDraft) => {
      const passive = passiveFromDraft(newDraft);
      return !!passive && addPassive(passive);
    },
  );

  // A passive of the list has nothing to check: it's added right away
  const selectListedPassive = (value: string | null) => {
    const passive = listedPassives.find(
      (listed) => getPassiveKey(listed) === value,
    );
    if (passive) {
      addPassive(passive);
    }
  };

  const setField =
    (field: "name" | "description") =>
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setDraft({ ...draft, [field]: event.target.value });

  // A new passive fills the fields, to be checked before adding it
  const importFromUrl = async (url: string) => {
    const result = await createPassiveFromWiki(url);
    if (result.error) {
      return result.error;
    }
    const listed = listedPassives.find((passive) =>
      isSamePassive(passive, result.passive),
    );
    if (listed) {
      setExistingPassive(listed);
    } else {
      setDraft(draftFromPassive(result.passive));
    }
  };

  return (
    <Fieldset
      title={translate("form.passives", "combatTracker")}
      titleIcon="book-open"
      isHighlighted={isHighlighted}
      data-testid="passives-fieldset"
    >
      <FieldsetChips>
        {passives.map((passive, index) => (
          <li key={`${passive.name}-${index}`}>
            <PassiveChip
              passive={passive}
              onRemove={() => onChange(passives.filter((_, i) => i !== index))}
            />
          </li>
        ))}
      </FieldsetChips>
      <FieldsetRow>
        <AutocompleteInput
          id="bg3Passive"
          label={translate("form.passive", "combatTracker")}
          options={getPassiveOptions(listedPassives)}
          value={null}
          onChange={selectListedPassive}
          isClearedOnSelect
          data-testid="bg3Passive"
        />
        <span className={styles["passives-fieldset__or"]}>
          {translate("form.or", "combatTracker")}
        </span>
        <TextInput
          id="passiveName"
          name="passiveName"
          label={translate("form.passiveName", "combatTracker")}
          value={draft.name}
          onChange={setField("name")}
          onKeyDown={submitOnEnter}
          data-testid="passiveName"
        />
      </FieldsetRow>
      <FieldsetRow>
        <TextInput
          id="passiveDescription"
          name="passiveDescription"
          label={translate("form.passiveDescription", "combatTracker")}
          value={draft.description}
          onChange={setField("description")}
          onKeyDown={submitOnEnter}
          data-testid="passiveDescription"
        />
        <AddItemButton onClick={submit} data-testid="passiveName-add-button" />
      </FieldsetRow>
      <FieldsetRow>
        <ButtonWithIcon
          label={translate("form.importPassiveFromWiki", "combatTracker")}
          onClick={() => setIsWikiDialogOpened(true)}
          faIcon="book-open"
          faIconStyle={FaIconStyleEnum.SOLID}
          iconPosition="left"
          variant={ButtonVariant.SECONDARY}
          data-testid="import-passive-from-wiki"
        />
      </FieldsetRow>
      {existingPassive && (
        <ExistingPassiveDialog
          passive={existingPassive}
          isOnCharacter={passives.some((passive) =>
            isSamePassive(passive, existingPassive),
          )}
          onAdd={() => {
            addPassive(existingPassive);
            setExistingPassive(null);
          }}
          onClose={() => setExistingPassive(null)}
        />
      )}
      {isWikiDialogOpened && (
        <WikiImportDialog
          onClose={() => setIsWikiDialogOpened(false)}
          placeholder="https://bg3.wiki/wiki/Relentless_Endurance"
          importFromUrl={importFromUrl}
        />
      )}
    </Fieldset>
  );
};

export default PassivesFieldset;
