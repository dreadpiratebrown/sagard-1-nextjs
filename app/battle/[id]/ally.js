"use client";

import { useEffect } from "react";
import BattleCard from "@/components/battle-card";
import { useGameStore } from "@/lib/store";

const Ally = ({ allyName }) => {
  const store = useGameStore();
  const currentBattle = store.currentBattle;
  const updateStore = store.updateStore;
  const ally = currentBattle.allies.find((ally) => ally.name === allyName);

  useEffect(() => {
    if (ally.hp <= 0 && currentBattle.section === 84) {
      // update menInWhite
      updateStore({ menInWhite: 1 });
    }
  }, [ally.hp]);

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
