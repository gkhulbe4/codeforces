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
  memoryLimitMb: number | undefined,
  prisma: any,
) {
  const language =
    LANGUAGE_EXECUTION[languageKey as keyof typeof LANGUAGE_EXECUTION];
  if (!language) {
    await changeVerdict(submissionId, "RE", "Language not supported", prisma);
    return;
  }
  console.log("Language selected ", language);

  let sandbox;
  try {
    sandbox = await Sandbox.create("base");
    await sandbox.files.write(language.file, code);

    if (language.compile) {
      console.log("=== COMPILATION STARTED ===");
      console.log("Compile command:", language.compile);

      try {
        const compile = await sandbox.commands.run(language.compile);
        // console.log("Stdout:", compile.stdout);
        // console.log("Stderr:", compile.stderr);
        // console.log("ExitCode:", compile.exitCode);

        if (compile.exitCode !== 0) {
          console.log("COMPILATION FAILED");
          await changeVerdict(submissionId, "CE", compile.stderr, prisma);
          await sandbox.kill();
          return;
        }
        console.log("COMPILATION SUCCESS");
      } catch (compileError: any) {
        console.error("COMPILATION ERROR", compileError.message);
        await changeVerdict(submissionId, "CE", compileError.message, prisma);
        await sandbox.kill();
        return;
      }
    }

    console.log("Checking on test cases");
    for (const tc of testCases) {
      const timeoutSeconds = Math.ceil(timeLimitMs / 1000);

      await sandbox.files.write("input.txt", tc.input);

      const cmd = `timeout ${timeoutSeconds}s ${language.run} < input.txt`;

      const result = await sandbox.commands.run(cmd);

      if (result.exitCode === 124) {
        console.log("TLE", result.stderr);
        await changeVerdict(submissionId, "TLE", undefined, prisma);
        await sandbox.kill();
        return;
      }

      if (result.exitCode !== 0) {
        console.log("RE", result.stderr);
        await changeVerdict(submissionId, "RE", result.stderr, prisma);
        await sandbox.kill();
        return;
      }

      if (normalize(result.stdout) !== normalize(tc.expectedOutput)) {
        console.log("WA");
        await changeVerdict(submissionId, "WA", undefined, prisma);
        await sandbox.kill();
        return;
      }
    }

    console.log("All test cases passed!");
    await changeVerdict(submissionId, "AC", undefined, prisma);
  } catch (error: any) {
    console.error("Error: ", error.message);

    if (error.message.includes("timeout")) {
      console.log("TLE", error.message);
      await changeVerdict(submissionId, "TLE", undefined, prisma);
    } else {
      console.log("RE", error.message);
      await changeVerdict(submissionId, "RE", error.message, prisma);
    }
  } finally {
    if (sandbox) {
      await sandbox.kill();
    }
  }
}
