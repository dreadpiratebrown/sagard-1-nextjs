import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

export const useGameStore = create(
  devtools(
    persist(
      (set, get) => ({
        level: 2,
        hp: 20,
        xp: 0,
        gear: [],
        trophies: [],
        lostToKnight: 0,
        menInWhite: 0,
        battleIntro: true,

        updateStore: (payload) => {
          const state = get();
          const updates = { ...payload };

          // Special HP logic
          if (payload.hp !== undefined) {
            let newHp = state.hp + payload.hp;
            newHp = Math.min(Math.max(newHp, 0), 20); // clamp between 0 and 20
            updates.hp = newHp;
          }

          // Merge/remove logic for gear
          if (payload.gear) {
            const toRemove = payload.gear
              .filter((item) => item.startsWith("-"))
              .map((item) => item.slice(1));
            const toAdd = payload.gear.filter((item) => !item.startsWith("-"));

            updates.gear = Array.from(
              new Set([
                ...state.gear.filter((item) => !toRemove.includes(item)), // keep old except removals
                ...toAdd, // add new
              ])
            );
          }

          // Merge/remove logic for trophies
          if (payload.trophies) {
            const toRemove = payload.trophies
              .filter((item) => item.startsWith("-"))
              .map((item) => item.slice(1));
            const toAdd = payload.trophies.filter(
              (item) => !item.startsWith("-")
            );

            updates.trophies = Array.from(
              new Set([
                ...state.trophies.filter((item) => !toRemove.includes(item)),
                ...toAdd,
              ])
            );
          }

          set(updates);
        },
        resetGame: () => {
          set({
            level: 2,
            hp: 20,
            xp: 0,
            gear: [],
            trophies: [],
            lostToKnight: 0,
            menInWhite: 0,
            battleIntro: true,
          });
        },
      }),
      {
        name: "sagard-book-1",
      }
    )
  )
);
