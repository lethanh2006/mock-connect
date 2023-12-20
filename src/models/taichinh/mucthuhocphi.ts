import useInitModel from '@/hooks/useInitModel';
import { ELoaiHocPhanDangKyTinChi } from '@/services/DaoTao/DangKyTinChi/constant';
import { getMucThuHocPhiTheoNam } from '@/services/TaiChinh/MucThuHocPhi';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<MucThuHocPhi.IRecord>('muc-thu-hoc-phi', undefined, undefined, ipDaoTao);
	const { setRecord, setLoading, record } = objInit;

	/**
	 * Tính học phí dự kiến sau khi get Mức thu học phí của tôi
	 * @param soTinChi Số tín chỉ học phần
	 * @param loaiDangKy Loại đăng ký lớp tín chỉ
	 * @returns Học phí dự kiến
	 */
	const tinhHocPhi = (soTinChi?: number, loaiDangKy?: ELoaiHocPhanDangKyTinChi): number => {
		const due = (record?.unitAmount ?? 0) * (soTinChi ?? 0);
		const heSo = {
			[ELoaiHocPhanDangKyTinChi.CAI_THIEN]: record?.heSoHocCaiThien ?? 1,
			[ELoaiHocPhanDangKyTinChi.HOC_LAI]: record?.heSoHocLai ?? 1,
		};
		const defaultHeSo = record?.heSoTienTrinh ?? 1;

		return due * (heSo[loaiDangKy as keyof typeof heSo] ?? defaultHeSo);
	};

	const getMucThuHocPhiTheoNamModel = async (maNamHoc: string): Promise<MucThuHocPhi.IRecord> => {
		setLoading(true);
		try {
			const res = await getMucThuHocPhiTheoNam(maNamHoc);
			setRecord(res.data?.data);
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
	};
};
