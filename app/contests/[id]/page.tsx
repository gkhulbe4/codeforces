"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  Trophy,
  Users,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { formatDate } from "@/lib/utils/formatDate";
import { formatDuration } from "@/lib/utils/formatDuration";
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

interface ContestDetails {
  id: string;
  title: string;
  description: string;
  startTime: string;
  durationInMinutes: number;
  _count: {
    contestParticipants: number;
  };
  contestProblems: ContestProblem[];
}

export default function ContestPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const {
    data: contest,
    isLoading,
    isError,
  } = useQuery<ContestDetails>({
    queryKey: ["contest", id],
    queryFn: async () => {
      const res = await axios.get(`/api/contests/${id}`);
      return res.data;
    },
    staleTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !contest) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Contest not found or error loading details.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-body selection:bg-primary selection:text-white pb-20">
      <main className="container mx-auto px-6 py-12 max-w-5xl">
        <div className="bg-card border border-border/50 rounded-2xl p-8 shadow-lg shadow-black/5 mb-10 animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-purple-600"></div>
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-3 text-primary mb-2">
                <Trophy className="w-6 h-6" />
                <span className="font-display font-bold tracking-wide text-sm uppercase">
                  Competitive Programming
                </span>
              </div>
              <h1 className="font-display text-4xl font-bold text-foreground leading-tight">
                {contest.title}
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed whitespace-pre-line">
                {contest.description}
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-4 text-sm font-medium text-muted-foreground">
                <div className="flex items-center gap-2 bg-secondary/30 px-3 py-1.5 rounded-full">
                  <Calendar className="w-4 h-4 text-primary" />
                  {formatDate(contest.startTime)}
                </div>
                <div className="flex items-center gap-2 bg-secondary/30 px-3 py-1.5 rounded-full">
                  <Clock className="w-4 h-4 text-primary" />
                  {formatDuration(contest.durationInMinutes)}
                </div>
                <div className="flex items-center gap-2 bg-secondary/30 px-3 py-1.5 rounded-full">
                  <Users className="w-4 h-4 text-primary" />
                  {contest._count.contestParticipants} Participants
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center min-w-[200px] border-l border-border/50 pl-8 md:text-right">
              <div className="text-sm text-muted-foreground mb-1">Status</div>
              <div className="text-xl font-bold text-green-500 flex items-center md:justify-end gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                Active
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 animate-slide-up">
          <h2 className="text-2xl font-display font-bold flex items-center gap-3">
            Problems
            <span className="text-sm font-normal text-muted-foreground bg-secondary px-2 py-1 rounded-md">
              {contest.contestProblems.length}
            </span>
          </h2>

          <div className="grid gap-3">
            {contest.contestProblems.map((bp) => (
              <div
                key={bp.problemId}
                onClick={() =>
                  router.push(`/contests/${contest.id}/problem/${bp.problemId}`)
                }
                className="group bg-card hover:bg-secondary/5 border border-border/50 rounded-xl p-5 transition-all cursor-pointer hover:border-primary/20 hover:shadow-md active:scale-[0.99] flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-5">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary text-base font-bold font-mono group-hover:bg-primary group-hover:text-white transition-colors">
                    {String.fromCharCode(65 + bp.order - 1)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      {bp.problem.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1 text-xs">
                      <span
                        className={`px-2 py-0.5 rounded font-medium tracking-wide uppercase
                          ${
                            bp.problem.difficulty === "EASY"
                              ? "bg-green-500/10 text-green-500"
                              : bp.problem.difficulty === "MEDIUM"
                                ? "bg-yellow-500/10 text-yellow-500"
                                : "bg-red-500/10 text-red-500"
                          }`}
                      >
                        {bp.problem.difficulty}
                      </span>
                      <span className="text-muted-foreground">
                        Time: {bp.problem.timeLimitMs}ms
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pr-4 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                  <ArrowRight className="w-5 h-5 text-primary" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
