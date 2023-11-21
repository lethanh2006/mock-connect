import useInitModel from '@/hooks/useInitModel';
import type { KhaiBaoSucKhoe } from '@/services/KhaiBaoSucKhoe/typing';

export default () => {
	const objInit = useInitModel<KhaiBaoSucKhoe.IRecord>('tinh-trang-suc-khoe-sinh-vien');

	return {
		...objInit,
	};
};
