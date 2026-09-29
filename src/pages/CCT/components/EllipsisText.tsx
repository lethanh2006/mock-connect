import Tooltip from '@/components/MyTooltip';
import { useRef, useState, type ElementType, type ReactNode } from 'react';

const isOverflowing = (el: HTMLElement | null) =>
	!!el && (el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight);

const EllipsisText = ({
	as: Tag = 'span',
	className,
	title,
	children,
	...rest
}: {
	/** Thẻ HTML render ra, mặc định `span`. */
	as?: ElementType;
	className?: string;
	/** Nội dung tooltip, mặc định chính là `children`. */
	title?: ReactNode;
	children?: ReactNode;
	/** Prop còn lại truyền thẳng xuống `as` (vd `level` khi `as={Typography.Title}`). */
	[key: string]: any;
}) => {
	const ref = useRef<HTMLElement>(null);
	const [open, setOpen] = useState(false);

	return (
		<Tooltip title={title ?? children} open={open} onOpenChange={(next) => setOpen(next && isOverflowing(ref.current))}>
			<Tag ref={ref} className={className} {...rest}>
				{children}
			</Tag>
		</Tooltip>
	);
};

export default EllipsisText;
