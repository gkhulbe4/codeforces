import { TestCase } from "@prisma/client";
import { LANGUAGE_EXECUTION } from "../constants";
import { changeVerdict } from "./changeVerdict";
import { Sandbox } from "e2b";
import { normalize } from "./normalize";

export async function executeSubmission(
  submissionId: string,
  code: string,
  languageKey: string,
  testCases: TestCase[],
  timeLimitMs: number,
  memoryLimitMb: number,
) {
  const language =
    LANGUAGE_EXECUTION[languageKey as keyof typeof LANGUAGE_EXECUTION];
  if (!language) {
    await changeVerdict(submissionId, "RE", "Language not supported");
    console.log("Language not supported");
    return;
  }

  const sandbox = await Sandbox.create("base");

  try {
    await sandbox.files.write(language.file, code);
    if (language.compile) {
      const compile = await sandbox.commands.run(language.compile);
      if (compile.exitCode !== 0) {
        await changeVerdict(submissionId, "CE", compile.stderr);
        console.log("Compilation error", compile.stderr);
        return;
      }
    }

    let t = 1;

    for (const tc of testCases) {
      await sandbox.files.write("input.txt", tc.input);
      const result = await sandbox.commands.run(`${language.run} < input.txt`, {
        timeoutMs: timeLimitMs,
      });
      console.log(`TEST CASE ${t} result`, result);
      t++;

      if (result.exitCode !== 0) {
        await changeVerdict(submissionId, "RE", result.stderr);
        console.log("Runtime error", result.stderr);
        return;
      }

      if (normalize(result.stdout) !== normalize(tc.expectedOutput)) {
        await changeVerdict(submissionId, "WA", result.stderr);
        console.log("Wrong answer", result.stderr);
        return;
      }
    }

    await changeVerdict(submissionId, "AC");
  } catch (error: any) {
    if (error.message.includes("timeout")) {
      await changeVerdict(submissionId, "TLE", error.message);
      console.log("Time limit exceeded", error.message);
    } else {
      await changeVerdict(submissionId, "RE", error.message);
      console.log("Runtime error", error.message);
    }
  } finally {
    await sandbox.kill();
  }
}
