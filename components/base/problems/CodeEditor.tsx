"use client";

import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { Play, Code2, ChevronDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import axios from "axios";
import { STATUS } from "@prisma/client";
import { useSearchParams } from "next/navigation";

interface Language {
  id: number;
  key: string;
  name: string;
  monacoId: string;
}

interface CodeEditorProps {
  languages: Language[];
  problemId: string;
}

export function CodeEditor({ languages, problemId }: CodeEditorProps) {
  const { theme } = useTheme();
  const session = useSession();
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(
    languages[0] || null,
  );
  const [code, setCode] = useState("");
  const [mounted, setMounted] = useState(false);
  const [loader, setLoader] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [status, setStatus] = useState<STATUS | null>(null);
  const [verdict, setVerdict] = useState<string | null>(null);
  const [stderr, setStderr] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const contestId = searchParams.get("contestId");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = languages.find((l) => l.key === e.target.value);
    if (lang) setSelectedLanguage(lang);
  };

  const handleSubmit = async () => {
    try {
      if (!session.data?.user?.id) {
        toast.error("You must be logged in to submit a solution.");
        return;
      }
      if (!code) {
        toast.error("You must enter a solution.");
        return;
      }
      if (!selectedLanguage) {
        toast.error("You must select a language.");
        return;
      }
      setLoader(true);
      setShowResult(false);
      setVerdict(null);
      setStderr(null);

      const submission = await axios.post("/api/problems/submit", {
        userId: session.data?.user?.id,
        code,
        languageId: selectedLanguage.id,
        problemId,
        contestId: contestId || null,
      });

      const interval = setInterval(async () => {
        try {
          const res = await axios.get(
            `/api/problems/submit/check/${submission.data.submission.id}`,
          );
          const currentSubmission = res.data.submission;
          if (!currentSubmission) return;

          setStatus(currentSubmission.status);

          if (currentSubmission.status === STATUS.DONE) {
            clearInterval(interval);
            setLoader(false);
            setVerdict(currentSubmission.verdict);
            setStderr(currentSubmission.stderr);
            setShowResult(true);
            console.log(currentSubmission);
          }
        } catch (error) {
          console.log(error);
          clearInterval(interval);
          setLoader(false);
        }
      }, 1000);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
      setLoader(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-card border border-border rounded-xl shadow-lg shadow-black/5 overflow-hidden flex flex-col h-[600px]">
        <div className="p-4 border-b border-border bg-secondary/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 size={18} className="text-primary" />
            <h3 className="font-display font-bold text-sm uppercase tracking-wider">
              Editor
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={selectedLanguage?.key}
                onChange={handleLanguageChange}
                className="appearance-none bg-background border border-border px-3 py-1.5 pr-8 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer hover:bg-secondary/50 transition-all"
              >
                {languages.map((lang) => (
                  <option key={lang.key} value={lang.key}>
                    {lang.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 relative">
          <Editor
            height="100%"
            language={selectedLanguage?.monacoId || "javascript"}
            theme={theme === "dark" ? "vs-dark" : "light"}
            value={code}
            onChange={(value) => setCode(value || "")}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              padding: { top: 16, bottom: 16 },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              fontFamily: "var(--font-jetbrains-mono)",
              inlineSuggest: { enabled: true },
            }}
          />
        </div>

        <div className="p-4 border-t border-border bg-secondary/10">
          <Button
            onClick={handleSubmit}
            disabled={loader}
            className="w-full gap-2 transition-all active:scale-[0.98] font-semibold"
          >
            {loader ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Play size={16} fill="currentColor" />
            )}
            {loader ? "" : "Submit"}
          </Button>
        </div>
      </div>

      {showResult && (
        <div
          className={`p-6 rounded-xl border animate-in fade-in slide-in-from-top-2 duration-300 ${
            verdict === "AC"
              ? "bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400"
              : "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-lg flex items-center gap-2">
              {verdict === "AC" ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Code Accepted
                </>
              ) : (
                <>
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  Execution Failed
                </>
              )}
            </h4>
          </div>
          {stderr && (
            <div className="mt-3 p-3 bg-black/5 rounded-lg border border-current/10 font-mono text-xs overflow-x-auto whitespace-pre-wrap">
              {stderr}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
