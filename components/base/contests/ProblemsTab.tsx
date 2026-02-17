"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { DifficultyLevel } from "@prisma/client";

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

interface ProblemsTabProps {
  contestId: string;
  problems: ContestProblem[];
}

export function ProblemsTab({ contestId, problems }: ProblemsTabProps) {
  const router = useRouter();

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-semibold tracking-tight">
          Problems
        </h2>
        <span className="text-sm text-muted-foreground">
          {problems.length} challenges
        </span>
      </div>

      <div className="grid gap-4">
        {problems.map((bp) => (
          <div
            key={bp.problemId}
            onClick={() =>
              router.push(`/problems/${bp.problemId}?contestId=${contestId}`)
            }
            className="group bg-card hover:bg-secondary/20 border border-border/60 rounded-xl p-6 transition-all duration-200 cursor-pointer hover:border-border hover:shadow-sm"
          >
            <div className="flex items-center gap-6">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary/50 text-foreground font-mono text-sm font-medium group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                {String.fromCharCode(65 + bp.order - 1)}
              </span>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1.5">
                  <h3 className="text-lg font-medium text-foreground truncate group-hover:text-primary transition-colors">
                    {bp.problem.title}
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide uppercase border ${
                      bp.problem.difficulty === "EASY"
                        ? "bg-green-500/5 text-green-600 border-green-500/20"
                        : bp.problem.difficulty === "MEDIUM"
                          ? "bg-yellow-500/5 text-yellow-600 border-yellow-500/20"
                          : "bg-red-500/5 text-red-600 border-red-500/20"
                    }`}
                  >
                    {bp.problem.difficulty}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground font-mono">
                  {bp.problem.timeLimitMs}ms
                </p>
              </div>

              <ArrowRight className="w-5 h-5 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
