import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowRight, Brain, Clock, Search } from "lucide-react";

export default async function ProblemsPage() {
  const problems = await prisma.problem.findMany({
    where: {
      isPublished: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: { submissions: true },
      },
    },
  });

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
          {problems.map((problem: any, index) => (
            <Link
              key={problem.id}
              href={`/problems/${problem.id}`}
              className="group block"
            >
              <div
                className="bg-card border border-border/50 rounded-xl p-5 hover:border-primary/50 hover:bg-card/80 transition-all duration-300 shadow-sm relative overflow-hidden"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="text-primary w-5 h-5 -translate-x-4 group-hover:translate-x-0 transition-transform duration-300" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                      {problem.title}
                    </h3>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono mt-2">
                      <span
                        className={`px-2 py-0.5 rounded border ${
                          problem.difficulty === "EASY"
                            ? "bg-green-500/10 text-green-600 border-green-500/20"
                            : problem.difficulty === "MEDIUM"
                              ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                              : "bg-red-500/10 text-red-600 border-red-500/20"
                        } font-semibold`}
                      >
                        {problem.difficulty}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Brain size={12} className="text-primary/70" />
                        {problem._count?.submissions || 0} submissions
                      </span>
                      {problem.timeLimitMs && (
                        <span className="flex items-center gap-1.5">
                          <Clock size={12} />
                          {problem.timeLimitMs}ms
                        </span>
                      )}
                    </div>
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
