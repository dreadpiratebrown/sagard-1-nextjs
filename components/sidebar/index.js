"use client";

import styles from "./styles.module.css";
import { useGameStore } from "@/lib/store";

const Sidebar = () => {
  const store = useGameStore();

  const heal = (trophy) => {
    if (trophy === "Glowmoss") {
      store.updateStore({
        hp: 20,
        trophies: [{ name: "-Glowmoss " }],
      });
    } else {
      store.updateStore({
        hp: 20,
        trophies: [
          {
            name: "Furred Snake's fang",
            usable: false,
          },
        ],
      });
    }
  };

  return (
    <div className={styles.characterSheet}>
      <p className={styles.stat}>Level: {store.level}</p>
      <p className={styles.stat}>HP: {store.hp}/20</p>
      <p className={styles.stat}>XP: {store.xp}</p>
      <div className={styles.list}>
        <p>
          <strong>Armor &amp; Weapons</strong>
        </p>
        <ul>
          {store.gear.map((item) => (
            <li key={item.name}>
              {item.name} ({item.effect})
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.list}>
        <p>
          <strong>Trophies</strong>
        </p>
        <ul>
          {store.trophies
            .filter((trophy) => !trophy.stash)
            .map((trophy) => (
              <li key={trophy.name}>
                {trophy.name}{" "}
                {trophy.usable && (
                  <button onClick={() => heal(trophy.name)}>USE</button>
                )}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
