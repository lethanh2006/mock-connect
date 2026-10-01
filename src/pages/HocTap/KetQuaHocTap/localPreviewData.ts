import { ELoaiHocLuc, ETrinhDoKqhtHocKy } from '@/services/HocTap/constant';
import type { KetQuaHocKy } from '@/services/HocTap/KetQuaHocKy/typing';
import { ELoaiDiemChu } from '@/services/HocTap/LopHocPhan/constant';
import type { LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';

export const PREVIEW_MA_KHOA_NGANH = 'CS_2024';
export const PREVIEW_TONG_TIN_CHI_CHUONG_TRINH = 132;

const semesters = [
	{ ma: '20241', ten: 'Semester 1 · 2024–2025', gpa: 3.42, cumulativeGpa: 3.42, credits: 16, debt: 0 },
	{ ma: '20242', ten: 'Semester 2 · 2024–2025', gpa: 3.26, cumulativeGpa: 3.34, credits: 15, debt: 3 },
	{ ma: '20251', ten: 'Semester 1 · 2025–2026', gpa: 3.45, cumulativeGpa: 3.38, credits: 18, debt: 0 },
];

export const PREVIEW_KET_QUA_HOC_KY: KetQuaHocKy.IRecord[] = semesters.map(
	(semester, index) =>
		({
			_id: `preview-kqhk-${semester.ma}`,
			sinhVienSsoId: 'preview-student',
			maHocKy: semester.ma,
			hocKy: { ma: semester.ma, ten: semester.ten, tenTiengAnh: semester.ten } as HocKy.IRecord,
			maSvHk: `preview-student|${semester.ma}`,
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
			tongSoTinChiTichLuyToanKhoa: semesters.slice(0, index + 1).reduce((total, item) => total + item.credits, 0),
			tongSoTinChiNoToanKhoa: index > 0 ? 3 : 0,
			trinhDo: ETrinhDoKqhtHocKy.NAM_THU_2,
			hocLuc: ELoaiHocLuc.GIOI,
			hocLucHocKy: ELoaiHocLuc.GIOI,
			maKhoaNganh: PREVIEW_MA_KHOA_NGANH,
			khoaNganh: {} as KetQuaHocKy.IRecord['khoaNganh'],
		}) as KetQuaHocKy.IRecord,
);

const courses = [
	['20241', 'COMP1010', 'Introduction to Programming', 4, 4, ELoaiDiemChu.A],
	['20241', 'MATH2010', 'Discrete Mathematics', 4, 3.3, ELoaiDiemChu.B_PLUS],
	['20241', 'ENGL1020', 'Academic Writing', 4, 3.7, ELoaiDiemChu.A_MINUS],
	['20241', 'STAT2100', 'Applied Statistics', 4, 3, ELoaiDiemChu.B],
	['20242', 'COMP2010', 'Data Structures and Algorithms', 4, 4, ELoaiDiemChu.A],
	['20242', 'COMP2020', 'Object Oriented Programming', 4, 3.3, ELoaiDiemChu.B_PLUS],
	['20242', 'MATH2030', 'Linear Algebra', 3, 3.7, ELoaiDiemChu.A_MINUS],
	['20242', 'COMP2100', 'Computer Architecture', 4, 3, ELoaiDiemChu.B],
	['20242', 'STAT2200', 'Probability Theory', 3, 0, ELoaiDiemChu.F],
	['20251', 'COMP3010', 'Operating Systems', 5, 3.7, ELoaiDiemChu.A_MINUS],
	['20251', 'COMP3020', 'Computer Networks', 5, 3.3, ELoaiDiemChu.B_PLUS],
	['20251', 'COMP3100', 'Database Systems', 4, 4, ELoaiDiemChu.A],
	['20251', 'COMP3200', 'Software Engineering', 4, 3, ELoaiDiemChu.B],
] as const;

export const PREVIEW_DIEM_HOC_PHAN: LopHocPhan.IDiemHpSvHk[] = courses.map(
	([maHocKy, maHocPhan, tenHocPhan, soTinChi, diemThang4, diemChu], index) =>
		({
			_id: `preview-diem-${maHocPhan}`,
			sinhVienSsoId: 'preview-student',
			maHocPhan,
			maHocKy,
			hocKy: PREVIEW_KET_QUA_HOC_KY.find((item) => item.maHocKy === maHocKy)?.hocKy,
			tenLopHocPhan: `${maHocPhan}-01`,
			hocPhan: {
				_id: `preview-hp-${maHocPhan}`,
				ma: maHocPhan,
				ten: tenHocPhan,
				tenTiengAnh: tenHocPhan,
				soTinChi,
				active: true,
				maLoaiHocPhan: 'BB',
				maDonVi: 'CECS',
			},
			diemThanhPhan1: Number((7.4 + (index % 3) * 0.6).toFixed(1)),
			diemThanhPhan2: Number((8 + (index % 4) * 0.4).toFixed(1)),
			diemThi1: diemThang4 ? Number((7.2 + (index % 5) * 0.5).toFixed(1)) : 3.2,
			diemTongKet: diemThang4 ? Number((diemThang4 * 2.35 + 0.5).toFixed(1)) : 3.8,
			diemThang4,
			diemChu,
			dat: diemThang4 > 0,
			tichLuy: diemThang4 > 0,
			khoa: true,
			khoaDiemThi: true,
			public: true,
			dotDangKyQuyDoiDiemId: '',
			infoKhoaNganh: {
				[PREVIEW_MA_KHOA_NGANH]: {
					maHocKyDat: diemThang4 ? maHocKy : undefined,
					soLanHoc: 1,
					trongCtdt: true,
				},
			},
		}) as LopHocPhan.IDiemHpSvHk,
);
