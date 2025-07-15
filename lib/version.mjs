import path from "node:path";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

export async function showVersion() {

  const __dirname = path.dirname(fileURLToPath(import.meta.url));

  const pkgPath = path.join(__dirname, '..', 'package.json');
  const pkgJson = JSON.parse(await readFile(pkgPath, 'utf8'));
  console.log(`${pkgJson.version}`);
}