import Skeleton from "@components/_basics/skeleton/Skeleton.server";

const BasicInfoLoadingState = () => {
  return (
    <>
      <Skeleton type={"rectangle"} width={"300px"} height={"25px"} />
      <Skeleton type={"rectangle"} width={"400px"} height={"19px"} />
      <Skeleton type={"rectangle"} width={"400px"} height={"19px"} />
    </>
  );
};

export default BasicInfoLoadingState;
