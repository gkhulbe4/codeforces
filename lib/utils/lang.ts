import "dotenv/config";
import { prisma } from "./prisma";

async function main() {
  const lang = [
    {
      name: "C++",
      key: "cpp",
      monacoId: "cpp",
    },
    {
      name: "Java",
      key: "java",
      monacoId: "java",
    },
    {
      name: "Python",
      key: "python",
      monacoId: "python",
    },
    {
      name: "JavaScript",
      key: "javascript",
      monacoId: "javascript",
    },
    {
      id: "5",
      name: "TypeScript",
      key: "typescript",
      monacoId: "typescript",
    },
    {
      id: "6",
      name: "Go",
      key: "go",
      monacoId: "go",
    },
    {
      id: "7",
      name: "Rust",
      key: "rust",
      monacoId: "rust",
    },
    {
      id: "8",
      name: "C",
      key: "c",
      monacoId: "c",
    },
    {
      id: "9",
      name: "C#",
      key: "csharp",
      monacoId: "csharp",
    },
    {
      id: "10",
      name: "PHP",
      key: "php",
      monacoId: "php",
    },
    {
      id: "11",
      name: "Ruby",
      key: "ruby",
      monacoId: "ruby",
    },
    {
      id: "12",
      name: "Swift",
      key: "swift",
      monacoId: "swift",
    },
    {
      id: "13",
      name: "Kotlin",
      key: "kotlin",
      monacoId: "kotlin",
    },
    {
      id: "14",
      name: "Scala",
      key: "scala",
      monacoId: "scala",
    },
    {
      id: "15",
      name: "Haskell",
      key: "haskell",
      monacoId: "haskell",
    },
    {
      id: "16",
      name: "Elixir",
      key: "elixir",
      monacoId: "elixir",
    },
    {
      id: "17",
      name: "Clojure",
      key: "clojure",
      monacoId: "clojure",
    },
    {
      id: "18",
      name: "F#",
      key: "fsharp",
      monacoId: "fsharp",
    },
  ];

  await prisma.language.createMany({
    data: lang.map((l) => ({
      name: l.name,
      key: l.key,
      monacoId: l.monacoId,
    })),
  });
}

main();
