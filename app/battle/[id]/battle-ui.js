"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { DiceRoll } from "@dice-roller/rpg-dice-roller";
import battles from "@/public/battles";
import { useGameStore } from "@/lib/store";
import { enemiesAttack } from "@/lib/battleLogic";
import BattleCard from "@/components/battle-card";
import styles from "./styles.module.css";
import Foe from "./foe";
import Ally from "./ally";

const BattleUi = ({ id }) => {
  const router = useRouter();
  const resetLog = useGameStore((state) => state.resetLog);
  const updateLog = useGameStore((state) => state.updateLog);
  const setBattle = useGameStore((state) => state.setBattle);
  const disableFlee = useGameStore((state) => state.disableFlee);
  const disableSpecial = useGameStore((state) => state.disableSpecial);
  const level = useGameStore((state) => state.level);
  const hp = useGameStore((state) => state.hp);
  const battleLog = useGameStore((state) => state.battleLog);

  useEffect(() => {
    resetLog();
  }, []);

  useEffect(() => {
    setBattle(battles.find((battle) => battle.id === id));
  }, [id, setBattle]);

  const currentBattle = useGameStore((state) => state.currentBattle);

  const flee = () => {
    const roll = new DiceRoll("1d4");
    if (roll.total % 2 === 0) {
      router.push(currentBattle.flee);
    } else {
      updateLog("You failed to flee.");
    }
    disableFlee();
  };

  const rollSpecial = () => {
    const roll = new DiceRoll("1d4");
    if (currentBattle.special.rollNeeded.includes(roll.total)) {
      router.push(currentBattle.special.target);
    } else {
      updateLog(currentBattle.special.failText);
      disableSpecial();
      if (!currentBattle.special.attackAfterRoll) {
        enemiesAttack();
      }
    }
  };

  return (
    currentBattle && (
      <section className="battle-section">
        <h1>{currentBattle.title}</h1>
        <ReactMarkdown>{currentBattle.text}</ReactMarkdown>
        <div className={styles.battleUi}>
          <div className={styles.goodGuys}>
            <BattleCard
              name="Sagard"
              icon="barbarian.svg"
              level={level}
              hp={hp}
              character="sagard"
            />
            {currentBattle.allies && (
              <ol className={styles.allies}>
                {currentBattle.allies.map((ally) => (
                  <Ally allyName={ally.name} key={ally.name} />
                ))}
              </ol>
            )}
          </div>
          <ol className={styles.foes}>
            {currentBattle.foes.map((foe) => (
              <Foe foeName={foe.name} key={foe.name} />
            ))}
          </ol>
        </div>

        {currentBattle.showEvent && (
          <div>
            <p>{currentBattle.event.text}</p>
            {currentBattle.event.choices.map((button) => (
              <Link key={button.target} className="button" href={button.target}>
                {button.btnText}
              </Link>
            ))}
          </div>
        )}

        {currentBattle.canFlee && !currentBattle.outcome && (
          <button
            className="button flee"
            onClick={flee}
            disabled={currentBattle.fleeDisabled}
          >
            Flee!
          </button>
        )}

        {currentBattle.special && !currentBattle.outcome && (
          <button
            className="button flee"
            onClick={rollSpecial}
            disabled={currentBattle.specialDisabled}
          >
            {currentBattle.special.button}
          </button>
        )}

        {currentBattle.outcome && (
          <Link
            className="button"
            href={
              currentBattle.outcome === "success"
                ? currentBattle.success.target
                : currentBattle.failure.target
            }
          >
            {currentBattle.outcome === "success"
              ? currentBattle.success.text
              : currentBattle.failure.text}
          </Link>
        )}
        <div className={styles.battleLog}>
          <ul>
            {[...battleLog].reverse().map((item) => (
              <li key={item.id}>{item.text}</li>
            ))}
          </ul>
        </div>
      </section>
    )
  );
};

export default BattleUi;
