"use client";

import { useEffect } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { useGameStore } from "@/lib/store";
import sections from "@/public/sections";

const StoryUi = ({ id }) => {
  const currentSection = sections.find((section) => section.id === id);
  const resetGame = useGameStore((state) => state.resetGame);
  const updateStore = useGameStore((state) => state.updateStore);
  const menInWhite = useGameStore((state) => state.menInWhite);

  useEffect(() => {
    if (id === "introduction") {
      resetGame();
    }
  }, [id]);

  useEffect(() => {
    if (id === "defeating-the-yeti") {
      if (menInWhite === 0) {
        currentSection.choices = [
          {
            btnText: "Both are still alive",
            sectionId: "/sagard/battle/the-men-in-white",
          },
        ];
      } else if (menInWhite === 1) {
        currentSection.choices = [
          {
            btnText: "One is dead",
            sectionId: "/sagard/battle/the-man-in-white",
          },
        ];
      } else if (menInWhite >= 2) {
        currentSection.choices = [
          {
            btnText: "Both are dead",
            sectionId: "/sagard/section/after-the-yeti-battle",
          },
        ];
      }
    }
  }, [id, menInWhite]);

  useEffect(() => {
    const section = sections.find((section) => section.id === id);
    if (section?.updates) {
      updateStore(section.updates);
    }
  }, [id, updateStore]);

  return (
    <section>
      <h1>{currentSection.title}</h1>
      <ReactMarkdown>{currentSection.text}</ReactMarkdown>
      {currentSection.choices?.map((choice) => (
        <Link className="button" href={choice.sectionId} key={choice.sectionId}>
          {choice.btnText}
        </Link>
      ))}
    </section>
  );
};

export default StoryUi;
