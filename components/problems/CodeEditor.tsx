"use client";

import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { Play, Code2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(
    languages[0] || null,
  );
  const [code, setCode] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = languages.find((l) => l.key === e.target.value);
    if (lang) setSelectedLanguage(lang);
  };

  const handleSubmit = async () => {
    console.log("Submitting code:", code, "Language:", selectedLanguage?.key);
  };

  return (
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
        <Button onClick={handleSubmit} className="w-full gap-2">
          <Play size={16} fill="currentColor" />
          Submit Solution
        </Button>
      </div>
    </div>
  );
}
