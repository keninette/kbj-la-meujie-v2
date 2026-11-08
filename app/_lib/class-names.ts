/** CSS classes joined by a space, skipping the empty ones (false, "",
 * undefined...): `cx(styles["a"], isOn && styles["a--on"], className)` */
export const cx = (
  ...classNames: (string | false | null | undefined)[]
): string => classNames.filter(Boolean).join(" ");
