import type { ReactNode } from 'react';
import { loadingModalStore } from './loadingModalStore';

/**
 * Hiện modal "Đang xử lý..." — gọi được từ bất kỳ đâu (không cần là component React), giống hệt
 * cách `toast.success(...)` gọi được từ mọi nơi. Phần render thật nằm ở LoadingModal.tsx (mount
 * 1 lần duy nhất trong app.tsx) — hàm này chỉ đẩy state vào loadingModalStore.
 * Đóng lại bằng `hideFormWaiting()`.
 */
const FormWaiting = (message: ReactNode) => {
	loadingModalStore.show(message);
};

export const hideFormWaiting = () => loadingModalStore.hide();

export default FormWaiting;
