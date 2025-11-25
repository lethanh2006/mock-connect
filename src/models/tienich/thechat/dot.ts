import useInitModel from '@/hooks/useInitModel';
import type { TheChat } from '@/services/TienIch/TheChat/typing';

export default () => {
	const objInit = useInitModel<TheChat.IDotDanhGiaTheChat>('dot-danh-gia-the-chat');

	return {
		...objInit,
	};
};
