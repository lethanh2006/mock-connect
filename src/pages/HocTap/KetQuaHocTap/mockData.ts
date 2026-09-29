import { ELoaiHocLuc, ETrinhDoKqhtHocKy } from '@/services/HocTap/constant';
import type { KetQuaHocKy } from '@/services/HocTap/KetQuaHocKy/typing';
import { ELoaiDiemChu } from '@/services/HocTap/LopHocPhan/constant';
import type { LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';

export const ENABLE_KET_QUA_HOC_TAP_MOCK = true;
export const MOCK_MA_KHOA_NGANH = 'CS_2024';
export const MOCK_TONG_TIN_CHI_CHUONG_TRINH = 124;

const semesterDefinitions = [
	{ ma: '20241', ten: 'Học kỳ 1 - Năm học 2024-2025', gpa: 3.42, cumulativeGpa: 3.42, credits: 16, debt: 0 },
	{ ma: '20242', ten: 'Học kỳ 2 - Năm học 2024-2025', gpa: 3.18, cumulativeGpa: 3.3, credits: 17, debt: 3 },
	{ ma: '20251', ten: 'Học kỳ 1 - Năm học 2025-2026', gpa: 3.63, cumulativeGpa: 3.41, credits: 18, debt: 0 },
	{ ma: '20252', ten: 'Học kỳ 2 - Năm học 2025-2026', gpa: 3.55, cumulativeGpa: 3.45, credits: 17, debt: 0 },
];

let cumulativeCredits = 0;
export const MOCK_KET_QUA_HOC_KY: KetQuaHocKy.IRecord[] = semesterDefinitions.map((semester, index) => {
	cumulativeCredits += semester.credits;
	return {
		_id: `mock-kqhk-${semester.ma}`,
		sinhVienSsoId: 'mock-student',
		maHocKy: semester.ma,
		hocKy: { ma: semester.ma, ten: semester.ten, tenTiengAnh: semester.ten } as HocKy.IRecord,
		maSvHk: `mock-student|${semester.ma}`,
		trungBinhHocKy: Number((semester.gpa * 2.5).toFixed(2)),
		trungBinhHocKyThang4: semester.gpa,
		trungBinhHocKyAll: semester.gpa,
		tongSoTinChiHocKy: semester.credits,
		tongSoTinChiTichLuyHocKy: semester.credits,
		trungBinhHocBongHocKyThang4: semester.gpa,
		tongSoTinChiNoHocKy: semester.debt,
		tongSoTinChiHocBongHocKy: semester.credits,
		trungBinhTichLuyToanKhoa: Number((semester.cumulativeGpa * 2.5).toFixed(2)),
		trungBinhTichLuyToanKhoaThang4: semester.cumulativeGpa,
		tongSoTinChiTichLuyToanKhoa: cumulativeCredits,
		tongSoTinChiNoToanKhoa: index === 1 ? 3 : 0,
		trinhDo: ETrinhDoKqhtHocKy.NAM_THU_2,
		hocLuc: ELoaiHocLuc.GIOI,
		hocLucHocKy: semester.gpa >= 3.6 ? ELoaiHocLuc.XUAT_SAC : ELoaiHocLuc.GIOI,
		maKhoaNganh: MOCK_MA_KHOA_NGANH,
		khoaNganh: {} as KetQuaHocKy.IRecord['khoaNganh'],
	} as KetQuaHocKy.IRecord;
});

const gradeDefinitions = [
	['20241', 'MA101', 'Giải tích 1', 4, 3.7, ELoaiDiemChu.A_MINUS, true, true],
	['20241', 'CS101', 'Nhập môn khoa học máy tính', 4, 4, ELoaiDiemChu.A, true, true],
	['20241', 'PHY101', 'Vật lý đại cương', 4, 3, ELoaiDiemChu.B, true, true],
	['20241', 'ENG101', 'Academic English 1', 4, 3, ELoaiDiemChu.B, true, true],
	['20242', 'MA102', 'Giải tích 2', 4, 3.3, ELoaiDiemChu.B_PLUS, true, true],
	['20242', 'CS102', 'Lập trình hướng đối tượng', 4, 3.7, ELoaiDiemChu.A_MINUS, true, true],
	['20242', 'STA201', 'Xác suất thống kê', 3, 0, ELoaiDiemChu.F, false, false],
	['20242', 'HUM110', 'Tư duy phản biện', 3, 3.7, ELoaiDiemChu.A_MINUS, true, true],
	['20251', 'CS201', 'Cấu trúc dữ liệu và giải thuật', 4, 4, ELoaiDiemChu.A, true, true],
	['20251', 'CS210', 'Kiến trúc máy tính', 4, 3.3, ELoaiDiemChu.B_PLUS, true, true],
	['20251', 'MA203', 'Toán rời rạc', 4, 3.7, ELoaiDiemChu.A_MINUS, true, true],
	['20251', 'ELEC01', 'Kỹ năng thuyết trình', 2, 4, ELoaiDiemChu.A, true, false],
	['20252', 'CS220', 'Hệ điều hành', 4, 3.7, ELoaiDiemChu.A_MINUS, true, true],
	['20252', 'CS230', 'Mạng máy tính', 4, 3.3, ELoaiDiemChu.B_PLUS, true, true],
	['20252', 'SE220', 'Kỹ nghệ phần mềm', 3, 4, ELoaiDiemChu.A, true, true],
	['20252', 'ENG202', 'Academic English 2', 3, 3, ELoaiDiemChu.B, true, true],
] as const;

export const MOCK_DIEM_HOC_PHAN: LopHocPhan.IDiemHpSvHk[] = gradeDefinitions.map(
	([maHocKy, maHocPhan, tenHocPhan, soTinChi, diemThang4, diemChu, dat, trongCtdt], index) =>
		({
			_id: `mock-diem-${maHocPhan}`,
			sinhVienSsoId: 'mock-student',
			maHocPhan,
			maHocKy,
			hocKy: MOCK_KET_QUA_HOC_KY.find((item) => item.maHocKy === maHocKy)?.hocKy,
			hocPhan: {
				_id: `mock-hp-${maHocPhan}`,
				ma: maHocPhan,
				ten: tenHocPhan,
				soTinChi,
				active: true,
				maLoaiHocPhan: 'BB',
				maDonVi: 'CECS',
			},
			diemThanhPhan1: Number((7.4 + (index % 3) * 0.6).toFixed(1)),
			diemThanhPhan2: Number((8 + (index % 4) * 0.4).toFixed(1)),
			diemThi1: dat ? Number((7.2 + (index % 5) * 0.5).toFixed(1)) : 3.2,
			diemTongKet: dat ? Number((diemThang4 * 2.35 + 0.5).toFixed(1)) : 3.8,
			diemThang4,
			diemChu,
			dat,
			tichLuy: dat && trongCtdt,
			khoa: true,
			khoaDiemThi: true,
			public: true,
			dotDangKyQuyDoiDiemId: '',
			infoKhoaNganh: {
				[MOCK_MA_KHOA_NGANH]: {
					maHocKyDat: dat ? maHocKy : undefined,
					soLanHoc: 1,
					trongCtdt,
				},
			},
		}) as LopHocPhan.IDiemHpSvHk,
);
