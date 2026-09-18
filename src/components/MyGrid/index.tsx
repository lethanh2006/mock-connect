import classNames from 'classnames';
import type { CSSProperties, ReactNode } from 'react';
import './style.less';

/**
 * Grid mô phỏng antd Row/Col (24 cột, breakpoint xs/sm/md/lg/xl/xxl) để các phân hệ pull code base
 * này về chỉ cần đổi `import { Row, Col } from 'antd'` thành `import { Row, Col } from '@/components/MyGrid'`.
 *
 * Dùng CSS class sinh sẵn theo từng breakpoint (kiểu bootstrap/antd thật), KHÔNG dùng CSS custom
 * property cho span/offset/push/pull — custom property set qua inline style luôn kế thừa xuống mọi
 * phần tử con, nên khi lồng Col trong Col (Col cha set `md` nhưng Col con không set) thì Col con sẽ
 * "kế thừa nhầm" giá trị breakpoint của Col cha thay vì rơi về fallback đúng của nó. Class không có
 * cơ chế kế thừa này nên tránh được hoàn toàn bug (đã thấy ở FilterItem.tsx khi lồng Row/Col thật).
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

const JUSTIFY_MAP: Record<NonNullable<MyRowProps['justify']>, CSSProperties['justifyContent']> = {
	start: 'flex-start',
	end: 'flex-end',
	center: 'center',
	'space-around': 'space-around',
	'space-between': 'space-between',
	'space-evenly': 'space-evenly',
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
					justifyContent: justify ? JUSTIFY_MAP[justify] : undefined,
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
	const colClasses: string[] = ['my-col'];

	if (span !== undefined) colClasses.push(`my-col-${span}`);
	if (offset !== undefined) colClasses.push(`my-col-offset-${offset}`);
	if (push !== undefined) colClasses.push(`my-col-push-${push}`);
	if (pull !== undefined) colClasses.push(`my-col-pull-${pull}`);

	// `order` không nằm trong lưới 24 cột (số nguyên bất kỳ, không bounded) nên không sinh class như
	// span/offset/push/pull — vẫn áp qua inline style, ghi đè không phân biệt breakpoint (không có
	// usage thực tế nào cần order đổi theo breakpoint tại thời điểm viết file này; nếu về sau cần,
	// nên bổ sung như class .my-col-{bp}-order-{n} cùng cơ chế bên dưới thay vì quay lại CSS variable).
	let computedOrder = order;

	const byBreakpoint = { xs, sm, md, lg, xl, xxl };
	for (const bp of BREAKPOINTS) {
		const val = byBreakpoint[bp];
		if (val === undefined) continue;
		if (typeof val === 'number') {
			colClasses.push(`my-col-${bp}-${val}`);
		} else if (typeof val === 'object' && val !== null) {
			if (val.span !== undefined) colClasses.push(`my-col-${bp}-${val.span}`);
			if (val.offset !== undefined) colClasses.push(`my-col-${bp}-offset-${val.offset}`);
			if (val.push !== undefined) colClasses.push(`my-col-${bp}-push-${val.push}`);
			if (val.pull !== undefined) colClasses.push(`my-col-${bp}-pull-${val.pull}`);
			if (val.order !== undefined) computedOrder = val.order;
		}
	}

	const inlineStyle: CSSProperties = { ...style };
	if (computedOrder !== undefined) {
		inlineStyle.order = computedOrder;
	}
	if (flex !== undefined) {
		if (typeof flex === 'number') {
			inlineStyle.flex = `${flex} ${flex} auto`;
		} else if (flex === 'auto') {
			inlineStyle.flex = '1 1 auto';
		} else if (flex === 'none') {
			inlineStyle.flex = '0 0 auto';
		} else {
			inlineStyle.flex = flex;
		}
	}

	return (
		<div className={classNames(colClasses, className)} style={inlineStyle} {...rest}>
			{children}
		</div>
	);
};
