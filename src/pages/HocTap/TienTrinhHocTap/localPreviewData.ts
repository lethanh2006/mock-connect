import type { ChuongTrinhDaoTao } from '@/services/DaoTao/ChuongTrinhDaoTao/typing';
import { ELoaiHocPhanCTDT, ETrangThaiHocTap } from '@/services/DaoTao/constant';
import type { SinhVien } from '@/services/DaoTao/SinhVien/typings';
import { ELoaiHocLuc, ETrinhDoKqhtHocKy } from '@/services/HocTap/constant';
import { ELoaiDiemChu } from '@/services/HocTap/LopHocPhan/constant';
import type { LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';

export const PREVIEW_MA_KHOA_NGANH = 'CS_2024';

const knowledgeBlocks = {
	daiCuong: { ma: 'DC', ten: 'Kiến thức giáo dục đại cương', soThuTu: 1 },
	coSo: { ma: 'CSN', ten: 'Kiến thức cơ sở ngành', soThuTu: 2 },
	chuyenNganh: { ma: 'CN', ten: 'Kiến thức chuyên ngành', soThuTu: 3 },
};

const makeGrade = (id: string, maHocPhan: string, diemChu: ELoaiDiemChu): LopHocPhan.IDiemHpSvHk =>
	({
		_id: id,
		sinhVienSsoId: 'mock-student',
		maHocPhan,
		maHocKy: '20251',
		dotDangKyQuyDoiDiemId: '',
		diemChu,
		dat: diemChu !== ELoaiDiemChu.F,
		diemThang4:
			diemChu === ELoaiDiemChu.A ? 4 : diemChu === ELoaiDiemChu.A_MINUS ? 3.7 : diemChu === ELoaiDiemChu.F ? 0 : 3.3,
		tenLopHocPhan: `${maHocPhan}-01`,
		khoa: true,
		khoaDiemThi: true,
		public: true,
	}) as LopHocPhan.IDiemHpSvHk;

const courseDefinitions = [
	['MA101', 'Giải tích 1', 4, 1, knowledgeBlocks.daiCuong, ETrangThaiHocTap.DA_HOC, ELoaiDiemChu.A_MINUS],
	['CS101', 'Nhập môn khoa học máy tính', 4, 1, knowledgeBlocks.coSo, ETrangThaiHocTap.DA_HOC, ELoaiDiemChu.A],
	['ENG101', 'Academic English 1', 4, 1, knowledgeBlocks.daiCuong, ETrangThaiHocTap.DA_HOC, ELoaiDiemChu.B_PLUS],
	['MA102', 'Giải tích 2', 4, 2, knowledgeBlocks.daiCuong, ETrangThaiHocTap.DA_HOC, ELoaiDiemChu.B_PLUS],
	['CS102', 'Lập trình hướng đối tượng', 4, 2, knowledgeBlocks.coSo, ETrangThaiHocTap.DA_HOC, ELoaiDiemChu.A_MINUS],
	['STA201', 'Xác suất thống kê', 3, 2, knowledgeBlocks.daiCuong, ETrangThaiHocTap.CHUA_DAT, ELoaiDiemChu.F],
	['CS201', 'Cấu trúc dữ liệu và giải thuật', 4, 3, knowledgeBlocks.coSo, ETrangThaiHocTap.DA_HOC, ELoaiDiemChu.A],
	['CS210', 'Kiến trúc máy tính', 4, 3, knowledgeBlocks.coSo, ETrangThaiHocTap.DA_HOC, ELoaiDiemChu.B_PLUS],
	['MA203', 'Toán rời rạc', 4, 3, knowledgeBlocks.daiCuong, ETrangThaiHocTap.DA_HOC, ELoaiDiemChu.A_MINUS],
	['CS220', 'Hệ điều hành', 4, 4, knowledgeBlocks.chuyenNganh, ETrangThaiHocTap.DANG_HOC, undefined],
	['CS230', 'Mạng máy tính', 4, 4, knowledgeBlocks.chuyenNganh, ETrangThaiHocTap.DANG_HOC, undefined],
	['SE220', 'Kỹ nghệ phần mềm', 3, 4, knowledgeBlocks.chuyenNganh, ETrangThaiHocTap.CHUA_HOC, undefined],
	['AI310', 'Nhập môn trí tuệ nhân tạo', 3, 5, knowledgeBlocks.chuyenNganh, ETrangThaiHocTap.CHUA_HOC, undefined],
	['DB301', 'Cơ sở dữ liệu nâng cao', 3, 5, knowledgeBlocks.chuyenNganh, ETrangThaiHocTap.CHUA_HOC, undefined],
] as const;

export const PREVIEW_TIEN_TRINH_KHUNG: ChuongTrinhDaoTao.IKhoiHocPhanCTDT[] = courseDefinitions.map(
	([ma, ten, soTinChi, soThuTuKy, khoi, hoc, diemChu], index) => ({
		_id: `mock-khoi-hp-${ma}`,
		maHocPhan: ma,
		hocPhan: {
			_id: `mock-hp-${ma}`,
			ma,
			ten,
			soTinChi,
			active: true,
			maLoaiHocPhan: 'BB',
			maDonVi: 'CECS',
		},
		maKhoiKienThuc: khoi.ma,
		khoiKienThuc: {
			_id: `mock-kkt-${khoi.ma}`,
			ma: khoi.ma,
			maKhoiKienThuc: khoi.ma,
			ten: khoi.ten,
			maCha: null,
			soThuTu: khoi.soThuTu,
		},
		loaiHocPhanCtdt: ELoaiHocPhanCTDT.BAT_BUOC,
		soThuTuKy,
		hoc,
		lichSuDiem: diemChu ? [makeGrade(`mock-grade-${index}`, ma, diemChu)] : [],
	}),
) as ChuongTrinhDaoTao.IKhoiHocPhanCTDT[];

export const PREVIEW_TIEN_TRINH_THUC_TE: ChuongTrinhDaoTao.TTienTrinhThucTe[] = PREVIEW_TIEN_TRINH_KHUNG.filter(
	(item) => item.hoc !== ETrangThaiHocTap.CHUA_HOC,
).map((item, index) => {
	const maHocKy =
		item.soThuTuKy === 1 ? '20241' : item.soThuTuKy === 2 ? '20242' : item.soThuTuKy === 3 ? '20251' : '20252';
	const tenHocKy =
		item.soThuTuKy === 1
			? 'Học kỳ 1 - Năm học 2024-2025'
			: item.soThuTuKy === 2
				? 'Học kỳ 2 - Năm học 2024-2025'
				: item.soThuTuKy === 3
					? 'Học kỳ 1 - Năm học 2025-2026'
					: 'Học kỳ 2 - Năm học 2025-2026';

	return {
		_id: `mock-thuc-te-${item.maHocPhan}`,
		hocPhan: item.hocPhan!,
		kyHoc: { ma: maHocKy, ten: tenHocKy },
		lopHocPhan: { ten: `${item.maHocPhan}-01`, soThuTuLop: 1 },
		soTinChi: item.hocPhan?.soTinChi ?? 0,
		maKhoiKienThuc: item.maKhoiKienThuc,
		khoiKienThuc: item.khoiKienThuc,
		hoc: item.hoc,
		lichSuDiem: item.lichSuDiem?.map((grade) => ({ ...grade, maHocKy })),
		isNgoaiCtdt: index === 5,
	};
});

export const PREVIEW_TIEN_TRINH_TOT_NGHIEP = {
	diemTichLuyToiThieu: 2,
	kqhtHocKy: {
		_id: 'mock-kqht-tien-trinh',
		sinhVienSsoId: 'mock-student',
		maHocKy: '20252',
		maSvHk: 'mock-student|20252',
		trungBinhHocKy: 8.5,
		trungBinhHocKyThang4: 3.55,
		trungBinhHocBongHocKyThang4: 3.55,
		tongSoTinChiHocKy: 17,
		tongSoTinChiTichLuyHocKy: 17,
		tongSoTinChiNoHocKy: 0,
		tongSoTinChiHocBongHocKy: 17,
		trungBinhTichLuyToanKhoa: 8.4,
		trungBinhTichLuyToanKhoaThang4: 3.45,
		tongSoTinChiTichLuyToanKhoa: 68,
		tongSoTinChiNoToanKhoa: 0,
		trinhDo: ETrinhDoKqhtHocKy.NAM_THU_2,
		hocLuc: ELoaiHocLuc.GIOI,
		maKhoaNganh: PREVIEW_MA_KHOA_NGANH,
		khoaNganh: {},
	},
	ctdtKeHoach: {
		_id: 'mock-ctdt',
		ma: 'CS-2024',
		ten: 'Cử nhân Khoa học Máy tính - Khóa 2024',
		tenTiengAnh: 'Bachelor of Computer Science - Cohort 2024',
		tongSoTinChi: 124,
	},
} as SinhVien.ITienTrinhTotNghiep;

export const PREVIEW_CHUONG_TRINH_HIEN_TAI = {
	_id: 'mock-ctdt',
	ma: 'CS-2024',
	ten: 'Cử nhân Khoa học Máy tính - Khóa 2024',
	tenTiengAnh: 'Bachelor of Computer Science - Cohort 2024',
	tongSoTinChi: 124,
	nganh: {
		ma: 'CS',
		ten: 'Khoa học Máy tính',
		tenDonViPhuTrach: 'College of Engineering and Computer Science',
	},
} as ChuongTrinhDaoTao.IRecord;

export const PREVIEW_DOT_QUY_DOI = {
	_id: 'mock-dot-quy-doi',
	tenDot: 'Đợt công nhận và quy đổi kết quả học tập 2026',
	thoiGianBatDau: '2026-09-15T00:00:00.000Z',
	thoiGianKetThuc: '2026-10-15T23:59:59.000Z',
};

export const PREVIEW_MINORS: ChuongTrinhDaoTao.TTienTrinhKhungMinor[] = [
	{
		idPhieu: 'preview-minor',
		nganhMinor: { ma: 'DS', tenTiengViet: 'Khoa học dữ liệu', tenTiengAnh: 'Data Science' },
		khoiHpCtList: PREVIEW_TIEN_TRINH_KHUNG.slice(0, 3),
	} as ChuongTrinhDaoTao.TTienTrinhKhungMinor,
];

export const PREVIEW_TIEN_TRINH: ChuongTrinhDaoTao.TTienTrinhKhung = {
	tienTrinh: PREVIEW_TIEN_TRINH_KHUNG,
	minors: PREVIEW_MINORS,
};
