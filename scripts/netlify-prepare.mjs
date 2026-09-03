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

const publicAppConfigKeyPattern = /^APP_CONFIG_(APP_VERSION|BASE_PATH|CO_QUAN_CHU_QUAN|DON_VI_BAN_GIAM_DOC|HIGHLIGHT_COLOR|INIT_[A-Z0-9_]+|IP_ROOT(?:_API|_BY_HOST)?|KEYCLOAK_AUTHORITY|KE_HOACH_NAM_HIGHLIGHT_TUAN|KHOAN_THU_HOC_PHI|NGUON_THU_CO_DINH|PREFIX_OF_KEYCLOAK_CLIENT_ID|PRIMARY_COLOR|SO_TIN_CHI_HOC_KY_(?:MIN|MAX)|TEN_TRUONG(?:_VIET_TAT_TIENG_ANH)?|TIEN_TO_TRUONG|TITLE_[A-Z0-9_]+|URL_[A-Z0-9_]+)$/;
const sensitiveAppConfigKeyPattern = /(^|_)(TOKEN|PASSWORD|SECRET|PRIVATE_KEY|CREDENTIAL|API_KEY|ENCRYPTION_KEY|SIGNING_KEY)(_|$)/;
const isPublicAppConfigKey = (key) =>
	publicAppConfigKeyPattern.test(key) && !sensitiveAppConfigKeyPattern.test(key);

let envFileValues = {};
try {
	envFileValues = parseEnvFile(await fse.readFile(path.join(root, '.env'), 'utf8'));
} catch {
	// Production/static builds are intentionally not dependent on committed .env files.
}

const appConfig = {};
for (const key of new Set([...Object.keys(envFileValues), ...Object.keys(process.env)])) {
	if (!isPublicAppConfigKey(key)) continue;
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
