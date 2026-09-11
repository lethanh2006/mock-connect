import { TableHead } from '@vinuni/ui';
import React from 'react';
import { Resizable } from 'react-resizable';

export interface ResizableTableHeadProps extends React.ComponentProps<typeof TableHead> {
	/** Cột co giãn theo tỷ lệ (không pin/không resizable) truyền vào đây một biểu thức CSS (vd. `calc(...)`) thay vì số px. */
	width?: number | string;
	minWidth?: number;
	maxWidth?: number;
	resizable?: boolean;
	onColumnResize?: (e: React.SyntheticEvent, data: { size: { width: number; height: number } }) => void;
	onResizeStart?: (e: any) => void;
	onResizeStop?: (e: any) => void;
	onDoubleClick?: () => void;
}

/** Thay thế `ResizableTitle` (dùng cho antd Table) cho header cell của vinuni `<Table>`. */
export const ResizableTableHead: React.FC<ResizableTableHeadProps> = ({
	width,
	minWidth,
	maxWidth,
	resizable,
	onColumnResize,
	onResizeStart,
	onResizeStop,
	onDoubleClick,
	style,
	children,
	...restProps
}) => {
	// `Resizable` (react-resizable) cần width dạng số nguyên px để tính toán kéo giãn — cột co giãn theo % (không resizable) hoặc cột pin (fixed/sticky) không bọc qua Resizable
	const isPinned = !!(restProps as any)?.pinned || style?.position === 'sticky';
	if (typeof width !== 'number' || !resizable || isPinned) {
		return (
			<TableHead style={{ width, minWidth, ...style }} {...restProps}>
				{children}
			</TableHead>
		);
	}

	return (
		<Resizable
			width={width}
			height={0}
			axis='x'
			minConstraints={minWidth ? [minWidth, 0] : undefined}
			maxConstraints={maxWidth ? [maxWidth, 0] : undefined}
			onResize={onColumnResize}
			draggableOpts={{ enableUserSelectHack: true }}
			onResizeStart={(e) => {
				e.stopPropagation();
				onResizeStart?.(e);
			}}
			onResizeStop={(e) => {
				onResizeStop?.(e);
			}}
			handle={
				<span
					className='react-resizable-handle no-print'
					onClick={(e) => e.stopPropagation()}
					onDoubleClick={(e) => {
						e.stopPropagation();
						onDoubleClick?.();
					}}
				/>
			}
		>
			<TableHead style={{ width, position: 'relative', ...style }} {...restProps}>
				{children}
			</TableHead>
		</Resizable>
	);
};
