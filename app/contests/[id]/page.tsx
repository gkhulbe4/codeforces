"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Calendar,
  Clock,
  Trophy,
  Users,
  ArrowRight,
  Loader2,
  UserPlus,
  CheckCircle,
} from "lucide-react";
import { formatDate } from "@/lib/utils/formatDate";
import { formatDuration } from "@/lib/utils/formatDuration";
import { DifficultyLevel } from "@/types/prisma";
import { ContestTabs } from "@/components/base/contests/ContestTabs";
import { Button } from "@/components/ui/button";

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
  const { data: session } = useSession();
  const queryClient = useQueryClient();
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
    <div className="min-h-screen bg-background font-body text-foreground pb-24">
      <main className="container mx-auto px-6 py-16">
        <div className="mb-12 animate-fade-in">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-6">
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-3 text-primary mb-2">
                <Trophy className="w-5 h-5" />
                <span className="font-display font-medium tracking-wide text-xs uppercase text-muted-foreground">
                  Competitive Programming
                </span>
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground leading-tight tracking-tight">
                {contest.title}
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
                {contest.description}
              </p>
            </div>

            <div className="flex shrink-0 gap-3">
              <div className="px-4 py-2 bg-green-500/10 text-green-600 rounded-full text-sm font-medium flex items-center gap-2 border border-green-500/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Active Contest
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-8 pt-6 border-t border-border/40">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Start Time
              </span>
              <div className="flex items-center gap-2 text-sm font-medium">
                <Calendar className="w-4 h-4 text-primary/70" />
                {formatDate(contest.startTime)}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Duration
              </span>
              <div className="flex items-center gap-2 text-sm font-medium">
                <Clock className="w-4 h-4 text-primary/70" />
                {formatDuration(contest.durationInMinutes)}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Participants
              </span>
              <div className="flex items-center gap-2 text-sm font-medium">
                <Users className="w-4 h-4 text-primary/70" />
                {contest._count.contestParticipants} Joined
              </div>
            </div>
          </div>
        </div>

        <ContestTabs contest={contest} />
      </main>
    </div>
  );
}
