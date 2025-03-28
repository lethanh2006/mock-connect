import useInitModel from '@/hooks/useInitModel';
import type { DanhMucChung } from '@/services/QuanLyKhoaHocV2/DanhMuc/Chung/typings';

export default () => {
	const objInit = useInitModel<DanhMucChung.IRecord>('nckh/danh-muc-nckh');
	return {
		...objInit,
	};
};
