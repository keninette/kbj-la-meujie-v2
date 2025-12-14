import styles from "./skeleton.module.scss";

type SkeletonProps = {
  type: "rectangle" | "text";
  width: string;
  height: string;
};

const Skeleton = ({ type, width, height }: SkeletonProps) => {
  const customTypeSizeClass = styles[`skeleton--${type}`];

  return (
    <div
      className={`${styles["skeleton"]} ${customTypeSizeClass}`}
      style={{ width: width, height: height }}
    />
  );
};

export default Skeleton;
