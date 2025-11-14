import useInitModel from '@/hooks/useInitModel';
import { ETrangThaiDonNghiHoc } from '@/services/DaoTao/constant';
import type { YeuCauNghiHoc } from '@/services/DaoTao/YeuCauNghiHoc/typing';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<YeuCauNghiHoc.IRecord>('dang-ky-nghi-hoc', undefined, undefined, ipDaoTao);
	const { danhSach } = objInit;
	const soDonChoDuyet = danhSach?.filter((i) => i.trangThai === ETrangThaiDonNghiHoc.CHO_DUYET)?.length ?? 0;

	return {
		...objInit,
		soDonChoDuyet,
	};
};
