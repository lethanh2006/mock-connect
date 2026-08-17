import fse from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, '..');
const dist = path.join(root, 'dist');
const studentDir = path.join(dist, 'student');

// Docker receives the runtime config from a ConfigMap at runtime. Netlify is
// a static host with no such mount, so we bake the same globals in here at
// build time from Netlify's own env vars.
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

const envFilePath = path.join(root, '.env');
const envFileValues = fse.existsSync(envFilePath)
	? parseEnvFile(await fse.readFile(envFilePath, 'utf8'))
	: {};

const appConfig = {};
const appConfigKeys = new Set([
	...Object.keys(envFileValues),
	...Object.keys(process.env).filter((key) => key.startsWith('APP_CONFIG_')),
]);
for (const key of appConfigKeys) {
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

const envJs = envJsLines.join('\n');
await fse.writeFile(path.join(dist, 'env.js'), envJs);
await fse.ensureDir(path.join(dist, 'runtime-config'));
await fse.writeFile(path.join(dist, 'runtime-config', 'env.js'), envJs);

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
