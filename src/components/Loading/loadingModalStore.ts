import type { ReactNode } from 'react';

// Kho trạng thái thuần (không qua React hook/model) để FormWaiting/hideFormWaiting gọi được từ
// bất kỳ đâu (kể cả trong hàm xử lý sự kiện, không cần là component React) — giống hệt cơ chế
// messageToast của @vinuni/ui nói chuyện với 1 <Toaster/> đã mount sẵn ở gốc app. LoadingModal
// (mount 1 lần duy nhất, xem app.tsx) dùng useSyncExternalStore để phản ứng theo state này.
type LoadingModalState = { visible: boolean; message: ReactNode };

let state: LoadingModalState = { visible: false, message: '' };
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((fn) => fn());

export const loadingModalStore = {
	getState: () => state,
	subscribe: (listener: () => void) => {
		listeners.add(listener);
		return () => listeners.delete(listener);
	},
	show: (message: ReactNode) => {
		state = { visible: true, message };
		emit();
	},
	hide: () => {
		state = { ...state, visible: false };
		emit();
	},
};
