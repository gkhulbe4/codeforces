"use client";

import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import {
  ArrowRight,
  Code2,
  Terminal,
  Trophy,
  ChevronRight,
} from "lucide-react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-background font-body text-foreground selection:bg-primary/20 selection:text-primary">
      {/* Background Decor */}
      <div className="fixed inset-0 -z-10 h-full w-full bg-background">
        <div className="absolute top-0 z-[-2] h-screen w-screen bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
      </div>

      <main className="container mx-auto px-6 pt-32 pb-24 relative">
        <div className="max-w-4xl mx-auto text-center space-y-10 animate-fade-in">
          <div className="inline-flex items-center rounded-full border border-border/60 bg-secondary/30 px-3 py-1 text-sm text-muted-foreground backdrop-blur-sm transition-colors hover:bg-secondary/50">
            <span className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Platform Live
            </span>
            <div className="mx-2 h-4 w-px bg-border/60" />
            <span className="flex items-center gap-1 hover:text-foreground cursor-pointer">
              Join the beta <ChevronRight className="h-3 w-3" />
            </span>
          </div>

          <h1 className="font-display text-5xl sm:text-7xl font-bold tracking-tight text-foreground leading-[1.1]">
            Master the art of <br />
            <span className="text-primary relative inline-block">
              competitive coding
              <svg
                className="absolute w-full h-3 -bottom-1 left-0 text-primary/20 -z-10"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 5 Q 50 10 100 5"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                />
              </svg>
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed antialiased">
            A premium environment for elite developers to solve algorithmic
            challenges, compete in real-time contexts, and build a world-class
            portfolio.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            {session?.user ? (
              <>
                <Link
                  href="/problems"
                  className="h-12 px-8 rounded-lg bg-primary text-primary-foreground font-medium flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98]"
                >
                  Start Solving
                  <ArrowRight size={18} />
                </Link>
                <Link
                  href="/profile"
                  className="h-12 px-8 rounded-lg border border-border bg-background text-foreground font-medium flex items-center gap-2 hover:bg-secondary/50 transition-all active:scale-[0.98]"
                >
                  View Profile
                </Link>
              </>
            ) : (
              <button
                onClick={() => signIn("google")}
                className="h-12 px-8 rounded-lg bg-foreground text-background font-medium flex items-center gap-2 hover:bg-foreground/90 transition-all shadow-lg shadow-black/20 hover:shadow-black/30 active:scale-[0.98]"
              >
                <Terminal size={18} />
                Start Coding Now
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32">
          {[
            {
              title: "Curated Problems",
              desc: "Hand-picked algorithmic challenges ranging from fundamental concepts to advanced dynamic programming.",
              icon: <Code2 className="w-6 h-6" />,
            },
            {
              title: "Real-time Judges",
              desc: "Instant feedback on your code submissions with detailed execution metrics and test case results.",
              icon: <Terminal className="w-6 h-6" />,
            },
            {
              title: "Global Rankings",
              desc: "Compete with developers around the world. Climb the leaderboard and earn your reputation.",
              icon: <Trophy className="w-6 h-6" />,
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="group p-8 rounded-2xl bg-card border border-border/60 hover:border-border transition-all duration-300 hover:shadow-lg hover:shadow-black/5"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-6 border border-primary/20 group-hover:scale-105 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="font-display text-xl font-semibold mb-3 text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-border/40 bg-background py-12">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary text-primary-foreground flex items-center justify-center font-display font-bold">
              C
            </div>
            <span className="font-display font-bold text-lg">CodeForge</span>
          </div>
          <div className="text-sm text-muted-foreground">
            © 2026 CodeForge. All rights reserved.
          </div>
          <div className="flex gap-8 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
