import classNames from 'classnames';
import type { CSSProperties, ReactNode } from 'react';
import './style.less';

/**
 * Grid tự dựng bằng flexbox + CSS custom property, mô phỏng antd Row/Col (grid 24 cột, cùng
 * breakpoint xs/sm/md/lg/xl/xxl) để các phân hệ pull code base này về chỉ cần đổi
 * `import { Row, Col } from 'antd'` thành `import { Row, Col } from '@/components/MyGrid'`.
 *
 * Không dùng CSS Grid thật — flexbox + margin âm (kiểu bootstrap/antd cũ) để `gutter` hoạt động
 * đúng y hệt antd: khoảng cách giữa các Col, không phải khoảng cách quanh Row.
 *
 * Responsive qua CSS custom property theo từng breakpoint (`--my-col-span-md`...) thay vì sinh cả
 * trăm class kiểu Tailwind (24 span × 6 breakpoint) — Col chỉ set biến CSS qua inline style, phần
 * còn lại do file style.less xử lý bằng media query, khớp đúng breakpoint antd dùng (sm≥576,
 * md≥768, lg≥992, xl≥1200, xxl≥1600).
 */

export type MyGutter = number | [number, number];

export interface MyRowProps {
	gutter?: MyGutter;
	justify?: 'start' | 'end' | 'center' | 'space-around' | 'space-between' | 'space-evenly';
	align?: 'top' | 'middle' | 'bottom' | 'stretch';
	wrap?: boolean;
	className?: string;
	style?: CSSProperties;
	children?: ReactNode;
}

const ALIGN_MAP: Record<NonNullable<MyRowProps['align']>, CSSProperties['alignItems']> = {
	top: 'flex-start',
	middle: 'center',
	bottom: 'flex-end',
	stretch: 'stretch',
};

export const Row = ({ gutter, justify, align, wrap = true, className, style, children, ...rest }: MyRowProps) => {
	const [gutterX, gutterY] = Array.isArray(gutter) ? gutter : [gutter ?? 0, 0];
	return (
		<div
			className={classNames('my-row', { 'my-row-nowrap': !wrap }, className)}
			style={
				{
					'--my-row-gutter-x': `${gutterX}px`,
					'--my-row-gutter-y': `${gutterY}px`,
					justifyContent: justify,
					alignItems: align ? ALIGN_MAP[align] : undefined,
					...style,
				} as CSSProperties
			}
			{...rest}
		>
			{children}
		</div>
	);
};

/** Giá trị breakpoint kiểu antd: hoặc số (span), hoặc object {span, offset, order, push, pull}. */
export type MyColBreakpoint = number | { span?: number; offset?: number; order?: number; push?: number; pull?: number };

export interface MyColProps {
	span?: number;
	offset?: number;
	order?: number;
	push?: number;
	pull?: number;
	flex?: string | number;
	xs?: MyColBreakpoint;
	sm?: MyColBreakpoint;
	md?: MyColBreakpoint;
	lg?: MyColBreakpoint;
	xl?: MyColBreakpoint;
	xxl?: MyColBreakpoint;
	className?: string;
	style?: CSSProperties;
	children?: ReactNode;
}

const BREAKPOINTS = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const;

export const Col = ({
	span,
	offset,
	order,
	push,
	pull,
	flex,
	xs,
	sm,
	md,
	lg,
	xl,
	xxl,
	className,
	style,
	children,
	...rest
}: MyColProps) => {
	const cssVars: Record<string, string | number> = {};
	if (span !== undefined) cssVars['--my-col-span'] = span;
	if (offset !== undefined) cssVars['--my-col-offset'] = offset;
	if (order !== undefined) cssVars['--my-col-order'] = order;
	if (push !== undefined) cssVars['--my-col-push'] = push;
	if (pull !== undefined) cssVars['--my-col-pull'] = pull;

	const byBreakpoint = { xs, sm, md, lg, xl, xxl };
	for (const bp of BREAKPOINTS) {
		const val = byBreakpoint[bp];
		if (val === undefined) continue;
		if (typeof val === 'number') {
			cssVars[`--my-col-span-${bp}`] = val;
		} else {
			if (val.span !== undefined) cssVars[`--my-col-span-${bp}`] = val.span;
			if (val.offset !== undefined) cssVars[`--my-col-offset-${bp}`] = val.offset;
			if (val.order !== undefined) cssVars[`--my-col-order-${bp}`] = val.order;
			if (val.push !== undefined) cssVars[`--my-col-push-${bp}`] = val.push;
			if (val.pull !== undefined) cssVars[`--my-col-pull-${bp}`] = val.pull;
		}
	}

	return (
		<div
			className={classNames('my-col', className)}
			style={{ ...cssVars, flex, ...style } as CSSProperties}
			{...rest}
		>
			{children}
		</div>
	);
};
