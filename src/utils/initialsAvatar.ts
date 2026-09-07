// Fallback avatar dùng khi user không có ảnh đại diện từ SSO (claim `picture` rỗng).
// AccountMenuTrigger của @vinuni/ui không tự vẽ fallback khi avatarSrc rỗng, nên
// ta phải tự sinh ảnh (data URI SVG) truyền vào avatarSrc.

const DECOR_COLORS = [
	'#e55b62', // red
	'#ff981b', // orange
	'#ffd93f', // yellow
	'#7ecd8f', // green
	'#68d5d5', // teal
	'#4dacef', // blue
	'#5370e6', // indigo
	'#897aea', // purple
	'#e279f4', // pink
];

function hashString(value: string) {
	let hash = 0;
	for (let i = 0; i < value.length; i++) {
		hash = (hash << 5) - hash + value.charCodeAt(i);
		hash |= 0;
	}
	return Math.abs(hash);
}

function getInitials(name: string) {
	const words = name.trim().split(/\s+/).filter(Boolean);
	if (!words.length) return '?';
	if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
	return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

export function generateInitialsAvatar(name: string): string {
	const initials = getInitials(name);
	const color = DECOR_COLORS[hashString(name) % DECOR_COLORS.length];
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">
		<rect width="96" height="96" rx="48" fill="${color}" />
		<text x="50%" y="50%" dy=".08em" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-size="36" font-weight="600" fill="#fff">${initials}</text>
	</svg>`;
	return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
}
