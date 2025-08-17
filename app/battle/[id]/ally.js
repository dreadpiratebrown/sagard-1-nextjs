"use client";

import BattleCard from "@/components/battle-card";
import { useGameStore } from "@/lib/store";

const Ally = ({ allyName }) => {
  const store = useGameStore();
  const currentBattle = store.currentBattle;
  const ally = currentBattle.allies.find((ally) => ally.name === allyName);
  return (
    <li>
      <BattleCard
        name={ally.name}
        icon={ally.icon}
        level={ally.level}
        hp={ally.hp}
        maxHp={ally.maxHp}
      />
    </li>
  );
};

export default Ally;
