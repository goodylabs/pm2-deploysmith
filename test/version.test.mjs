import { describe, it, expect, vi } from 'vitest';
import { showVersion } from '../lib/version.mjs';

vi.mock('node:fs/promises', async () => {
  const actual = await vi.importActual('node:fs/promises');
  return {
    ...actual,
    readFile: vi.fn(() => Promise.resolve(JSON.stringify({ version: '99.9.9' })))
  };
});

describe('showVersion', () => {
  it('prints version from package.json', async () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});

    await showVersion();

    expect(spy).toHaveBeenCalledWith('99.9.9');

    spy.mockRestore();
  });
});
