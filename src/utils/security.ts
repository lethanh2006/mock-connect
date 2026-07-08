/**
 * Kiểm tra URL có an toàn để dùng trong href / window.open hay không.
 * Chặn javascript:, data:, vbscript:, file:, blob: và các protocol không hợp lệ.
 */
const BLOCKED_PROTOCOL_PATTERN = /^(javascript|data|vbscript|file|blob):/i;

export const isSafeUrl = (url: string | undefined | null): boolean => {
	if (!url || typeof url !== 'string') return false;

	const trimmed = url.trim();
	if (!trimmed) return false;
	if (BLOCKED_PROTOCOL_PATTERN.test(trimmed)) return false;

	// Đường dẫn nội bộ: /path, #anchor
	if (trimmed.startsWith('/') && !trimmed.startsWith('//')) return true;
	if (trimmed.startsWith('#')) return true;

	// mailto / tel
	if (/^(mailto|tel):/i.test(trimmed)) return true;

	// http(s) tuyệt đối
	if (/^https?:\/\//i.test(trimmed)) {
		try {
			const { protocol } = new URL(trimmed);
			return protocol === 'http:' || protocol === 'https:';
		} catch {
			return false;
		}
	}

	// Protocol-relative: //domain.com
	if (trimmed.startsWith('//')) {
		try {
			const { protocol } = new URL(`https:${trimmed}`);
			return protocol === 'https:';
		} catch {
			return false;
		}
	}

	// Đường dẫn tương đối không có protocol (vd: uploads/file.pdf)
	if (!/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) return true;

	return false;
};

/**
 * Trả về URL an toàn để gán vào href, hoặc undefined nếu không hợp lệ.
 */
export function getSafeHref(value: unknown): string | undefined {
	if (typeof value !== 'string') {
		return undefined;
	}

	const href = value.trim();

	if (!isSafeUrl(href)) {
		return undefined;
	}

	return href;
}

/**
 * Mở URL an toàn trong tab mới. Trả về false nếu URL không hợp lệ.
 */
export function openSafeUrl(url: unknown): boolean {
	const href = getSafeHref(url);

	if (!href) {
		return false;
	}

	window.open(href, '_blank', 'noopener,noreferrer');

	return true;
}
