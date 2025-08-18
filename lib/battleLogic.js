import { DiceRoll } from "@dice-roller/rpg-dice-roller";
import { useGameStore } from "./store";

const DAMAGE = [
  [0, 0, 0, 1],
  [0, 0, 1, 1],
  [0, 1, 1, 2],
  [1, 1, 2, 3],
  [1, 2, 3, 3],
  [2, 3, 3, 4],
];

export const rollDamage = (level) => {
  const roll = new DiceRoll("1d4");
  return DAMAGE[level][roll.total - 1];
};

const updateStore = useGameStore.getState().updateStore;
const updateLog = useGameStore.getState().updateLog;
const damageSagard = useGameStore.getState().damageSagard;
const damageFoe = useGameStore.getState().damageFoe;
const damageAlly = useGameStore.getState().damageAlly;
const decreaseHold = useGameStore.getState().decreaseHold;
const decreaseShield = useGameStore.getState().decreaseShield;
const endBattle = useGameStore.getState().endBattle;

export const attackFoe = (foe) => {
  let totalDamage = 0;
  const level = useGameStore.getState().level;
  const gear = useGameStore.getState().gear;
  let damage = rollDamage(level);
  if (gear.some((item) => item.name === "Sword")) {
    damage++;
  }
  totalDamage += damage;

  handleHit("Sagard", damage);

  const allies = useGameStore.getState().currentBattle.allies;
  if (allies) {
    allies.forEach((ally) => {
      damage = rollDamage(ally.level);
      totalDamage += damage;
      handleHit(ally.name, damage);
    });
  }

  damageFoe(foe.name, totalDamage);

  const foes = useGameStore.getState().currentBattle.foes;
  const hp = useGameStore.getState().hp;
  if (!foes.some((foe) => foe.hp > 0) && hp > 0) {
    endBattle("success");
  } else if (hp <= 0) {
    endBattle("failure");
  }
};

export const attackAlly = (foe, ally) => {
  const level = foe.level;
  const damage = rollDamage(level);

  handleHit(foe.name, damage);

  damageAlly(ally.name, damage);
};

export const handleHit = (fighter, amount) => {
  const gear = useGameStore.getState().gear;
  // mail shirt; possibly change this to an armor attribute?
  if (
    fighter != "Sagard" &&
    gear.some((item) => item.name === "Mail shirt") &&
    amount > 0
  ) {
    amount--;
  }

  // log the message
  if (amount === 0) {
    updateLog(`${fighter} misses!`);
  } else {
    updateLog(`${fighter} hits for ${amount} damage!`);
  }

  //start the enemy attack
  if (fighter === "Sagard") {
    enemiesAttack();
  }
};

export const enemiesAttack = () => {
  const currentBattle = useGameStore.getState().currentBattle;
  // handle melting Ice Golem logic
  if (currentBattle.section === 105 || currentBattle.section === 109) {
    damageFoe("Ice Golem", 2);
    updateLog("Ice Golem melted for 2 damage!");
  }

  // handle all enemy attacks
  if (currentBattle.oneByOne) {
    // only let the first surviving enemy attack
    const foe = currentBattle.foes.find((foe) => foe.hp > 0 && !foe.hold);
    attackSagard(foe);
  } else {
    // all surviving enemies attack
    currentBattle.foes.forEach((foe) => {
      if (foe.hold && foe.hold > 0) {
        decreaseHold(foe.name);
      }

      if (foe.hp > 0 && !foe.hold) {
        // if there surviving allies, attack first one
        // otherwise attack sagard
        const allies = currentBattle.allies;
        if (allies && allies.length > 0 && allies.some((ally) => ally.hp > 0)) {
          const firstAlive = allies.find((ally) => ally.hp > 0);
          attackAlly(foe, firstAlive);
        } else {
          attackSagard(foe);
        }
      }
    });
  }

  const nextRound = useGameStore.getState().nextRound;
  nextRound();
};

export const attackSagard = (foe) => {
  let damage = rollDamage(foe.level);
  damage += foe.dmgModifier ? foe.dmgModifier : 0;
  handleHit(foe.name, damage);

  // handle damage
  const gear = useGameStore.getState().gear;
  // mail shirt; possibly change this to an armor attribute?
  if (gear.some((item) => item.name === "Mail shirt") && damage > 0) {
    damage--;
  }

  // shield - absorb
  if (gear.some((item) => item.name === "Tehnite shield") && damage > 0) {
    const shield = gear.find((item) => item.name === "Tehnite shield");
    if (shield.max > 0 && shield.max > damage) {
      updateLog(`Shield absorbed ${damage} damage`);
      // if more shield than damage, absorb all of it and set damage to 0
      decreaseShield(damage);
      damage = 0;
    } else if (shield.max > 0 && shield.max <= damage) {
      updateLog(`Shield absorbed ${shield.max} damage and is now useless`);
      // if less shield than damage, subtract shield from damage and set shield to 0
      damage -= shield.max;
      decreaseShield(shield.max);
      updateStore({
        gear: [{ name: "-Tehnite shield" }],
        trophies: [{ name: "Raven from shield", points: 2, add: true }],
      });
    }
  }

  damageSagard(damage);

  const hp = useGameStore.getState().hp;
  if (hp <= 0) {
    endBattle("failure");

    // plumed knight check
    const currentBattle = useGameStore.getState().currentBattle;
    if (currentBattle.section === 51) {
      updateStore({ lostToKnight: 1 });
    }
  }
};
