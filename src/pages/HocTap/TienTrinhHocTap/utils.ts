import { ETrangThaiHocTap } from '@/services/DaoTao/constant';
import { type ChuongTrinhDaoTao } from '@/services/DaoTao/ChuongTrinhDaoTao/typing';

export const tinhThongKeMinor = (minors?: ChuongTrinhDaoTao.TTienTrinhKhungMinor[]) => {
	const listHocPhanMinor = minors?.flatMap((minor) => minor.khoiHpCtList ?? []) ?? [];

	return listHocPhanMinor.reduce(
		(result, item) => {
			const soTinChi = item.hocPhan?.soTinChi ?? item.soTinChi ?? 0;
			const daDat = item.hoc === ETrangThaiHocTap.DA_HOC || item.lichSuDiem?.some((diem) => diem.dat);

			return {
				daDat: result.daDat + (daDat ? soTinChi : 0),
				tong: result.tong + soTinChi,
			};
		},
		{ daDat: 0, tong: 0 },
	);
};
