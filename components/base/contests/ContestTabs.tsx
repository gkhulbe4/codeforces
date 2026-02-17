"use client";

import { useState } from "react";
import { DifficultyLevel } from "@/types/prisma";
import { ProblemsTab } from "@/components/base/contests/ProblemsTab";
import { StandingsTab } from "@/components/base/contests/StandingsTab";

interface Problem {
  id: string;
  title: string;
  difficulty: DifficultyLevel;
  timeLimitMs: number;
}

interface ContestProblem {
  order: number;
  problem: Problem;
  problemId: string;
}

interface ContestDetails {
  id: string;
  title: string;
  description: string;
  startTime: string;
  durationInMinutes: number;
  contestProblems: ContestProblem[];
}

interface ContestTabsProps {
  contest: ContestDetails;
}

export function ContestTabs({ contest }: ContestTabsProps) {
  const [activeTab, setActiveTab] = useState<"problems" | "standings">(
    "problems",
  );

  return (
    <>
      <div className="flex items-center gap-8 border-b border-border/40 mb-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab("problems")}
          className={`pb-3 text-sm font-medium transition-all relative whitespace-nowrap px-1 ${
            activeTab === "problems"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground hover:border-b-2 hover:border-border/50"
          }`}
        >
          Problems
        </button>
        <button
          onClick={() => setActiveTab("standings")}
          className={`pb-3 text-sm font-medium transition-all relative whitespace-nowrap px-1 ${
            activeTab === "standings"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground hover:border-b-2 hover:border-border/50"
          }`}
        >
          Standings
        </button>
      </div>

      {activeTab === "problems" && (
        <ProblemsTab
          contestId={contest.id}
          problems={contest.contestProblems}
        />
      )}

      {activeTab === "standings" && <StandingsTab id={contest.id} />}
    </>
  );
}
