export const SUBMISSION_QUEUE = "submission_queue";

export const LANGUAGE_EXECUTION = {
  js: {
    file: "main.js",
    run: "node main.js",
    compile: null,
  },
  python: {
    file: "main.py",
    run: "python3 main.py",
    compile: null,
  },
  cpp: {
    file: "main.cpp",
    compile: "g++ main.cpp -O2 -std=c++17 -o main",
    run: "./main",
  },
  java: {
    file: "Main.java",
    compile: "javac Main.java",
    run: "java Main",
  },
};
