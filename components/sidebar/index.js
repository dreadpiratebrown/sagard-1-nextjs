"use client";

import styles from "./styles.module.css";
import { useGameStore } from "@/lib/store";

const Sidebar = () => {
  const store = useGameStore();

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
          {store.trophies.map((trophy) => (
            <li key={trophy.name}>{trophy.name}</li>
          ))}
        </ul>
        {/* <ul>
            <li v-for="trophy in trophies" :key="trophy">{{ trophy.name }} <a href="#" class="useItem" v-if="trophy.usable" @click="heal(trophy.name, $event)">Use</a></li>
        </ul> */}
      </div>
    </div>
  );
};

export default Sidebar;
