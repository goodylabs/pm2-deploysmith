import { describe, it, expect } from "vitest";
import { generatePm2PostDeployLine } from "../lib/generator.mjs";

describe("generatePm2PostDeployLine", () => {
  it("generates a command with correct base path", () => {
    const cmd = generatePm2PostDeployLine({
      systemUser: "ubuntu",
      projectSubDir: "my-app",
      environment: "production",
    });

    expect(cmd).toContain("/home/ubuntu/my-app/releases");
    expect(cmd).toContain("pm2 reload ecosystem.config.js --env production");
    expect(cmd).toContain("BUILD_TIMESTAMP");
  });

  it("supports --skipSourceNvm", () => {
    const cmd = generatePm2PostDeployLine({
      systemUser: "root",
      projectSubDir: "demo",
      environment: "staging",
      skipSourceNvm: true
    });

    expect(cmd).not.toContain("source ~/.nvm/nvm.sh");
  });

  it("supports --addSourceProfile", () => {
    const cmd = generatePm2PostDeployLine({
      systemUser: "root",
      projectSubDir: "demo",
      environment: "staging",
      addSourceProfile: true
    });

    expect(cmd).toContain("source ~/.profile");
  });
});
