import Link from "next/link";
import ReactMarkdown from "react-markdown";
import sections from "@/public/sections";

const StoryPage = async ({ params }) => {
  const { id } = await params;
  const currentSection = sections.find((section) => section.id === id);
  return (
    <section>
      <h1>{currentSection.title}</h1>
      <ReactMarkdown>{currentSection.text}</ReactMarkdown>
      {currentSection.choices.map((choice) => (
        <Link className="button" href={choice.sectionId} key={choice.sectionId}>
          {choice.btnText}
        </Link>
      ))}
    </section>
  );
};

export default StoryPage;
