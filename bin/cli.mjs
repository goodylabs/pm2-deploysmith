import inquirer from "inquirer";
import { generatePm2PostDeployLine } from "../lib/generator.mjs";
import { showVersion } from "../lib/version.mjs";

export function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    if (argv[i].startsWith("--")) {
      const key = argv[i].replace(/^--/, "");
      const value = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : true;
      args[key] = value;
      if (value !== true) i++;
    }
  }
  return args;
}

export async function run(argv = process.argv, exit = process.exit, log = console.log) {
  const cliArgs = parseArgs(argv);

  if (argv.includes("--version")) {
    await showVersion(log);
    exit(0);
    return;
  }

  const questions = [];
  if (!cliArgs.systemUser) {
    questions.push({
      type: "input",
      name: "systemUser",
      message: "Enter system user [systemUser] (eg. ubuntu):",
    });
  }
  if (!cliArgs.projectSubDir) {
    questions.push({
      type: "input",
      name: "projectSubDir",
      message: "Enter project sub-directory [projectSubDir] (eg. my-project):",
    });
  }
  if (!cliArgs.environment && !cliArgs.env) {
    questions.push({
      type: "input",
      name: "environment",
      message: "Enter environment name [environment] (eg. production):",
    });
  }

  const answers = await inquirer.prompt(questions);
  const mergedOptions = { ...answers, ...cliArgs };
  const line = generatePm2PostDeployLine(mergedOptions);

  log("\n🔧 Copy the following line to your post-deploy section in ecosystem.config.js:\n");
  log(`"${line}"\n`);
}