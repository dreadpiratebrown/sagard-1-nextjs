"use client";

import Link from "next/link";
import ReactMarkdown from "react-markdown";
import battles from "@/public/battles";
import { useGameStore } from "@/lib/store";

const BattleUi = ({ id }) => {
  const store = useGameStore();
  const currentBattle = battles.find((battle) => battle.id === id);

  return (
    <section>
      <h1>{currentBattle.title}</h1>
      <ReactMarkdown>{currentBattle.text}</ReactMarkdown>
    </section>
  );
};

export default BattleUi;
