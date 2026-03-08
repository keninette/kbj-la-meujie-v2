"use client";

import { useState } from "react";
import { StoryArcDto } from "@/app/_lib/model/storyArc/dtos/story-arc.dto";
import type { StoryArcCreateDto } from "@/app/_lib/model/storyArc/dtos/story-arc.create.dto";
import SubmitButton from "@components/_basics/submit-button/SubmitButton";
import { translate } from "@/app/_dictionaries/dictionnary";

type CreateStoryArcFormProps = {
  adventureUuid: string;
  className?: string;
  onStoryArcCreated: (createdStoryArc: StoryArcDto) => void;
};

const CreateStoryArcForm = ({
  adventureUuid,
  className,
  onStoryArcCreated,
}: CreateStoryArcFormProps) => {
  const translationsNamespace = "editAdventure";
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const storyArcCreateDto: Pick<StoryArcCreateDto, "name"> = {
      name: name.trim(),
    };

    try {
      const response = await fetch(
        `/api/adventures/${adventureUuid}/story-arcs`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(storyArcCreateDto),
        },
      );

      if (!response.ok) {
        const errorResponse = (await response.json()) as { errors?: string[] };
        setErrorMessage(
          errorResponse.errors?.join(", ") ?? "Unable to create story arc",
        );
        return;
      }

      const createdStoryArc = (await response.json()) as StoryArcDto;
      setName("");
      onStoryArcCreated(createdStoryArc);
    } catch {
      setErrorMessage("Unable to create story arc");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <h3>{translate("storyArc.form.createTitle", translationsNamespace)}</h3>
      <form className={className ?? ""} onSubmit={onSubmit}>
        <input
          name="name"
          id="create-story-arc-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        {errorMessage && <p>{errorMessage}</p>}
        <SubmitButton
          label={translate("storyArc.add", translationsNamespace)}
        />
      </form>
    </>
  );
};

export default CreateStoryArcForm;
