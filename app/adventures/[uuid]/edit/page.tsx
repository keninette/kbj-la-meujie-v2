import EditAdventureLoader from "./components/EditAdventureLoader";

const EditAdventurePage = async ({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) => {
  const { uuid } = await params;

  return <EditAdventureLoader uuid={uuid} />;
};

export default EditAdventurePage;
