"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { DiceRoll } from "@dice-roller/rpg-dice-roller";
import { useGameStore } from "@/lib/store";
import sections from "@/public/sections";

const StoryUi = ({ id }) => {
  const [rollResult, setRollResult] = useState(null);
  const [showPoints, setShowPoints] = useState(false);

  const currentSection = sections.find((section) => section.id === id);
  const resetGame = useGameStore((state) => state.resetGame);
  const updateStore = useGameStore((state) => state.updateStore);
  const menInWhite = useGameStore((state) => state.menInWhite);
  const lostToKnight = useGameStore((state) => state.lostToKnight);
  const gear = useGameStore((state) => state.gear);
  const trophies = useGameStore((state) => state.trophies);

  const [choices, setChoices] = useState(currentSection.choices || []);

  useEffect(() => {
    if (currentSection.roll) {
      const roll = new DiceRoll(`d${currentSection.roll.length}`).total - 1;
      setRollResult(roll);
    }
  }, [currentSection.roll]);

  useEffect(() => {
    if (id === "introduction") {
      resetGame();
    }
  }, [id]);

  useEffect(() => {
    if (id === "defeating-the-yeti") {
      if (menInWhite === 0) {
        setChoices([
          {
            btnText: "Both are still alive",
            sectionId: "/battle/the-men-in-white",
          },
        ]);
      } else if (menInWhite === 1) {
        setChoices([
          {
            btnText: "One is dead",
            sectionId: "/battle/the-man-in-white",
          },
        ]);
      } else if (menInWhite >= 2) {
        setChoices([
          {
            btnText: "Both are dead",
            sectionId: "/story/after-the-yeti-battle",
          },
        ]);
      }
    }
  }, [id, menInWhite]);

  useEffect(() => {
    if (id === "losing-to-the-plumed-knight") {
      if (lostToKnight === 1) {
        updateStore({ hp: 20 });
        setChoices([
          {
            btnText: "Fight the Plumed Knight again",
            sectionId: "/battle/fighting-the-plumed-knight",
          },
        ]);
      } else if (lostToKnight === 2) {
        updateStore({ hp: 20 });
        setChoices([
          {
            btnText: "Go west",
            sectionId: "leaving-home",
          },
        ]);
      }
    }
  }, []);

  useEffect(() => {
    if (id === "counting-your-trophies") {
      const reducer = (accumulator, currentValue) => accumulator + currentValue;

      let gearPoints = gear.map((item) => item.points);
      let gearPointsTotal = gearPoints.reduce(reducer, 0);

      let trophyPoints = trophies.map((trophy) => trophy.points);
      let trophyPointsTotal = trophyPoints.reduce(reducer, 0);

      let totalPoints = gearPointsTotal + trophyPointsTotal;

      if (totalPoints < 14) {
        setChoices([
          {
            btnText: "See the elders' judgment",
            sectionId: "1-13-trophy-points",
          },
        ]);
      } else if (totalPoints > 13 && totalPoints < 27) {
        setChoices([
          {
            btnText: "See the elders' judgment",
            sectionId: "14-26-trophy-points",
          },
        ]);
      } else {
        setChoices([
          {
            btnText: "See the elders' judgment",
            sectionId: "27-trophy-points-and-up",
          },
        ]);
      }
    }

    if (
      id === "1-13-trophy-points" ||
      id === "14-26-trophy-points" ||
      id === "27-trophy-points-and-up"
    ) {
      setShowPoints(true);
    }
  }, [id]);

  useEffect(() => {
    const section = sections.find((section) => section.id === id);
    if (section?.updates) {
      updateStore(section.updates, id);
    }
  }, [id]);

  return (
    <section>
      <h1>{currentSection.title}</h1>
      {showPoints && (
        <ul className="trophyPoints">
          {gear.map((item) => (
            <li key={item.name}>
              {item.name} - {item.points}
            </li>
          ))}
          {trophies.map((trophy) => (
            <li key={trophy.name}>
              {trophy.name} - {trophy.points}
            </li>
          ))}
        </ul>
      )}
      <ReactMarkdown>{currentSection.text}</ReactMarkdown>
      {choices.map((choice) => (
        <Link className="button" href={choice.sectionId} key={choice.sectionId}>
          {choice.btnText}
        </Link>
      ))}
      {rollResult !== null && (
        <Link
          className="button"
          href={currentSection?.roll[rollResult].sectionId}
        >
          {currentSection?.roll[rollResult].btnText}
        </Link>
      )}
    </section>
  );
};

export default StoryUi;
