import Image from "next/image";
import styles from "./styles.module.css";

const BattleCard = ({ name, icon, level, hp, maxHp, character = "npc" }) => {
  const max = character === "sagard" ? 20 : maxHp;
  return (
    <div className={styles["battle-card"]}>
      <div className={styles["battle-card--title"]}>{name}</div>
      <div className={styles["battle-card--info"]}>
        <Image src={`/${icon}`} alt={name} width={90} height={90} />
        Level: {level}
        <div className={styles["hp-bar"]}>
          <div className={styles["hp-bar--bg"]}>
            <div
              className={styles["hp-bar--fg"]}
              style={{ width: (hp / max) * 100 + "%" }}
            >
              {hp}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BattleCard;
