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
  const store = useGameStore();

  useEffect(() => {
    store.resetLog();
  }, []);

  const setBattle = useGameStore((state) => state.setBattle);

  useEffect(() => {
    setBattle(battles.find((battle) => battle.id === id));
  }, [id, setBattle]);

  const { fleeDisabled, showEvent, specialDisabled, outcome } = useGameStore(
    (state) => state.currentBattle || {}
  );

  const disableFlee = useGameStore((state) => state.disableFlee);
  const disableSpecial = useGameStore((state) => state.disableSpecial);

  const flee = () => {
    const roll = new DiceRoll("1d4");
    if (roll.total % 2 === 0) {
      router.push(store.currentBattle.flee);
    } else {
      store.updateLog("You failed to flee.");
    }
    disableFlee();
  };

  const rollSpecial = () => {
    const roll = new DiceRoll("1d4");
    if (store.currentBattle.special.rollNeeded.includes(roll.total)) {
      router.push(store.currentBattle.special.target);
    } else {
      store.updateLog(store.currentBattle.special.failText);
    }
    if (!store.currentBattle.special.attackAfterRoll) {
      enemiesAttack();
    }
    disableSpecial();
  };

  return (
    store.currentBattle && (
      <section className="battle-section">
        <h1>{store.currentBattle.title}</h1>
        <ReactMarkdown>{store.currentBattle.text}</ReactMarkdown>
        <div className={styles.battleUi}>
          <div className={styles.goodGuys}>
            <BattleCard
              name="Sagard"
              icon="barbarian.svg"
              level={store.level}
              hp={store.hp}
              character="sagard"
            />
            {store.currentBattle.allies && (
              <ol className={styles.allies}>
                {store.currentBattle.allies.map((ally) => (
                  <Ally allyName={ally.name} key={ally.name} />
                ))}
              </ol>
            )}
          </div>
          <ol className={styles.foes}>
            {store.currentBattle.foes.map((foe) => (
              <Foe foeName={foe.name} key={foe.name} />
            ))}
          </ol>
        </div>

        {showEvent && (
          <div>
            <p>{store.currentBattle.event.text}</p>
            {store.currentBattle.event.choices.map((button) => (
              <Link key={button.target} className="button" href={button.target}>
                {button.btnText}
              </Link>
            ))}
          </div>
        )}

        {store.currentBattle.canFlee && !outcome && (
          <button
            className="button flee"
            onClick={flee}
            disabled={fleeDisabled}
          >
            Flee!
          </button>
        )}

        {store.currentBattle.special && !outcome && (
          <button
            className="button flee"
            onClick={rollSpecial}
            disabled={specialDisabled}
          >
            {store.currentBattle.special.button}
          </button>
        )}

        {outcome && (
          <Link
            className="button"
            href={
              outcome === "success"
                ? store.currentBattle.success.target
                : store.currentBattle.failure.target
            }
          >
            {outcome === "success"
              ? store.currentBattle.success.text
              : store.currentBattle.failure.text}
          </Link>
        )}
        <div className={styles.battleLog}>
          <ul>
            {[...store.battleLog].reverse().map((item) => (
              <li key={item.id}>{item.text}</li>
            ))}
          </ul>
        </div>
      </section>
    )
  );
};

export default BattleUi;
