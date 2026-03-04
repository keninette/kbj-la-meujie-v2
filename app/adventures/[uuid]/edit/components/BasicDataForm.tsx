"use client";

import { AdventureDto } from "@lib/adventure/dtos/adventure.dto";
import { useServices } from "@hooks/services.hook";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { UniverseDto } from "@lib/universe/dtos/universe.dto";
import SubmitButton from "@components/_basics/submit-button/SubmitButton";
import { translate } from "@/app/_dictionaries/dictionnary";

type AdventureFormProps = {
  adventure: AdventureDto;
  setAdventure: Dispatch<SetStateAction<AdventureDto | undefined>>;
  className?: string;
};

const BasicDataForm = ({
  adventure,
  setAdventure,
  className,
}: AdventureFormProps) => {
  const translationsNamespace = "editAdventure";
  const { adventureService, universeService } = useServices();
  const [isLoading, setIsLoading] = useState(true);
  const [universes, setUniverses] = useState<UniverseDto[]>([]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    console.log("submit");
  };

  useEffect(() => {
    async function load() {
      try {
        const data = await universeService.getAll();
        setUniverses(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [universeService]); // Only loaded once, so we're safe

  return (
    <>
      <h3>title</h3>
      <form className={className ?? ""}>
        <input name="name" id="name" value={adventure.name} required />
        <select name="universe.code" value={adventure.universe?.code} required>
          {universes.map((universe: UniverseDto) => (
            <option value={universe.code} key={universe.code}>
              {universe.name}
            </option>
          ))}
        </select>
        <SubmitButton
          label={translate("basicData.edit", translationsNamespace)}
          onClick={onSubmit}
        />
      </form>
    </>
  );
};

export default BasicDataForm;
