import useInitModel from '@/hooks/useInitModel';
import { ELoaiHocPhanDangKyTinChi } from '@/services/DaoTao/DangKyTinChi/constant';
import { getMucThuHocPhiTheoNam } from '@/services/TaiChinh/MucThuHocPhi';
import { ipDaoTao } from '@/utils/ip';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<MucThuHocPhi.IRecord>('muc-thu-hoc-phi', undefined, undefined, ipDaoTao);
	const [mucThuMe, setMucThuMe] = useState<MucThuHocPhi.TMyMucThu>();
	const { setLoading } = objInit;

	/**
	 * Tính học phí dự kiến sau khi get Mức thu học phí của tôi
	 * @param soTinChi Số tín chỉ học phần
	 * @param loaiHocPhan Loại đăng ký lớp tín chỉ
	 * @param maKhoaNganh Mã khóa ngành => Xác định ngành chính | ngành phụ
	 * @returns Học phí dự kiến
	 */
	const tinhHocPhi = (soTinChi?: number, loaiHocPhan?: ELoaiHocPhanDangKyTinChi, maNganh?: string | null): number => {
		if (!mucThuMe) return 0;
		let mucThu = Object.values(mucThuMe).find((item) => item && item.maNganh === maNganh);
		if (!mucThu) mucThu = mucThuMe.mucThuKhoaNganhChinh;
		const due = (mucThu?.unitAmount ?? 0) * (soTinChi ?? 0);
		const heSo = {
			[ELoaiHocPhanDangKyTinChi.CAI_THIEN]: mucThu?.heSoHocCaiThien ?? 1,
			[ELoaiHocPhanDangKyTinChi.HOC_LAI]: mucThu?.heSoHocLai ?? 1,
		};
		const defaultHeSo = mucThu?.heSoTienTrinh ?? 1;

		return due * (heSo[loaiHocPhan as keyof typeof heSo] ?? defaultHeSo);
	};

	const getMucThuHocPhiTheoNamModel = async (maNamHoc: string): Promise<MucThuHocPhi.TMyMucThu> => {
		setLoading(true);
		try {
			const res = await getMucThuHocPhiTheoNam(maNamHoc);
			setMucThuMe(res.data?.data);
			return res.data?.data;
		} catch (error) {
			return Promise.reject(error);
		} finally {
			setLoading(false);
		}
	};

	return {
		...objInit,
		getMucThuHocPhiTheoNamModel,
		tinhHocPhi,
		mucThuMe,
	};
};
