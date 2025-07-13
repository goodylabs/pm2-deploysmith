import { describe, it, expect } from "vitest";
import { generatePm2PostDeployLine } from "../lib/generator.mjs";

describe("generatePm2PostDeployLine", () => {

  describe("default params", () => {

    describe("for production", () => {

      const expectedEnvironment = "production";

      it("generates a command with correct base path", () => {
        const cmd = generatePm2PostDeployLine({
          systemUser: "ubuntu",
          projectSubDir: "my-app",
          environment: expectedEnvironment,
        });

        expect(cmd).toContain("/home/ubuntu/my-app/releases");
        expect(cmd).toContain(`pm2 reload ecosystem.config.js --env ${expectedEnvironment} --cwd `);
        expect(cmd).toContain("BUILD_TIMESTAMP");
        expect(cmd).toContain(`&& pnpm build:${expectedEnvironment} `);

        expect(cmd).toContain("&& mkdir -p ");
        expect(cmd).toContain("/releases/build-$BUILD_TIMESTAMP/ ");

        expect(cmd).toContain("&& cp -a ");
        expect(cmd).toContain("&& nvm install ");
        expect(cmd).toContain("&& nvm use ");
        expect(cmd).toContain("&& npm install -g pnpm ");
        expect(cmd).toContain("&& npm install -g pm2");
        expect(cmd).toContain("&& pnpm install ");
      });

    });

    describe("for staging", () => {

      const expectedEnvironment = "staging";

      it("generates a command with correct base path", () => {
        const cmd = generatePm2PostDeployLine({
          systemUser: "ubuntu",
          projectSubDir: "my-app",
          environment: expectedEnvironment,
        });

        expect(cmd).toContain("/home/ubuntu/my-app/releases");
        expect(cmd).toContain(`pm2 reload ecosystem.config.js --env ${expectedEnvironment} --cwd `);
        expect(cmd).toContain("BUILD_TIMESTAMP");

        expect(cmd).toContain(`&& pnpm build:${expectedEnvironment} `);
      });
    });

  });

  describe("with env option - same as environment option", () => {

    it("generates a command with correct environment", () => {
      const cmd = generatePm2PostDeployLine({
        systemUser: "ubuntu",
        env: "production",
      });

      expect(cmd).toContain(`pm2 reload ecosystem.config.js --env production`);
    });
  });

  describe("without projectSubDir", () => {

    it("generates a command with correct base path without projectSubDir", () => {
      const cmd = generatePm2PostDeployLine({
        systemUser: "ubuntu",
        environment: "production",
      });

      expect(cmd).toContain("/home/ubuntu/releases");
    });
  });

  describe("with skipSourceNvm switch", () => {

    it("supports --skipSourceNvm", () => {
      const cmd = generatePm2PostDeployLine({
        systemUser: "root",
        projectSubDir: "demo",
        environment: "staging",
        skipSourceNvm: true
      });

      expect(cmd).not.toContain("source ~/.nvm/nvm.sh");
    });

    it("contains sourceNvm by default", () => {
      const cmd = generatePm2PostDeployLine({
        systemUser: "root",
        projectSubDir: "demo",
        environment: "staging"
      });

      expect(cmd).toContain("source ~/.nvm/nvm.sh");
    });
  });

  describe("with addSourceProfile switch", () => {

    it("supports --addSourceProfile", () => {
      const cmd = generatePm2PostDeployLine({
        systemUser: "root",
        projectSubDir: "demo",
        environment: "staging",
        addSourceProfile: true
      });

      expect(cmd).toContain("source ~/.profile");
    });

    it("does not contain SourceProfile by default", () => {
      const cmd = generatePm2PostDeployLine({
        systemUser: "root",
        projectSubDir: "demo",
        environment: "staging"
      });

      expect(cmd).not.toContain("source ~/.profile");
    });
  });

  describe("with numOfKeptReleases switch", () => {

    it("supports --numOfKeptReleases", () => {
      const cmd = generatePm2PostDeployLine({
        systemUser: "root",
        projectSubDir: "demo",
        environment: "staging",
        numOfKeptReleases: 8
      });

      expect(cmd).toContain("tail -n +10 | xargs rm -rf");
    });

    it("does not contain numOfKeptReleases by default - uses a default value", () => {
      const cmd = generatePm2PostDeployLine({
        systemUser: "root",
        projectSubDir: "demo",
        environment: "staging"
      });

      expect(cmd).toContain("tail -n +4 | xargs rm -rf");
    });
  });

});
