import { describe, it, expect, vi } from 'vitest';
import { run, parseArgs } from '../../bin/cli.mjs';

vi.mock('inquirer', () => ({
  default: {
    prompt: vi.fn(() => Promise.resolve({
      systemUser: 'ubuntu',
      projectSubDir: 'my-app',
      environment: 'production'
    }))
  }
}));

vi.mock('../../lib/generator.mjs', () => ({
  generatePm2PostDeployLine: vi.fn(() => 'mocked-deploy-line')
}));

vi.mock('../../lib/version.mjs', () => ({
  showVersion: vi.fn((log = console.log) => log('1.2.3'))
}));

describe('cli', () => {
  it('parseArgs parses argv correctly', () => {
    const args = parseArgs(['bin/index.mjs',
      '--systemUser', 'ubuntu',
      '--projectSubDir', 'my-project',
      '--environment', 'production'
    ]);
    expect(args).toEqual({
      "environment": "production",
      "projectSubDir": "my-project"
    });
  });

  it('shows version and exits', async () => {
    const log = vi.fn();
    const exit = vi.fn();
    await run(['node', 'bin/index.mjs', '--version'], exit, log);
    expect(log).toHaveBeenCalledWith('1.2.3');
    expect(exit).toHaveBeenCalledWith(0);
  });

  it('asks questions if not passed in CLI args', async () => {
    const log = vi.fn();
    const exit = vi.fn();
    await run(['node', 'bin/index.mjs'], exit, log);
    expect(log.mock.calls[1][0]).toContain('mocked-deploy-line');
  });

  it('skips prompt when CLI args are passed', async () => {
    const log = vi.fn();
    const exit = vi.fn();
    await run([
      'node', 'bin/index.mjs',
      '--systemUser', 'ubuntu',
      '--projectSubDir', 'my-app',
      '--environment', 'production'
    ], exit, log);
    expect(log.mock.calls[1][0]).toContain('mocked-deploy-line');
  });
});
