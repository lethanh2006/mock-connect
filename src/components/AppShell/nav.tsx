import { IconFolder, IconRoofedHouse } from '@vinuni/ui';
import type { ComponentType, ReactNode } from 'react';
import routes from '../../../config/routes';

export type NavNode = {
	path: string;
	name: string;
	localeId: string;
	hideInMenu?: boolean;
	icon: ReactNode;
	children?: NavNode[];
};

export type NavSection = {
	id: string;
	localeId: string;
	items: NavNode[];
};

/** Ánh xạ `icon` khai trong config/routes.ts (chuỗi antd-icon cũ) sang icon của @vinuni/ui. */
const ICON_MAP: Record<string, ComponentType> = {
	HomeOutlined: IconRoofedHouse,
	copy: IconFolder,
};

const DEFAULT_ICON: ComponentType = IconFolder;

/** Route đánh dấu ranh giới section trong routes.ts, vd `{ name: 'OtherGroup', path: '/__group__/other', disabled: true }`. */
const GROUP_MARKER_PREFIX = '/__group__/';

function isGroupMarker(route: any): boolean {
	return !!route?.disabled && typeof route.path === 'string' && route.path.startsWith(GROUP_MARKER_PREFIX);
}

function joinPath(parentPath: string, childPath: string) {
	if (childPath.startsWith('/')) return childPath;
	const cleaned = childPath.replace(/^\.?\/*/, '');
	return `${parentPath.replace(/\/$/, '')}/${cleaned}`;
}

/** Duyệt toàn bộ route có tên & không `layout: false` — kể cả `hideInMenu` (dành cho tra tiêu đề trang). */
function buildNode(route: any, parentPath: string, localeChain: string[]): NavNode | null {
	if (!route?.name || route.layout === false) return null;

	const path = route.path ? joinPath(parentPath, route.path) : parentPath;
	const chain = [...localeChain, route.name];
	const children = (route.routes ?? [])
		.map((child: any) => buildNode(child, path, chain))
		.filter((child: NavNode | null): child is NavNode => !!child);

	const Icon = ICON_MAP[route.icon] ?? DEFAULT_ICON;

	return {
		path,
		name: route.name,
		localeId: `menu.${chain.join('.')}`,
		hideInMenu: !!route.hideInMenu,
		icon: <Icon />,
		children: children.length ? children : undefined,
	};
}

function dropHidden(nodes: NavNode[]): NavNode[] {
	return nodes
		.filter((node) => !node.hideInMenu)
		.map((node) => (node.children ? { ...node, children: dropHidden(node.children) } : node));
}

/**
 * Cây menu cho Sidebar, nhóm theo section — mỗi section mở đầu bằng một route
 * đánh dấu (`disabled: true`, path `/__group__/...`) trong config/routes.ts.
 * Item ở gốc mỗi section có `children` sẽ hiển thị dạng accordion (như PTIT),
 * còn nhãn section (vd "DASHBOARD & QUẢN TRỊ", "KHÁC") luôn hiển thị, không thu gọn.
 */
export function getNavSections(): NavSection[] {
	const sections: NavSection[] = [];
	let current: NavSection | null = null;

	for (const route of routes as any[]) {
		if (isGroupMarker(route)) {
			current = { id: route.name, localeId: `menu.${route.name}`, items: [] };
			sections.push(current);
			continue;
		}

		const node = buildNode(route, '', []);
		if (!node) continue;

		if (!current) {
			current = { id: '__default__', localeId: '', items: [] };
			sections.push(current);
		}
		current.items.push(node);
	}

	return sections
		.map((section) => ({ ...section, items: dropHidden(section.items) }))
		.filter((section) => section.items.length > 0);
}
