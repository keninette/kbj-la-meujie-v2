"use client";

import { AdventureDto } from "@lib/adventure/dtos/adventure.dto";
import { useState } from "react";
import { UniverseDto } from "@lib/universe/dtos/universe.dto";
import SubmitButton from "@components/_basics/submit-button/SubmitButton";
import { translate } from "@/app/_dictionaries/dictionnary";

type AdventureFormProps = {
  adventure: AdventureDto;
  universes: UniverseDto[];
  className?: string;
};

const BasicDataForm = ({ adventure, universes, className }: AdventureFormProps) => {
  const translationsNamespace = "editAdventure";
  const [name, setName] = useState(adventure.name);
  const [universeCode, setUniverseCode] = useState(adventure.universe?.code ?? "");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submit");
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
        <SubmitButton label={translate("basicData.edit", translationsNamespace)} />
      </form>
    </>
  );
};

export default BasicDataForm;
