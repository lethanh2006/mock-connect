import { TooltipContent, TooltipProvider, TooltipTrigger } from '@vinuni/ui';
import { Tooltip as RadixTooltip } from 'radix-ui';
import React, { isValidElement } from 'react';

/**
 * Wrapper Tooltip theo API antd, style/portal dùng nguyên `TooltipContent`/`TooltipTrigger` của
 * vinui — nhưng KHÔNG dùng `Tooltip` gốc của vinui, vì component đó tự bọc `TooltipProvider` bên
 * trong với `delayDuration=0` cứng (xem dist/components/ui/tooltip.js), không nhận prop nào từ
 * ngoài. Provider mà ta bọc thêm ở ngoài luôn bị Provider trong (gần Trigger hơn) của vinui thắng,
 * nên `delayDuration` truyền vào MyTooltip trước đây hoàn toàn vô tác dụng. Dùng thẳng
 * `Tooltip.Root` của `radix-ui` (cùng primitive mà vinui dùng bên trong `TooltipTrigger`/
 * `TooltipContent`) để tự kiểm soát Provider/delay thật.
 */
type TooltipSide = 'top' | 'right' | 'bottom' | 'left';
type TooltipAlign = 'start' | 'center' | 'end';

const mapTooltipPlacement = (placement?: string): { side: TooltipSide; align: TooltipAlign } => {
	switch (placement) {
		case 'bottom':
			return { side: 'bottom', align: 'center' };
		case 'bottomLeft':
			return { side: 'bottom', align: 'start' };
		case 'bottomRight':
			return { side: 'bottom', align: 'end' };
		case 'left':
			return { side: 'left', align: 'center' };
		case 'leftTop':
			return { side: 'left', align: 'start' };
		case 'leftBottom':
			return { side: 'left', align: 'end' };
		case 'right':
			return { side: 'right', align: 'center' };
		case 'rightTop':
			return { side: 'right', align: 'start' };
		case 'rightBottom':
			return { side: 'right', align: 'end' };
		case 'topLeft':
			return { side: 'top', align: 'start' };
		case 'topRight':
			return { side: 'top', align: 'end' };
		default:
			return { side: 'top', align: 'center' };
	}
};

export interface MyTooltipProps {
	title?: React.ReactNode;
	/** Alias của `title` — antd không có prop này, giữ lại vì code cũ trong repo có thể đã dùng. */
	content?: React.ReactNode;
	placement?:
		| 'top'
		| 'left'
		| 'right'
		| 'bottom'
		| 'topLeft'
		| 'topRight'
		| 'bottomLeft'
		| 'bottomRight'
		| 'leftTop'
		| 'leftBottom'
		| 'rightTop'
		| 'rightBottom';
	children?: React.ReactNode;
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	/** ms, giống antd `mouseEnterDelay` (antd tính bằng giây, đây tính bằng ms — khác đơn vị, đừng
	 * đoán mò gán thẳng antd `mouseEnterDelay={0.5}` vào đây). */
	delayDuration?: number;
	className?: string;
	style?: React.CSSProperties;
}

export const Tooltip: React.FC<MyTooltipProps> = ({
	title,
	content,
	placement,
	children,
	open,
	defaultOpen,
	onOpenChange,
	delayDuration = 200,
	className,
	style,
}) => {
	const tooltipText = title !== undefined ? title : content;

	if (!tooltipText) return <>{children}</>;

	// `asChild` của Radix cần ĐÚNG 1 element con nhận được ref/props merge — children không phải 1
	// element hợp lệ (text thô, mảng nhiều phần tử, Fragment...) thì bọc tạm 1 span để làm trigger,
	// tránh lỗi merge props im lặng (đã gặp đúng lớp bug này khi bọc SearchInput bằng PopoverTrigger).
	const triggerNode = isValidElement(children) ? children : <span style={{ display: 'inline-block' }}>{children}</span>;

	const { side, align } = mapTooltipPlacement(placement);

	return (
		<TooltipProvider delayDuration={delayDuration}>
			<RadixTooltip.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
				<TooltipTrigger asChild>{triggerNode}</TooltipTrigger>
				<TooltipContent side={side} align={align} className={className} style={style}>
					{tooltipText}
				</TooltipContent>
			</RadixTooltip.Root>
		</TooltipProvider>
	);
};

export default Tooltip;
export { TooltipContent, TooltipProvider, TooltipTrigger };
