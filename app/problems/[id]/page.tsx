import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  HardDrive,
  User,
  CheckCircle2,
  Play,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const dynamic = "force-dynamic";

// Define Page Props manually for Next.js 15/16 (User is on 16.1.4)
interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProblemPage(props: PageProps) {
  const params = await props.params;

  const problem = await prisma.problem.findUnique({
    where: {
      id: params.id,
    },
    include: {
      creator: {
        select: {
          name: true,
          image: true,
        },
      },
      testCases: {
        where: {
          isSample: true,
        },
        take: 3,
      },
    },
  });

  if (!problem) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background font-body selection:bg-primary selection:text-white">
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Problem Details */}
          <div className="lg:col-span-2 space-y-8 animate-fade-in">
            {/* Header Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h1 className="font-display text-4xl font-bold text-foreground">
                  {problem.title}
                </h1>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    problem.difficulty === "EASY"
                      ? "bg-green-500/10 text-green-600 border-green-500/20"
                      : problem.difficulty === "MEDIUM"
                        ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                        : "bg-red-500/10 text-red-600 border-red-500/20"
                  }`}
                >
                  {problem.difficulty}
                </span>
              </div>

              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-primary" />
                  <span>
                    Time Limit:{" "}
                    <span className="text-foreground font-mono">
                      {problem.timeLimitMs}ms
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <HardDrive size={16} className="text-accent" />
                  <span>
                    Memory Limit:{" "}
                    <span className="text-foreground font-mono">
                      {problem.memoryLimitMb}MB
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <User size={16} className="text-secondary-foreground" />
                  <span>
                    Author:{" "}
                    <span className="text-foreground">
                      {problem.creator.name || "Unknown"}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className="h-px bg-border/50" />

            {/* Description Body */}
            <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-display prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1 prose-code:rounded prose-code:before:content-none prose-code:after:content-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {problem.description}
              </ReactMarkdown>
            </div>

            {/* Sample Test Cases */}
            {problem.testCases.length > 0 && (
              <div className="space-y-4 pt-4">
                <h2 className="font-display text-2xl font-bold">
                  Sample Cases
                </h2>
                <div className="grid gap-4">
                  {problem.testCases.map((tc, i) => (
                    <div
                      key={tc.id}
                      className="bg-card border border-border rounded-xl overflow-hidden"
                    >
                      <div className="bg-secondary/20 px-4 py-2 text-xs font-mono text-muted-foreground border-b border-border flex justify-between">
                        <span>Sample {i + 1}</span>
                      </div>
                      <div className="grid grid-cols-2 divide-x divide-border">
                        <div className="p-4">
                          <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                            Input
                          </p>
                          <pre className="font-mono text-sm text-foreground overflow-x-auto whitespace-pre-wrap">
                            {tc.input}
                          </pre>
                        </div>
                        <div className="p-4">
                          <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                            Output
                          </p>
                          <pre className="font-mono text-sm text-foreground overflow-x-auto whitespace-pre-wrap">
                            {tc.expectedOutput}
                          </pre>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sidebar (Submission, Stats, etc.) */}
          <div className="space-y-6 lg:sticky lg:top-24 h-fit animate-slide-up animate-delay-200">
            {/* Submit Card */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-lg shadow-black/5">
              <h3 className="font-display text-xl font-bold mb-4">
                Submit Solution
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Choose your language and paste your code to solve this problem.
              </p>
              <button className="w-full py-3 bg-primary hover:bg-primary-600 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                <Play size={18} fill="currentColor" />
                Solve Problem
              </button>
            </div>

            {/* Stats Card (Placeholder) */}
            <div className="bg-card/50 border border-border/50 rounded-xl p-6">
              <h4 className="font-semibold text-sm text-muted-foreground mb-4 uppercase tracking-wider">
                Problem Stats
              </h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Difficulty</span>
                  <span className="font-medium text-foreground">
                    {problem.difficulty}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Created</span>
                  <span className="font-medium text-foreground">
                    {new Date(problem.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
