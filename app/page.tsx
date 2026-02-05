"use client";

import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import { ArrowRight, Code2, Terminal, Trophy, Zap } from "lucide-react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden font-body selection:bg-primary selection:text-white">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px] animate-pulse" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-accent/5 blur-[120px] animate-pulse animate-delay-500" />
        <div className="absolute bottom-0 left-[20%] w-[30%] h-[30%] rounded-full bg-secondary/5 blur-[100px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      <main className="container mx-auto px-6 pt-24 pb-12 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold tracking-wide uppercase shadow-[0_0_20px_-10px_var(--color-primary)]">
            <Zap size={14} className="fill-current" />
            <span>Premium Coding Arena</span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/60 drop-shadow-sm">
            Master the Art of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-400 to-accent">
              Competitive code
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Join a community of elite developers. Solve algorithmic challenges,
            climb the leaderboard, and showcase your skills in a premium
            environment designed for focus.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            {session?.user ? (
              <>
                <Link
                  href="/problems"
                  className="group relative px-8 py-4 bg-primary hover:bg-primary-600 text-white rounded-xl font-semibold shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-primary/40 hover:-translate-y-1 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Start Solving{" "}
                    <ArrowRight
                      size={18}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-200%] group-hover:animate-[shimmer_1.5s_infinite]"></div>
                </Link>
                <Link
                  href="/profile"
                  className="px-8 py-4 bg-secondary/50 hover:bg-secondary text-secondary-foreground rounded-xl font-medium border border-border transition-all duration-300 backdrop-blur-md"
                >
                  View Profile
                </Link>
              </>
            ) : (
              <button
                onClick={() => signIn("google")}
                className="group px-8 py-4 bg-foreground text-background rounded-xl font-bold text-lg shadow-2xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
              >
                <Terminal size={20} />
                Start Coding Now
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32">
          {[
            {
              title: "Curated Problems",
              desc: "Hand-picked challenges ranging from easy to hard.",
              icon: <Code2 className="text-primary" />,
            },
            {
              title: "Real-time Judges",
              desc: "Instant feedback on your code submissions.",
              icon: <Terminal className="text-accent" />,
            },
            {
              title: "Global Rankings",
              desc: "Compete with developers around the world.",
              icon: <Trophy className="text-yellow-500" />,
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-card/40 border border-border/50 backdrop-blur-sm hover:bg-card/60 transition-colors duration-300 group"
            >
              <div className="w-12 h-12 rounded-lg bg-background border border-border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                {feature.icon}
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-border/40 bg-background/50 backdrop-blur-xl mt-20">
        <div className="container mx-auto px-6 py-8 flex justify-between items-center text-sm text-muted-foreground">
          <p>© 2024 CodeForge. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Privacy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
