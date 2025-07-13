import { execa } from 'execa'
import { describe, it, expect } from 'vitest'

describe ('e2e test', () => {

  describe ('without an interactive input', () => {

    it('generates a deployment line', async () => {
      const { stdout } = await execa('node', [
        'bin/index.mjs',
        '--systemUser', 'ubuntu',
        '--projectSubDir', 'my-project',
        '--environment', 'production'
      ]);

      expect(stdout).toContain('source ~/.nvm/nvm.sh && BUILD_TIMESTAMP=$(date +%Y%m%d%H%M) && mkdir -p /home/ubuntu/my-project/releases/build-$BUILD_TIMESTAMP && cp -a /home/ubuntu/my-project/source/. /home/ubuntu/my-project/releases/build-$BUILD_TIMESTAMP/ && cd /home/ubuntu/my-project/releases/build-$BUILD_TIMESTAMP/ && nvm install && nvm use && npm install -g pnpm && npm install -g pm2 && pnpm install && pnpm build:production && rm /home/ubuntu/my-project/current && ln -sfn /home/ubuntu/my-project/releases/build-$BUILD_TIMESTAMP /home/ubuntu/my-project/current && cd /home/ubuntu/my-project/current && pm2 reload ecosystem.config.js --env production --cwd /home/ubuntu/my-project/current && ls -dt /home/ubuntu/my-project/releases/* | tail -n +4 | xargs rm -rf')
    });

  });

});