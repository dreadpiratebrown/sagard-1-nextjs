import StoryUi from "./story-ui";

const StoryPage = async ({ params }) => {
  const { id } = await params;

  return <StoryUi id={id} />;
};

export default StoryPage;
