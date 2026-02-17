"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Trophy, ArrowRight } from "lucide-react";
import ContestCard from "@/components/base/ContestCard";

export interface Contest {
  id: string;
  title: string;
  description: string;
  startTime: string;
  durationInMinutes: number;
  creator: {
    name: string;
    image: string;
  };
  _count: {
    contestParticipants: number;
    contestProblems: number;
  };
}

export default function ContestsPage() {
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["contests"],
    queryFn: async () => {
      const res = await axios.get("/api/contests");
      return res.data;
    },
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24,
  });

  const contests: Contest[] = data?.contest || [];

  return (
    <div className="min-h-screen bg-background font-body text-foreground pb-20">
      <main className="container mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6 animate-fade-in">
          <div>
            <h1 className="font-display text-4xl font-bold text-foreground mb-3 flex items-center gap-3 tracking-tight">
              <Trophy className="text-primary w-8 h-8" />
              Contests
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
              Participate in competitive programming contests to test your
              skills and climb the leaderboard.
            </p>
          </div>

          <button
            onClick={() => router.push("/create-contest")}
            className="group px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium transition-all shadow-sm hover:shadow-md hover:bg-primary/90 flex items-center gap-2"
          >
            Create Contest
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {isLoading ? (
          <div className="grid gap-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-48 bg-card rounded-xl border border-border/50"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-24 text-muted-foreground bg-card border border-border/50 rounded-xl">
            Failed to load contests. Please try again later.
          </div>
        ) : contests.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-border rounded-xl bg-card/50">
            <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-foreground mb-1 font-display">
              No contests found
            </h3>
            <p className="text-muted-foreground">
              Be the first to create a contest!
            </p>
          </div>
        ) : (
          <div className="grid gap-6 animate-slide-up">
            {contests.map((contest) => (
              <ContestCard key={contest.id} contest={contest} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
