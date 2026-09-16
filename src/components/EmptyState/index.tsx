import { LecxeEmptyNoData } from '@/components/Icons';
import classNames from 'classnames';
import type { ComponentType } from 'react';
import './style.less';

export interface EmptyStateProps {
	/** Chữ mô tả hiển thị dưới hình minh hoạ. */
	description?: React.ReactNode;
	/** Hình minh hoạ Lecxe — mặc định LecxeEmptyNoData, đổi khi cần (404, không quyền...). */
	image?: ComponentType<{ alt?: string }>;
	/** Hình + margin nhỏ hơn — dùng cho bảng/khu vực size='small' (vd: nhúng trong modal). */
	compact?: boolean;
	className?: string;
}

/**
 * Thay thế antd `Empty` bằng hình minh hoạ Lecxe của @vinuni/ui. Component này tồn tại
 * vì `alt` của Lecxe chỉ dành cho accessibility, không tự hiện chữ như `description`
 * của antd Empty — phải tự bọc caption, nên gom vào 1 chỗ dùng chung thay vì lặp lại.
 */
const EmptyState = ({ description, image: Image = LecxeEmptyNoData, compact, className }: EmptyStateProps) => (
	<div className={classNames('empty-state', compact && 'empty-state-compact', className)}>
		<Image alt='' />
		{description ? <span className='empty-state-text'>{description}</span> : null}
	</div>
);

export default EmptyState;
