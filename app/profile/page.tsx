"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import { Trophy, Code2, Users, Calendar, Activity } from "lucide-react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background font-body">
        <main className="container mx-auto px-6 py-12">
          <div className="max-w-4xl mx-auto bg-card border border-border/50 rounded-2xl p-8 animate-pulse">
            <div className="flex items-center space-x-6 mb-8">
              <div className="w-20 h-20 bg-muted rounded-full"></div>
              <div>
                <div className="h-6 bg-muted rounded w-32 mb-2"></div>
                <div className="h-4 bg-muted rounded w-48"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-secondary/20 p-6 rounded-lg h-32"
                ></div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background font-body selection:bg-primary selection:text-white">
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
          {/* Profile Header */}
          <div className="bg-card border border-border/50 rounded-2xl p-8 shadow-lg shadow-black/5 relative overflow-hidden backdrop-blur-sm">
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-primary to-accent"></div>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full p-1 bg-linear-to-br from-primary to-accent">
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "Profile"}
                      width={96}
                      height={96}
                      className="rounded-full bg-background object-cover h-full w-full"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-background flex items-center justify-center text-3xl font-bold text-muted-foreground">
                      {session.user.name?.[0] || "U"}
                    </div>
                  )}
                </div>
                <div
                  className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-4 border-card rounded-full"
                  title="Online"
                ></div>
              </div>

              <div className="text-center md:text-left space-y-1">
                <h1 className="text-3xl font-bold font-display text-foreground">
                  {session.user.name}
                </h1>
                <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary/50"></span>
                  {session.user.email}
                </p>
                <div className="flex items-center gap-3 mt-3 justify-center md:justify-start">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                    Pro Member
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Joined{" "}
                    {new Date().toLocaleDateString(undefined, {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              <div className="md:ml-auto flex gap-3">
                <button className="px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium text-sm transition-colors">
                  Edit Profile
                </button>
                <button className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-600 text-white font-medium text-sm transition-colors shadow-lg shadow-primary/20">
                  Share Profile
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                label: "Problems Solved",
                value: "1",
                sub: "Keep pushing!",
                icon: Code2,
                color: "text-blue-500",
                bg: "bg-blue-500/10",
                border: "border-blue-500/20",
              },
              {
                label: "Current Rating",
                value: "1200",
                sub: "Beginner",
                icon: Activity,
                color: "text-green-500",
                bg: "bg-green-500/10",
                border: "border-green-500/20",
              },
              {
                label: "Contests",
                value: "0",
                sub: "Join upcoming",
                icon: Trophy,
                color: "text-purple-500",
                bg: "bg-purple-500/10",
                border: "border-purple-500/20",
              },
              {
                label: "Community Rank",
                value: "#42",
                sub: "Top 10%",
                icon: Users,
                color: "text-orange-500",
                bg: "bg-orange-500/10",
                border: "border-orange-500/20",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className={`bg-card border ${stat.border} p-6 rounded-xl hover:shadow-md transition-all duration-300 group`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                    <stat.icon size={20} />
                  </div>
                  <span className="text-xs font-mono text-muted-foreground bg-secondary/50 px-2 py-1 rounded">
                    +2 this week
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <h3 className="text-2xl font-bold font-display text-foreground group-hover:scale-105 transition-transform origin-left">
                    {stat.value}
                  </h3>
                  <p className="text-xs text-muted-foreground/80">{stat.sub}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-card border border-border/50 rounded-2xl p-6 h-64 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Activity size={48} className="mx-auto mb-4 opacity-20" />
                <p>Activity Graph Placeholder</p>
              </div>
            </div>

            <div className="bg-card border border-border/50 rounded-2xl p-6">
              <h3 className="font-display font-bold text-lg mb-4">
                Recent Submissions
              </h3>
              <div className="space-y-4">
                {[1, 2, 3].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 text-sm p-3 rounded-lg hover:bg-secondary/30 transition-colors"
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${i === 0 ? "bg-green-500" : "bg-red-500"}`}
                    ></div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">Two Sum</p>
                      <p className="text-xs text-muted-foreground">Just now</p>
                    </div>
                    <span
                      className={`text-xs font-mono ${i === 0 ? "text-green-500" : "text-red-500"}`}
                    >
                      {i === 0 ? "AC" : "WA"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
