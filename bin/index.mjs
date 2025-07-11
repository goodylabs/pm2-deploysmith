#!/usr/bin/env node

import inquirer from "inquirer";
import { generatePm2PostDeployLine } from "../lib/generator.mjs";

const answers = await inquirer.prompt([
  {
    type: "input",
    name: "systemUser",
    message: "Enter system user (eg. ubuntu):",
  },
  {
    type: "input",
    name: "projectSubDir",
    message: "Enter project sub-directory (eg. my-project):",
  },
  {
    type: "input",
    name: "environment",
    message: "Enter environment name (eg. production):",
  },
]);

const line = generatePm2PostDeployLine(answers);
console.log("\n🔧 Copy the following line to your post-deploy section in ecosystem.config.js:\n");
console.log(`"${line}"\n`);
