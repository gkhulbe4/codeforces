"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Terminal,
  LogOut,
  User,
  Plus,
  LayoutGrid,
  Trophy,
  FileText,
  Award,
} from "lucide-react";
import Image from "next/image";
import { ModeToggle } from "@/components/base/ModeToggle";

export default function Header() {
  const { data: session, status } = useSession();
  const router = useRouter();

  return (
    <header className="border-b border-border/40 backdrop-blur-xl sticky top-0 z-50 bg-background/80 supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-primary text-primary-foreground flex items-center justify-center font-display font-bold">
            C
          </div>
          <span className="font-display font-bold text-lg">CodeForge</span>
        </Link>

        <div className="flex items-center gap-6">
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
                  className="hidden md:flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-secondary/10"
                >
                  <LayoutGrid size={18} />
                  Problems
                </Link>

                <Link
                  href="/contests"
                  className="hidden md:flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-secondary/10"
                >
                  <Trophy size={18} />
                  Contests
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 border-primary/20 hover:border-primary/50 text-foreground hover:text-foreground hover:bg-primary/5"
                    >
                      <Plus size={16} className="text-primary" />
                      <span className="hidden sm:inline">Create</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                      onClick={() => router.push("/create-problem")}
                      className="cursor-pointer"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      <span>Create Problem</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => router.push("/create-contest")}
                      className="cursor-pointer"
                    >
                      <Award className="mr-2 h-4 w-4" />
                      <span>Create Contest</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="h-6 w-px bg-border/60 mx-1"></div>

                <div className="flex items-center gap-3 pl-1">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="group focus:outline-none">
                        <div className="w-9 h-9 rounded-full bg-primary p-[2px] transition-transform group-hover:scale-105">
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
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem
                        onClick={() => router.push("/profile")}
                        className="cursor-pointer"
                      >
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => signOut()}
                        className="cursor-pointer text-destructive focus:text-destructive"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Logout</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            )}
          </nav>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
