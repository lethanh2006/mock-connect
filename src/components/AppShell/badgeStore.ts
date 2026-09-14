import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

export type BadgeValue = ReactNode | number | string | null | undefined;
type BadgeListener = (badges: Record<string, BadgeValue>) => void;

// In-memory store cho dynamic badges theo path
let currentBadges: Record<string, BadgeValue> = {};
const listeners = new Set<BadgeListener>();

function notify() {
	listeners.forEach((listener) => listener(currentBadges));
}

/**
 * Cập nhật badge cho một path cụ thể.
 * @param path Đường dẫn của menu item, vd: '/dashboard', '/danh-muc/chuc-vu'
 * @param badge Giá trị badge (number, string, ReactNode). Truyền 0, null hoặc undefined để ẩn badge.
 *
 * @example
 * setMenuBadge('/dashboard', 12);
 * setMenuBadge('/danh-muc/chuc-vu', 'New');
 * setMenuBadge('/dashboard', 0); // Ẩn badge
 */
export function setMenuBadge(path: string, badge: BadgeValue): void {
	if (!path) return;
	const val = badge === 0 || badge === null || badge === undefined ? null : badge;
	currentBadges = {
		...currentBadges,
		[path]: val,
	};
	notify();
}

/**
 * Cập nhật hàng loạt badge cho nhiều path cùng lúc (tiện lợi khi gọi API thống kê).
 * @param badges Object map giữa route path và giá trị badge
 *
 * @example
 * setMenuBadges({
 *   '/dashboard': 5,
 *   '/danh-muc/chuc-vu': 2,
 *   '/thong-bao': 0, // Ẩn badge
 * });
 */
export function setMenuBadges(badges: Record<string, BadgeValue>): void {
	if (!badges) return;
	const next = { ...currentBadges };
	for (const [path, badge] of Object.entries(badges)) {
		next[path] = badge === 0 || badge === null || badge === undefined ? null : badge;
	}
	currentBadges = next;
	notify();
}

/**
 * Lấy giá trị dynamic badge hiện tại của một path.
 */
export function getMenuBadge(path: string): BadgeValue {
	return currentBadges[path];
}

/**
 * Xóa toàn bộ dynamic badges đã set (quay về badge tĩnh khai trong config/routes.ts).
 */
export function clearMenuBadges(): void {
	currentBadges = {};
	notify();
}

/**
 * React Hook lắng nghe toàn bộ dynamic badges trong AppShell.
 */
export function useMenuBadges(): Record<string, BadgeValue> {
	const [badges, setBadges] = useState<Record<string, BadgeValue>>(currentBadges);

	useEffect(() => {
		listeners.add(setBadges);
		return () => {
			listeners.delete(setBadges);
		};
	}, []);

	return badges;
}

/**
 * React Hook tiện lợi để đọc và cập nhật badge cho một path cụ thể ngay trong component.
 * @example
 * const [badge, setBadge] = useMenuBadge('/dashboard');
 * // Gọi setBadge(5) để cập nhật
 */
export function useMenuBadge(path: string): [BadgeValue, (val: BadgeValue) => void] {
	const badges = useMenuBadges();
	const badge = badges[path];
	const setBadge = (val: BadgeValue) => setMenuBadge(path, val);
	return [badge, setBadge];
}
