import { useState } from "react";

/**
 * The inputs of an item being added to a list (passive, action, condition...).
 * `add` returns false when the draft is not valid: it is then kept as is.
 * Enter in an input adds the item instead of submitting the whole form.
 */
export const useNewItem = <Draft>(
  emptyDraft: Draft,
  add: (draft: Draft) => boolean,
) => {
  const [draft, setDraft] = useState(emptyDraft);

  const submit = () => {
    if (add(draft)) {
      setDraft(emptyDraft);
    }
  };

  const submitOnEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      submit();
    }
  };

  return { draft, setDraft, submit, submitOnEnter };
};
