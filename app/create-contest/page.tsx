"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";
import {
  Plus,
  X,
  Search,
  Trophy,
  Calendar,
  Clock,
  FileText,
  ListOrdered,
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { DifficultyLevel } from "@prisma/client";
import { useSession } from "next-auth/react";

interface Problem {
  id: string;
  title: string;
  difficulty: DifficultyLevel;
}

export default function CreateContestPage() {
  const router = useRouter();
  const session = useSession();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState("");
  const [problemIdInput, setProblemIdInput] = useState("");
  const [addedProblems, setAddedProblems] = useState<Problem[]>([]);

  const checkProblemMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.get(`/api/problems/${id}`);
      return response.data;
    },
    onSuccess: (data: { problem: Problem; message: string }) => {
      if (addedProblems.some((p) => p.id === data.problem.id)) {
        toast.error("Problem already added to contest");
        return;
      }
      setAddedProblems([...addedProblems, data.problem]);
      setProblemIdInput("");
      toast.success("Problem added successfully");
    },
    onError: (error) => {
      console.log(error);
      toast.error("Problem not found or error fetching details");
    },
  });

  const createContestMutation = useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      startTime: string;
      durationInMinutes: number;
      problems: string[];
      userId: null | string;
    }) => {
      if (!session.data?.user?.id) {
        toast.error("Please signin to create contest");
        return;
      }
      data.userId = session.data.user.id;
      const response = await axios.post("/api/contests/create-contest", data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Contest created successfully");
      router.push(`/contests/${data.id}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to create contest");
    },
  });

  const handleAddProblem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problemIdInput.trim()) return;
    checkProblemMutation.mutate(problemIdInput);
  };

  const removeProblem = (id: string) => {
    setAddedProblems(addedProblems.filter((p) => p.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !startTime || !duration) {
      toast.error("Please fill in all fields");
      return;
    }

    if (addedProblems.length === 0) {
      toast.error("Please add at least one problem");
      return;
    }

    createContestMutation.mutate({
      title,
      description,
      startTime: new Date(startTime).toISOString(),
      durationInMinutes: parseInt(duration),
      problems: addedProblems.map((p) => p.id),
      userId: null,
    });
  };

  return (
    <div className="min-h-screen bg-background font-body selection:bg-primary selection:text-white pb-20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-display font-bold mb-2 flex items-center gap-3">
            <Trophy className="text-primary w-8 h-8" />
            Create New Contest
          </h1>
          <p className="text-muted-foreground">
            Set up a competitive programming contest with custom problems and
            rules.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 animate-slide-up">
          <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Contest Details
            </h2>

            <div className="grid gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Contest Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors outline-none"
                  placeholder="e.g. Weekly Contest #42"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors outline-none h-32 resize-none"
                  placeholder="Describe the contest rules, scoring, etc."
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Start Time
                  </label>
                  <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors outline-none"
                    placeholder="e.g. 120"
                    min="1"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <ListOrdered className="w-5 h-5 text-primary" />
              Manage Problems
            </h2>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={problemIdInput}
                    onChange={(e) => setProblemIdInput(e.target.value)}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors outline-none"
                    placeholder="Enter Problem ID to add"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddProblem}
                  disabled={checkProblemMutation.isPending || !problemIdInput}
                  className="px-6 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {checkProblemMutation.isPending ? (
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                  Check & Add
                </button>
              </div>

              {addedProblems.length > 0 ? (
                <div className="border border-border rounded-lg overflow-hidden">
                  <div className="bg-secondary/30 px-4 py-3 border-b border-border flex items-center justify-between text-sm font-medium text-muted-foreground">
                    <span>Problem</span>
                    <span>Order</span>
                  </div>
                  <div className="divide-y divide-border">
                    {addedProblems.map((problem, index) => (
                      <div
                        key={problem.id}
                        className="px-4 py-3 flex items-center justify-between hover:bg-secondary/10 transition-colors group"
                      >
                        <div className="flex items-center gap-4">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-secondary text-xs font-mono">
                            {String.fromCharCode(65 + index)}
                          </span>
                          <div>
                            <p className="font-medium">{problem.title}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                              <span
                                className={`px-1.5 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider
                                  ${
                                    problem.difficulty === "EASY"
                                      ? "bg-green-500/10 text-green-500"
                                      : problem.difficulty === "MEDIUM"
                                        ? "bg-yellow-500/10 text-yellow-500"
                                        : "bg-red-500/10 text-red-500"
                                  }`}
                              >
                                {problem.difficulty}
                              </span>
                              <span className="font-mono">{problem.id}</span>
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeProblem(problem.id)}
                          className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-border rounded-lg text-muted-foreground">
                  No problems added yet. Search by ID to add problems to the
                  contest.
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={createContestMutation.isPending}
              className="px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createContestMutation.isPending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Create Contest
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
