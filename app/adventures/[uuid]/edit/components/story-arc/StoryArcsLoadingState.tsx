import Skeleton from "@components/_basics/skeleton/Skeleton.server";

const StoryArcsLoadingState = () => {
  return (
    <>
      <Skeleton type={"rectangle"} width={"400px"} height={"25px"} />
      <Skeleton type={"rectangle"} width={"400px"} height={"25px"} />
      <Skeleton type={"rectangle"} width={"400px"} height={"25px"} />
    </>
  );
};

export default StoryArcsLoadingState;
