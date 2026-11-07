"use client";

import { useState, useTransition } from "react";
import { CircularProgress, Dialog } from "@mui/material";
import ButtonWithIcon from "@/app/_components/_basics/button-with-icon/ButtonWithIcon";
import { ButtonVariant } from "@/app/_lib/enums/button-variant.enum";
import { FaIconStyleEnum } from "@/app/_lib/enums/fa-icon.style.enum";
import { CombatCharacter } from "@/app/_lib/types/combat-character.type";
import { translate } from "@/app/_dictionaries/dictionnary";
import { createCharacterFromWiki } from "@/app/combat-tracker/_lib/bg3-wiki/bg3-wiki.actions";
import { Bg3WikiErrorEnum } from "@/app/combat-tracker/_lib/bg3-wiki/bg3-wiki.parser";
import styles from "./wiki-character-dialog.module.scss";

type WikiCharacterDialogProps = {
  isOpened: boolean;
  onClose: () => void;
  onCharacterCreated: (character: CombatCharacter) => void;
};

const WikiCharacterDialog = ({
  isOpened,
  onClose,
  onCharacterCreated,
}: WikiCharacterDialogProps) => {
  const [url, setUrl] = useState<string>("");
  // Kept as a string so the field can be empty until the roll is typed in
  const [initiativeScore, setInitiativeScore] = useState<string>("");
  const [error, setError] = useState<Bg3WikiErrorEnum | null>(null);
  const [isLoading, startTransition] = useTransition();

  const resetFields = () => {
    setUrl("");
    setInitiativeScore("");
    setError(null);
  };

  const close = () => {
    if (isLoading) {
      return;
    }
    resetFields();
    onClose();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await createCharacterFromWiki(url);
      if (result.error) {
        setError(result.error);
        return;
      }
      onCharacterCreated({
        ...result.character,
        initiativeScore: Number(initiativeScore),
      });
      resetFields();
      onClose();
    });
  };

  return (
    <Dialog
      open={isOpened}
      onClose={close}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: { className: styles["wiki-character-dialog__paper"] },
        backdrop: { className: styles["wiki-character-dialog__backdrop"] },
      }}
    >
      <form className={styles["wiki-character-dialog"]} onSubmit={handleSubmit}>
        <h2 className={styles["wiki-character-dialog__title"]}>
          {translate("wiki.title", "combatTracker")}
        </h2>
        <div className={styles["wiki-character-dialog__field"]}>
          <label
            htmlFor="wiki-url"
            className={styles["wiki-character-dialog__label"]}
          >
            {translate("wiki.url", "combatTracker")}
          </label>
          <input
            type="url"
            className={styles["wiki-character-dialog__input"]}
            id="wiki-url"
            name="wiki-url"
            placeholder="https://bg3.wiki/wiki/Halsin"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            disabled={isLoading}
            required
            autoFocus
            data-testid="wiki-url"
          />
        </div>
        <div className={styles["wiki-character-dialog__field"]}>
          <label
            htmlFor="wiki-initiative"
            className={styles["wiki-character-dialog__label"]}
          >
            {translate("form.initiative", "combatTracker")}
          </label>
          <input
            type="number"
            className={[
              styles["wiki-character-dialog__input"],
              styles["wiki-character-dialog__input--short"],
            ].join(" ")}
            id="wiki-initiative"
            name="wiki-initiative"
            step={1}
            value={initiativeScore}
            onChange={(event) => setInitiativeScore(event.target.value)}
            disabled={isLoading}
            required
            data-testid="wiki-initiative"
          />
        </div>
        {error && (
          <p className={styles["wiki-character-dialog__error"]} role="alert">
            {translate(`wiki.error.${error}`, "combatTracker")}
          </p>
        )}
        {isLoading && (
          <div className={styles["wiki-character-dialog__loader"]}>
            <CircularProgress size="1.5rem" color="inherit" />
            <span>{translate("wiki.loading", "combatTracker")}</span>
          </div>
        )}
        <div className={styles["wiki-character-dialog__actions"]}>
          <ButtonWithIcon
            label={translate("wiki.cancel", "combatTracker")}
            onClick={close}
            disabled={isLoading}
            faIcon="xmark"
            faIconStyle={FaIconStyleEnum.SOLID}
            iconPosition="left"
            variant={ButtonVariant.SECONDARY}
          />
          <ButtonWithIcon
            label={translate("wiki.create", "combatTracker")}
            type="submit"
            disabled={isLoading || !url.trim() || initiativeScore === ""}
            faIcon="wand-magic-sparkles"
            faIconStyle={FaIconStyleEnum.SOLID}
            iconPosition="left"
            data-testid="wiki-create"
          />
        </div>
      </form>
    </Dialog>
  );
};

export default WikiCharacterDialog;
