import Image, { ImageProps } from "next/image";
import { isBg3WikiImage } from "@/app/combat-tracker/_lib/bg3-wiki/bg3-wiki.images";

type CharacterPortraitProps = Omit<ImageProps, "src" | "unoptimized"> & {
  src: string;
};

/**
 * Character picture: wiki images go through Next's image optimisation,
 * any other URL typed by hand is displayed as is (its host isn't allowed
 * in next.config.ts).
 */
const CharacterPortrait = ({ src, alt, ...props }: CharacterPortraitProps) => (
  <Image src={src} alt={alt} unoptimized={!isBg3WikiImage(src)} {...props} />
);

export default CharacterPortrait;
