import { Skeleton } from '@/components/Icons';
import type { CSSProperties } from 'react';

/**
 * Skeleton vinui chỉ là 1 thanh phẳng, không có sẵn kiểu "paragraph rows" như antd Skeleton —
 * ghép nhiều thanh để mô phỏng lại, dòng cuối ngắn hơn cho giống dáng đoạn văn.
 */
const SkeletonParagraph = ({ rows, style }: { rows: number; style?: CSSProperties }) => (
	<div style={{ display: 'flex', flexDirection: 'column', gap: 8, ...style }}>
		{Array.from({ length: rows }).map((_, index) => (
			<Skeleton key={index} style={{ height: 16, width: index === rows - 1 ? '60%' : '100%' }} />
		))}
	</div>
);

export default SkeletonParagraph;
