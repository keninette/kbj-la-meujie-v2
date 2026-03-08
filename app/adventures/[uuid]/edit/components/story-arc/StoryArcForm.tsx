"use client";

import { StoryArcDto } from "@/app/_lib/model/storyArc/dtos/story-arc.dto";
import { useEffect, useState } from "react";
import type { StoryArcPatchDto } from "@/app/_lib/model/storyArc/dtos/story-arc.patch.dto";
import SubmitButton from "@components/_basics/submit-button/SubmitButton";
import { translate } from "@/app/_dictionaries/dictionnary";

type StoryArcFormProps = {
  adventureUuid: string;
  storyArc: StoryArcDto;
  className?: string;
  onStoryArcUpdated: (updatedStoryArc: StoryArcDto) => void;
};

const StoryArcForm = ({
  adventureUuid,
  storyArc,
  className,
  onStoryArcUpdated,
}: StoryArcFormProps) => {
  const translationsNamespace = "editAdventure";
  const [name, setName] = useState(storyArc.name);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setName(storyArc.name);
  }, [storyArc.name]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const storyArcPatchDto: Pick<StoryArcPatchDto, "name"> = {
      name: name.trim(),
    };

    try {
      const response = await fetch(
        `/api/adventures/${adventureUuid}/story-arcs/${storyArc.uuid}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(storyArcPatchDto),
        },
      );

      if (!response.ok) {
        const errorResponse = (await response.json()) as { errors?: string[] };
        setErrorMessage(
          errorResponse.errors?.join(", ") ?? "Unable to update story arc",
        );
        return;
      }

      const updatedStoryArc = (await response.json()) as StoryArcDto;
      setName(updatedStoryArc.name);
      onStoryArcUpdated(updatedStoryArc);
    } catch {
      setErrorMessage("Unable to update story arc");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <h3>
        {translate("storyArc.form.title", translationsNamespace, {
          name: storyArc.name,
        })}
      </h3>
      <form className={className ?? ""} onSubmit={onSubmit}>
        <input
          name="name"
          id="story-arc-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        {errorMessage && <p>{errorMessage}</p>}
        <SubmitButton
          label={translate("storyArc.edit", translationsNamespace)}
        />
      </form>
    </>
  );
};

export default StoryArcForm;
