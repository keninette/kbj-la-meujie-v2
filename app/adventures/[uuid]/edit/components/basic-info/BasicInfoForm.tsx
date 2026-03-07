"use client";

import { AdventureDto } from "@/app/_lib/model/adventure/dtos/adventure.dto";
import { useEffect, useState } from "react";
import { UniverseDto } from "@/app/_lib/model/universe/dtos/universe.dto";
import SubmitButton from "@components/_basics/submit-button/SubmitButton";
import { translate } from "@/app/_dictionaries/dictionnary";
import type { AdventurePatchDto } from "@/app/_lib/model/adventure/dtos/adventure.patch.dto";

type AdventureFormProps = {
  adventure: AdventureDto;
  universes: UniverseDto[];
  className?: string;
  onAdventureUpdated: (updatedAdventure: AdventureDto) => void;
};

const BasicInfoForm = ({
  adventure,
  universes,
  className,
  onAdventureUpdated,
}: AdventureFormProps) => {
  const translationsNamespace = "editAdventure";
  const [name, setName] = useState(adventure.name);
  const [universeCode, setUniverseCode] = useState(
    adventure.universe?.code ?? "",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setName(adventure.name);
    setUniverseCode(adventure.universe?.code ?? "");
  }, [adventure.name, adventure.universe?.code]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const adventurePatchDto: Pick<AdventurePatchDto, "name" | "universeCode"> =
      {
        name: name.trim(),
        universeCode,
      };

    try {
      const response = await fetch(`/api/adventures/${adventure.uuid}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adventurePatchDto),
      });

      if (!response.ok) {
        const errorResponse = (await response.json()) as { errors?: string[] };
        setErrorMessage(
          errorResponse.errors?.join(", ") ?? "Unable to update adventure",
        );
        return;
      }

      const updatedAdventure = (await response.json()) as AdventureDto;
      setName(updatedAdventure.name);
      setUniverseCode(updatedAdventure.universe?.code ?? "");
      onAdventureUpdated(updatedAdventure);
    } catch {
      setErrorMessage("Unable to update adventure");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <h3>title</h3>
      <form className={className ?? ""} onSubmit={onSubmit}>
        <input
          name="name"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <select
          name="universe.code"
          value={universeCode}
          onChange={(e) => setUniverseCode(e.target.value)}
          required
        >
          {universes.map((universe: UniverseDto) => (
            <option value={universe.code} key={universe.code}>
              {universe.name}
            </option>
          ))}
        </select>
        {errorMessage && <p>{errorMessage}</p>}
        <SubmitButton
          label={translate("basicInfo.edit", translationsNamespace)}
        />
      </form>
    </>
  );
};

export default BasicInfoForm;
