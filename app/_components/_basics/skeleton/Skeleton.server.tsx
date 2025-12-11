import styles from "./skeleton.module.scss";

type SkeletonProps = {
  type: "rectangle" | "text";
  width: number;
  height: number;
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
