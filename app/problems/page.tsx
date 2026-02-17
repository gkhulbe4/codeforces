"use client";
import Link from "next/link";
import { ArrowRight, Brain, Clock, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ProblemsPage() {
  const { data: problems, isLoading } = useQuery({
    queryKey: ["problems"],
    queryFn: async () => {
      const res = await axios.get("/api/problems/getAllProblems");
      return res.data.problems;
    },
    staleTime: 60 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background font-body">
        <main className="container mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div className="space-y-3">
              <div className="w-48 h-10 bg-muted animate-pulse rounded-lg" />
              <div className="w-96 h-6 bg-muted animate-pulse rounded-lg" />
            </div>
            <div className="w-full md:w-80 h-10 bg-muted animate-pulse rounded-lg" />
          </div>

          <div className="grid gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-card border border-border/60 rounded-xl p-6 relative overflow-hidden"
              >
                <div className="flex items-center justify-between gap-6">
                  <div className="space-y-3 flex-1">
                    <div className="flex gap-2">
                      <div className="w-32 h-4 bg-muted animate-pulse rounded" />
                      <div className="w-10 h-4 bg-muted animate-pulse rounded" />
                    </div>
                    <div className="w-2/3 h-7 bg-muted animate-pulse rounded-lg" />
                    <div className="flex gap-3">
                      <div className="w-20 h-5 bg-muted animate-pulse rounded" />
                      <div className="w-24 h-5 bg-muted animate-pulse rounded" />
                      <div className="w-16 h-5 bg-muted animate-pulse rounded" />
                    </div>
                  </div>
                  <div className="w-5 h-5 bg-muted animate-pulse rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-body selection:bg-primary selection:text-white">
      <main className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 animate-fade-in">
          <div>
            <h1 className="font-display text-4xl font-bold text-foreground mb-3">
              Problem Set
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Sharpen your skills with our curated collection of algorithmic
              challenges.
            </p>
          </div>

          <div className="relative w-full md:w-auto min-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search problems..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium placeholder:text-muted-foreground/50"
            />
          </div>
        </div>

        <div className="grid gap-4 animate-slide-up">
          {problems.map((problem: any, index: number) => (
            <Link
              key={problem.id}
              href={`/problems/${problem.id}`}
              className="group block"
            >
              <div
                className="bg-card border border-border/60 rounded-xl p-6 hover:border-border hover:bg-secondary/20 transition-all duration-200 shadow-sm hover:shadow-md relative overflow-hidden"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center justify-between gap-6">
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        ID: {problem.id}
                      </span>
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          navigator.clipboard.writeText(problem.id);
                          toast.success("Problem ID copied to clipboard");
                        }}
                        className="text-xs py-1 h-6 cursor-pointer"
                      >
                        copy
                      </Button>
                    </div>
                    <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors tracking-tight truncate">
                      {problem.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground font-medium">
                      <span
                        className={`px-2 py-0.5 rounded border ${
                          problem.difficulty === "EASY"
                            ? "bg-green-500/5 text-green-600 border-green-500/20"
                            : problem.difficulty === "MEDIUM"
                              ? "bg-yellow-500/5 text-yellow-600 border-yellow-500/20"
                              : "bg-red-500/5 text-red-600 border-red-500/20"
                        } font-semibold tracking-wide uppercase`}
                      >
                        {problem.difficulty}
                      </span>
                      <span className="flex items-center gap-1.5 opacity-80">
                        <Brain size={14} className="text-primary/70" />
                        {problem._count?.submissions || 0} submissions
                      </span>
                      {problem.timeLimitMs && (
                        <span className="flex items-center gap-1.5 opacity-80">
                          <Clock size={14} className="text-primary/70" />
                          {problem.timeLimitMs}ms
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pr-2 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
                    <ArrowRight className="text-primary w-5 h-5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {problems.length === 0 && (
            <div className="text-center py-20 bg-card/30 rounded-2xl border border-border/40 border-dashed">
              <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground">
                No problems found
              </h3>
              <p className="text-muted-foreground mt-1">
                Check back later for new challenges.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
