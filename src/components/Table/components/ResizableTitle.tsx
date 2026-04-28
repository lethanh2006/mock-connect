import { Resizable } from 'react-resizable';

export const ResizableTitle = (componentProps: any) => {
	const { onColumnResize, width, minWidth, maxWidth, resizable, onResizeStart, onResizeStop, children, ...restProps } =
		componentProps;

	if (!width || !resizable) {
		return <th {...restProps}>{children}</th>;
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
					onClick={(e) => {
						e.stopPropagation();
					}}
				/>
			}
		>
			<th {...restProps}>{children}</th>
		</Resizable>
	);
};
