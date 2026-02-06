"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TipTapEditor } from "@/components/ui/tiptap-editor";
import axios from "axios";
import { toast } from "sonner";
import { Plus, Trash2, Save, FileCode } from "lucide-react";

interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isSample: boolean;
  order: number;
}

export default function CreateProblemPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timeLimit, setTimeLimit] = useState(2000);
  const [memoryLimit, setMemoryLimit] = useState(256);
  const [testCases, setTestCases] = useState<TestCase[]>([]);

  const addTestCase = () => {
    const usedOrders = testCases.map((tc) => tc.order);
    const nextOrder = Math.max(0, ...usedOrders) + 1;

    const newTestCase: TestCase = {
      id: Date.now().toString(),
      input: "",
      expectedOutput: "",
      isSample: false,
      order: nextOrder,
    };

    setTestCases([...testCases, newTestCase]);
  };

  const removeTestCase = (id: string) => {
    setTestCases(testCases.filter((tc) => tc.id !== id));
  };

  const updateTestCase = (id: string, field: keyof TestCase, value: any) => {
    setTestCases(
      testCases.map((tc) => (tc.id === id ? { ...tc, [field]: value } : tc)),
    );
  };

  const getAvailableOrders = (currentId: string) => {
    const usedOrders = testCases
      .filter((tc) => tc.id !== currentId)
      .map((tc) => tc.order);

    const maxOrder = Math.max(testCases.length, ...usedOrders);
    return Array.from({ length: maxOrder }, (_, i) => i + 1).filter(
      (order) => !usedOrders.includes(order),
    );
  };

  async function createProblem() {
    try {
      const res = await axios.post("/api/problems/create-problem", {
        title,
        description,
        timeLimit,
        memoryLimit,
        testCases,
      });
      console.log(res.data);
      toast.success(res.data.message);
    } catch (error) {
      console.error(error);
      toast.error("Failed to create problem");
    }
  }

  return (
    <div className="min-h-screen bg-background font-body selection:bg-primary selection:text-white pb-20">
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-primary/10 rounded-xl text-primary">
              <FileCode size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-display text-foreground">
                Create Problem
              </h1>
              <p className="text-muted-foreground">
                Design a new challenge for the community.
              </p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl shadow-lg p-8 space-y-8 backdrop-blur-sm animate-fade-in">
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-foreground">
                Problem Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-lg font-medium placeholder:text-muted-foreground/50"
                placeholder="e.g. Two Sum"
              />
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-semibold text-foreground">
                Problem Description
              </label>
              <div className="border border-border rounded-lg overflow-hidden bg-background">
                <TipTapEditor
                  value={description}
                  onChange={setDescription}
                  placeholder="Describe the problem, input format, output format, and constraints..."
                  className="w-full min-h-[300px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-foreground">
                  Time Limit (ms)
                </label>
                <input
                  type="number"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(Number(e.target.value))}
                  min="1"
                  step="1"
                  className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono"
                />
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-foreground">
                  Memory Limit (MB)
                </label>
                <input
                  type="number"
                  value={memoryLimit}
                  onChange={(e) => setMemoryLimit(Number(e.target.value))}
                  min="1"
                  step="1"
                  className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono"
                />
              </div>
            </div>

            <div className="pt-8 border-t border-border">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold font-display text-foreground">
                  Test Cases
                </h3>
                <Button
                  onClick={addTestCase}
                  type="button"
                  variant="outline"
                  className="flex items-center gap-2 hover:bg-primary/10 hover:text-primary hover:border-primary/50"
                >
                  <Plus size={16} /> Add Test Case
                </Button>
              </div>

              <div className="space-y-6">
                {testCases.map((testCase) => (
                  <div
                    key={testCase.id}
                    className="border border-border/60 rounded-xl p-6 bg-secondary/10 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-3">
                        <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded">
                          #{testCase.order}
                        </span>
                        <h4 className="font-semibold text-foreground">
                          Test Case
                        </h4>
                      </div>
                      <Button
                        onClick={() => removeTestCase(testCase.id)}
                        variant="destructive"
                        size="sm"
                        className="h-8 w-8 p-0 rounded-full"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Input
                        </label>
                        <textarea
                          value={testCase.input}
                          onChange={(e) =>
                            updateTestCase(testCase.id, "input", e.target.value)
                          }
                          rows={4}
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono text-sm resize-none"
                          placeholder="Input data..."
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Expected Output
                        </label>
                        <textarea
                          value={testCase.expectedOutput}
                          onChange={(e) =>
                            updateTestCase(
                              testCase.id,
                              "expectedOutput",
                              e.target.value,
                            )
                          }
                          rows={4}
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono text-sm resize-none"
                          placeholder="Expected output..."
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 p-4 bg-background/50 rounded-lg border border-border/50">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`sample-${testCase.id}`}
                          checked={testCase.isSample}
                          onChange={(e) =>
                            updateTestCase(
                              testCase.id,
                              "isSample",
                              e.target.checked,
                            )
                          }
                          className="h-4 w-4 text-primary focus:ring-primary/50 border-border rounded bg-background"
                        />
                        <label
                          htmlFor={`sample-${testCase.id}`}
                          className="ml-2 text-sm font-medium text-foreground"
                        >
                          Use as Sample Case
                        </label>
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-muted-foreground">
                          Order:
                        </label>
                        <select
                          value={testCase.order}
                          onChange={(e) =>
                            updateTestCase(
                              testCase.id,
                              "order",
                              Number(e.target.value),
                            )
                          }
                          className="px-3 py-1 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                        >
                          {getAvailableOrders(testCase.id).map((order) => (
                            <option key={order} value={order}>
                              {order}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}

                {testCases.length === 0 && (
                  <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
                    <p className="text-muted-foreground font-medium">
                      No test cases added yet.
                    </p>
                    <p className="text-sm text-muted-foreground/70 mt-1">
                      Add at least one test case to validate solutions.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-border">
              <Button
                onClick={createProblem}
                size="lg"
                className="px-8 bg-primary hover:bg-primary-600 text-white font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
              >
                <Save size={18} className="mr-2" /> Create Problem
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
