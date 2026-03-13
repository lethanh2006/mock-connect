import useInitModel from '@/hooks/useInitModel';
import type { QuyetDinh } from '@/services/HocTap/QuyetDinh/typing';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<QuyetDinh.ISinhVienBaoLuuThoiHoc>('quyet-dinh-bao-luu', undefined, undefined, ipDaoTao);

	return {
		...objInit,
	};
};
