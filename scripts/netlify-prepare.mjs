import fse from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, '..');
const dist = path.join(root, 'dist');
const studentDir = path.join(dist, 'student');

// Docker receives runtime APP_CONFIG_* values from the Kubernetes ConfigMap.
// Netlify is a static host, so it generates the same runtime-config/env.js file
// from Netlify's APP_CONFIG_* variables when the site is built.
function parseEnvFile(content) {
	const result = {};
	for (const line of content.split('\n')) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith('#')) continue;
		const eq = trimmed.indexOf('=');
		if (eq === -1) continue;
		const key = trimmed.slice(0, eq).trim();
		let value = trimmed.slice(eq + 1).trim();
		if (
			(value.startsWith('"') && value.endsWith('"')) ||
			(value.startsWith("'") && value.endsWith("'"))
		) {
			value = value.slice(1, -1);
		}
		result[key] = value;
	}
	return result;
}

let envFileValues = {};
try {
	envFileValues = parseEnvFile(await fse.readFile(path.join(root, '.env'), 'utf8'));
} catch {
	// Production/static builds are intentionally not dependent on committed .env files.
}

const appConfig = {};
for (const key of new Set([...Object.keys(envFileValues), ...Object.keys(process.env)])) {
	if (!key.startsWith('APP_CONFIG_')) continue;
	appConfig[key] = process.env[key] ?? envFileValues[key] ?? '';
}

const envJsLines = [
	"window.__APP_CONFIG__ = window.__APP_CONFIG__ || {};",
	...Object.entries(appConfig).flatMap(([key, value]) => [
		`window.__APP_CONFIG__[${JSON.stringify(key)}]=${JSON.stringify(value)};`,
		`window.${key}=window.__APP_CONFIG__[${JSON.stringify(key)}];`,
	]),
	'',
];

await fse.ensureDir(path.join(dist, 'runtime-config'));
await fse.writeFile(path.join(dist, 'runtime-config/env.js'), envJsLines.join('\n'));

await fse.remove(studentDir);
await fse.ensureDir(studentDir);

const entries = await fse.readdir(dist);
for (const entry of entries) {
	if (entry === 'student') continue;
	await fse.copy(path.join(dist, entry), path.join(studentDir, entry));
}

await fse.writeFile(
	path.join(dist, '_redirects'),
	['/ /student/ 301', '/student/* /student/index.html 200', ''].join('\n'),
);
