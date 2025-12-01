import { readFileSync, writeFileSync } from 'fs';

const targetVersion = process.argv[2];

let manifest = JSON.parse(readFileSync('manifest.json', 'utf8'));
let packageJson = JSON.parse(readFileSync('package.json', 'utf8'));

manifest.version = targetVersion;
packageJson.version = targetVersion;

writeFileSync('manifest.json', JSON.stringify(manifest, null, '\t'));
writeFileSync('package.json', JSON.stringify(packageJson, null, '\t'));