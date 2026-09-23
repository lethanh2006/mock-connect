import React from 'react';

export interface PageCardProps {
	title?: React.ReactNode | boolean;
	/** Dòng mô tả dưới title. Chỉ render ở level 4 (Standard Card). */
	subtitle?: React.ReactNode;
	/**
	 * Kiểu header level 4.
	 * default: chỉ title/subtitle.
	 * action: cụm nút pill + icon bên phải.
	 * button-text: nút chữ bên phải.
	 * custom: slot cột tùy ý bên phải.
	 */
	headerType?: 'default' | 'action' | 'button-text' | 'custom';
	extra?: React.ReactNode;
	cardExtra?: React.ReactNode;
	children?: React.ReactNode;
	className?: string;
	style?: React.CSSProperties;
	styles?: { header?: React.CSSProperties; body?: React.CSSProperties };
	/** Chỉ áp dụng cho level=4 (Standard Card) — map sang size của vinui Card ('small'→'sm'). */
	size?: 'default' | 'small';
	bordered?: boolean;
	hideInnerCard?: boolean;
	level?: 1 | 2 | 3 | 4;
	showIndicator?: boolean;
	loading?: boolean;
	/** Ghim title (Level 1) lại khi cuộn, kèm hiệu ứng ScrollEdgeEffect. Mặc định: tắt. */
	stickyHeader?: boolean;
	[key: string]: any;
}
