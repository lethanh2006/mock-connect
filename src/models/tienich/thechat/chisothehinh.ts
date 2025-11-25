import useInitModel from '@/hooks/useInitModel';
import type { TheChat } from '@/services/TienIch/TheChat/typing';

export default () => {
	const objInit = useInitModel<TheChat.IChiSoHinhThe>('chi-so-hinh-the');

	return {
		...objInit,
	};
};
