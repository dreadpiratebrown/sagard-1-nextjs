import BattleUi from "./battle-ui";

const BattlePage = async ({ params }) => {
  const { id } = await params;

  return <BattleUi id={id} />;
};

export default BattlePage;
