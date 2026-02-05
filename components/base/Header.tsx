"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Terminal, LogOut, User, Plus, LayoutGrid } from "lucide-react";
import Image from "next/image";

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="border-b border-border/40 backdrop-blur-xl sticky top-0 z-50 bg-background/80 supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded bg-linear-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg font-display transition-transform group-hover:scale-105 shadow-lg shadow-primary/20">
            C
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-foreground group-hover:text-primary transition-colors">
            CodeForge
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          {status === "loading" ? (
            <div className="h-9 w-24 bg-muted animate-pulse rounded-lg"></div>
          ) : !session ? (
            <Button
              onClick={() => signIn("google")}
              className="bg-foreground text-background hover:bg-foreground/90 font-medium transition-all shadow-md hover:shadow-lg"
            >
              <Terminal size={16} className="mr-2" />
              Sign In
            </Button>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href="/problems"
                className="hidden md:flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-secondary/50"
              >
                <LayoutGrid size={18} />
                Problems
              </Link>

              <Link href="/create-problem" className="hidden md:block">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 border-primary/20 hover:border-primary/50 text-foreground hover:bg-primary/5"
                >
                  <Plus size={16} className="text-primary" />
                  <span className="hidden sm:inline">Create</span>
                </Button>
              </Link>

              <div className="h-6 w-px bg-border/60 mx-1"></div>

              <div className="flex items-center gap-3 pl-1">
                <Link href="/profile" className="group">
                  <div className="w-9 h-9 rounded-full bg-linear-to-r from-primary to-accent p-[2px] transition-transform group-hover:scale-105">
                    {session.user?.image ? (
                      <div className="rounded-full overflow-hidden w-full h-full bg-background">
                        <Image
                          src={session.user.image}
                          alt="Profile"
                          width={36}
                          height={36}
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full rounded-full bg-background flex items-center justify-center text-xs font-bold text-muted-foreground">
                        {session.user?.name?.[0] || <User size={16} />}
                      </div>
                    )}
                  </div>
                </Link>

                <Button
                  onClick={() => signOut()}
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full w-8 h-8"
                  title="Sign Out"
                >
                  <LogOut size={16} />
                </Button>
              </div>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
