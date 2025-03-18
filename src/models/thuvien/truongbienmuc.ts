import useInitModel from '@/hooks/useInitModel';
import { ipThuVien } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<TruongBienMuc.IRecord>('tag', undefined, undefined, ipThuVien);

	return {
		...objInit,
	};
};
