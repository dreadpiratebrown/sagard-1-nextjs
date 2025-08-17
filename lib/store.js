import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import uuid from "react-uuid";

export const useGameStore = create(
  devtools(
    persist(
      (set, get) => ({
        level: 2,
        hp: 20,
        xp: 0,
        gear: [],
        trophies: [],
        currentBattle: null,
        lostToKnight: 0,
        menInWhite: 0,
        battleIntro: true,
        battleLog: [],

        updateStore: (payload) => {
          const state = get();
          const updates = { ...payload };

          // Special HP logic
          if (payload.hp !== undefined) {
            let newHp = state.hp + payload.hp;
            newHp = Math.min(Math.max(newHp, 0), 20); // clamp between 0 and 20
            updates.hp = newHp;
          }

          // XP
          if (payload.xp) {
            let newXp = state.xp + payload.xp;
            updates.xp = newXp;
          }

          // Merge/remove logic for gear
          if (payload.gear) {
            const toRemove = payload.gear
              .filter((item) => item.name.startsWith("-"))
              .map((item) => item.name.slice(1));
            const toAdd = payload.gear.filter(
              (item) => !item.name.startsWith("-")
            );

            updates.gear = Array.from(
              new Set([
                ...state.gear.filter((item) => !toRemove.includes(item.name)), // keep old except removals
                ...toAdd, // add new
              ])
            );
          }

          // Merge/remove logic for trophies
          if (payload.trophies) {
            const toRemove = payload.trophies
              .filter((item) => item.name.startsWith("-"))
              .map((item) => item.name.slice(1));
            const toAdd = payload.trophies.filter(
              (item) => !item.name.startsWith("-")
            );

            updates.trophies = Array.from(
              new Set([
                ...state.trophies.filter(
                  (item) => !toRemove.includes(item.name)
                ),
                ...toAdd,
              ])
            );
          }

          if (payload.lostToKnight) {
            updates.lostToKnight += 1;
          }

          if (payload.menInWhite) {
            updates.menInWhite += 1;
          }

          set(updates);
        },
        setBattle: (battle) => {
          set({
            currentBattle: {
              ...battle,
              round: 0,
              showEvent: false,
              fleeDisabled: false,
              specialDisabled: false,
              outcome: null,
            },
          });
        },
        endBattle: (outcome) => {
          const battle = get().currentBattle;
          set({ currentBattle: { ...battle, outcome } });
        },
        disableFlee: () => {
          const battle = get().currentBattle;
          set({ currentBattle: { ...battle, fleeDisabled: true } });
        },
        disableSpecial: () => {
          const battle = get().currentBattle;
          set({ currentBattle: { ...battle, specialDisabled: true } });
        },
        damageSagard: (amount) => {
          set((state) => ({
            hp: Math.max(0, state.hp - amount),
          }));
        },
        damageFoe: (foeName, amount) => {
          set((state) => ({
            currentBattle: {
              ...state.currentBattle,
              foes: state.currentBattle.foes.map((foe) =>
                foe.name === foeName
                  ? { ...foe, hp: Math.max(0, foe.hp - amount) }
                  : foe
              ),
            },
          }));
        },
        damageAlly: (allyName, amount) => {
          set((state) => ({
            currentBattle: {
              ...state.currentBattle,
              allies: state.currentBattle.allies.map((ally) =>
                ally.name === allyName
                  ? { ...ally, hp: Math.max(0, ally.hp - amount) }
                  : ally
              ),
            },
          }));
        },
        decreaseHold: (foeName) => {
          set((state) => ({
            currentBattle: {
              ...state.currentBattle,
              foes: state.currentBattle.foes.map((foe) =>
                foe.name === foeName ? { ...foe, hold: foe.hold - 1 } : foe
              ),
            },
          }));
        },
        decreaseShield: (amount) => {
          set((state) => ({
            gear: state.gear.map((item) =>
              item.name === "Tehnite shield"
                ? { ...item, max: item.max - amount }
                : item
            ),
          }));
        },
        nextRound: () => {
          const battle = get().currentBattle;
          const newRound = battle.round + 1;
          let showEvent = false;

          if (battle.event && battle.event.rounds === newRound) {
            showEvent = true;
          }

          set({
            currentBattle: {
              ...battle,
              round: newRound,
              showEvent,
              fleeDisabled: false,
              specialDisabled: false,
            },
          });
        },
        updateLog: (msg) => {
          set((state) => ({
            battleLog: [...state.battleLog, { id: uuid(), text: msg }],
          }));
        },
        resetLog: () => {
          set({ battleLog: [] });
        },
        resetGame: () => {
          set({
            level: 2,
            hp: 20,
            xp: 0,
            gear: [],
            trophies: [],
            currentBattle: null,
            lostToKnight: 0,
            menInWhite: 0,
            battleIntro: true,
            battleLog: [],
          });
        },
      }),
      {
        name: "sagard-book-1",
        onRehydrateStorage: () => (state) => {
          // Runs after hydration
          if (!state?.currentBattle) {
            console.log("Store was empty, initializing defaults");
            get().resetGame();
          }
        },
      }
    )
  )
);
