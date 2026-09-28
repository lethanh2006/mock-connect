import { messageToast } from '@vinuni/ui';
import type { ReactNode } from 'react';

// Giữ nguyên hình dạng gọi cũ của antd (message/description/key) cho các call site khỏi phải
// viết lại toàn bộ JSX nội dung — chỉ đổi chỗ render từ antd message/notification sang
// MessageToast của @vinuni/ui (qua messageToast, đã tự lo Toaster/toast.custom bên trong).
type ToastContent = ReactNode | { message: ReactNode; description?: ReactNode };
type ToastOptions = { key?: string; action?: ReactNode; closeLabel?: string };

const normalize = (content: ToastContent): ReactNode => {
	if (content && typeof content === 'object' && 'message' in content) {
		const { message, description } = content as { message: ReactNode; description?: ReactNode };
		return description ? (
			<div>
				<div className='font-semibold'>{message}</div>
				<div>{description}</div>
			</div>
		) : (
			message
		);
	}
	return content;
};

const call =
	(type: Parameters<typeof messageToast>[0]) =>
	(content: ToastContent, options?: ToastOptions) =>
		messageToast(type, normalize(content), {
			// key -> id: sonner thay toast cùng id thay vì chồng thêm cái mới, giống hành vi
			// `key` của antd notification (dedupe theo loại lỗi).
			id: options?.key,
			action: options?.action,
			closeLabel: options?.closeLabel,
		});

export const toast = {
	success: call('positive'),
	error: call('negative'),
	warning: call('warning'),
	info: call('informative'),
};
