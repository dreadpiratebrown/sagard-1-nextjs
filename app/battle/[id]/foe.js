"use client";

import { useEffect, useState } from "react";
import { DiceRoll } from "@dice-roller/rpg-dice-roller";
import BattleCard from "@/components/battle-card";
import { useGameStore } from "@/lib/store";
import { attackFoe, attackSagard } from "@/lib/battleLogic";

const Foe = ({ foeName }) => {
  const [isDefeated, setIsDefeated] = useState(false);

  const store = useGameStore();
  const currentBattle = store.currentBattle;
  const foe = currentBattle.foes.find((foe) => foe.name === foeName);

  if (currentBattle.id === "fighting-the-ratikkan-boy") {
    const roll = new DiceRoll("d2").total;
    if (roll === 1) {
      foe.goFirst = true;
    }
  }

  useEffect(() => {
    if (foe.hp <= 0) {
      setIsDefeated(true);
    }
  }, [foe.hp]);

  useEffect(() => {
    if (foe?.goFirst) {
      attackSagard(foe);
    }
  }, [foe.goFirst]);

  return (
    <li>
      <BattleCard
        name={foe.name}
        icon={foe.icon}
        level={foe.level}
        hp={foe.hp}
        maxHp={foe.maxHp}
      />
      {!isDefeated && (
        <button
          className="button attack"
          onClick={() => attackFoe(foe)}
          disabled={foe.disableOnHold && foe.hold > 1}
        >
          Attack {foe.name}
        </button>
      )}
    </li>
  );
};

export default Foe;
