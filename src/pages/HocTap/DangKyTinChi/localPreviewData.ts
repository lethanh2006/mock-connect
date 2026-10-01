import {
	ELoaiHocPhanDangKyTinChi,
	ETinhChatDangKyTC,
	ETrangThaiDangKyTinChi,
	ETrangThaiSinhVienDKTinChi,
} from '@/services/DaoTao/DangKyTinChi/constant';
import type { DangKyTinChi } from '@/services/DaoTao/DangKyTinChi/typing';
import { TrangThaiDonDangKyHocDuThinh } from '@/services/DaoTao/DkDuThinh/constant';
import { TrangThaiDonDangKyHocVuot } from '@/services/DaoTao/DkVuotTinChi/constant';
import { ELoaiLopHocPhan, ETrangThaiLopHocPhan } from '@/services/HocTap/LopHocPhan/constant';
import type { LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import dayjs from '@/utils/dayjs';

const makeLopHocPhan = ({
	id,
	maHocPhan,
	tenHocPhan,
	soTinChi,
	maLop,
	thu,
	tietBatDau,
	phongHoc,
	giangVien,
	siSo = 28,
	siSoToiDa = 40,
}: {
	id: string;
	maHocPhan: string;
	tenHocPhan: string;
	soTinChi: number;
	maLop: string;
	thu: number;
	tietBatDau: number;
	phongHoc: string;
	giangVien: string;
	siSo?: number;
	siSoToiDa?: number;
}): LopHocPhan.IRecord =>
	({
		_id: id,
		ten: maLop,
		maLop,
		maHocKy: 'MOCK_HOC_KY',
		maHocPhan,
		hocPhan: {
			_id: `hp-${maHocPhan}`,
			ma: maHocPhan,
			ten: tenHocPhan,
			soTinChi,
			active: true,
			maLoaiHocPhan: 'BB',
			maDonVi: 'CECS',
			loaiHocPhan: {
				_id: 'loai-bat-buoc',
				ma: 'BB',
				ten: 'Bắt buộc',
				isTinhDiem: true,
				isTinhSoTinChiDangKy: true,
				isTinhSoTinChiTichLuy: true,
			},
		},
		siSo,
		siSoToiDa,
		loai: ELoaiLopHocPhan.CHINH,
		soThuTuLop: 1,
		trangThaiLop: ETrangThaiLopHocPhan.MO,
		chotTkb: true,
		maHinhThuc: 'CQ',
		maTinhChat: 'BINH_THUONG',
		dangKyTinChi: true,
		nhanSuList: [{ _id: `gv-${id}`, tenNhanSu: giangVien }],
		maHoaLichHoc: [
			{
				thu,
				tietBatDau,
				soTiet: 3,
				gioBatDau: tietBatDau <= 3 ? '08:00' : tietBatDau <= 6 ? '13:00' : '15:30',
				gioKetThuc: tietBatDau <= 3 ? '10:30' : tietBatDau <= 6 ? '15:30' : '18:00',
				phongHoc,
				danhSachTuan: [],
			},
		],
		thoiKhoaBieuList: [
			{
				_id: `tkb-${id}-1`,
				tenLopHocPhan: maLop,
				ngay: '2026-10-05T00:00:00.000Z',
				nhomTietHocId: 'mock-ca-hoc',
				tietBatDau,
				tietKetThuc: tietBatDau + 2,
				phongHoc,
			},
			{
				_id: `tkb-${id}-2`,
				tenLopHocPhan: maLop,
				ngay: '2027-01-16T00:00:00.000Z',
				nhomTietHocId: 'mock-ca-hoc',
				tietBatDau,
				tietKetThuc: tietBatDau + 2,
				phongHoc,
			},
		],
	}) as unknown as LopHocPhan.IRecord;

const lopHocPhanList = [
	makeLopHocPhan({
		id: 'mock-lhp-cs201',
		maHocPhan: 'CS201',
		tenHocPhan: 'Cấu trúc dữ liệu và giải thuật',
		soTinChi: 4,
		maLop: 'CS201-01',
		thu: 2,
		tietBatDau: 1,
		phongHoc: 'I201',
		giangVien: 'TS. Nguyễn Minh Anh',
	}),
	makeLopHocPhan({
		id: 'mock-lhp-ma203',
		maHocPhan: 'MA203',
		tenHocPhan: 'Xác suất và thống kê',
		soTinChi: 3,
		maLop: 'MA203-02',
		thu: 4,
		tietBatDau: 4,
		phongHoc: 'C302',
		giangVien: 'PGS. Trần Thu Hà',
	}),
	makeLopHocPhan({
		id: 'mock-lhp-eng202',
		maHocPhan: 'ENG202',
		tenHocPhan: 'Academic English 2',
		soTinChi: 3,
		maLop: 'ENG202-03',
		thu: 6,
		tietBatDau: 7,
		phongHoc: 'G205',
		giangVien: 'Ms. Emily Carter',
	}),
	makeLopHocPhan({
		id: 'mock-lhp-cs301',
		maHocPhan: 'CS301',
		tenHocPhan: 'Cơ sở dữ liệu',
		soTinChi: 4,
		maLop: 'CS301-01',
		thu: 3,
		tietBatDau: 1,
		phongHoc: 'I204',
		giangVien: 'TS. Lê Hoàng Nam',
	}),
	makeLopHocPhan({
		id: 'mock-lhp-se220',
		maHocPhan: 'SE220',
		tenHocPhan: 'Kỹ nghệ phần mềm',
		soTinChi: 3,
		maLop: 'SE220-01',
		thu: 5,
		tietBatDau: 4,
		phongHoc: 'I305',
		giangVien: 'ThS. Phạm Gia Bảo',
	}),
	makeLopHocPhan({
		id: 'mock-lhp-ai310',
		maHocPhan: 'AI310',
		tenHocPhan: 'Nhập môn trí tuệ nhân tạo',
		soTinChi: 3,
		maLop: 'AI310-02',
		thu: 7,
		tietBatDau: 1,
		phongHoc: 'I202',
		giangVien: 'TS. Võ Thanh Tùng',
		siSo: 40,
		siSoToiDa: 40,
	}),
	makeLopHocPhan({
		id: 'mock-lhp-ba210',
		maHocPhan: 'BA210',
		tenHocPhan: 'Phân tích nghiệp vụ',
		soTinChi: 3,
		maLop: 'BA210-01',
		thu: 2,
		tietBatDau: 4,
		phongHoc: 'I303',
		giangVien: 'ThS. Đỗ Ngọc Linh',
	}),
	makeLopHocPhan({
		id: 'mock-lhp-net205',
		maHocPhan: 'NET205',
		tenHocPhan: 'Mạng máy tính',
		soTinChi: 3,
		maLop: 'NET205-02',
		thu: 3,
		tietBatDau: 7,
		phongHoc: 'I402',
		giangVien: 'TS. Nguyễn Quốc Khánh',
	}),
	makeLopHocPhan({
		id: 'mock-lhp-web220',
		maHocPhan: 'WEB220',
		tenHocPhan: 'Phát triển ứng dụng Web',
		soTinChi: 3,
		maLop: 'WEB220-01',
		thu: 5,
		tietBatDau: 1,
		phongHoc: 'I405',
		giangVien: 'ThS. Vũ Thu Trang',
	}),
	makeLopHocPhan({
		id: 'mock-lhp-ux201',
		maHocPhan: 'UX201',
		tenHocPhan: 'Thiết kế trải nghiệm người dùng',
		soTinChi: 2,
		maLop: 'UX201-03',
		thu: 6,
		tietBatDau: 4,
		phongHoc: 'C205',
		giangVien: 'ThS. Phan Hà My',
	}),
];

export const createDangKyTinChiPreviewData = (maHocKy = '20261') => {
	const dotDangKyHienTai: DangKyTinChi.IDotDangKy = {
		_id: 'mock-dot-dang-ky-20261',
		ten: 'Đợt đăng ký tín chỉ học kỳ chính',
		maHocKy,
		kichHoat: true,
		tinhChatDangKy: ETinhChatDangKyTC.DANG_KY_XOA,
		thoiGianBatDau: dayjs().subtract(7, 'day').toISOString(),
		thoiGianKetThuc: dayjs().add(14, 'day').toISOString(),
		allowNhuCau: true,
		allowTienTrinh: true,
		allowHocLai: true,
		allowHocCaiThien: true,
		allowHocVuot: true,
		allowChuaTheoTienTrinh: true,
		allowNgoaiChuongTrinh: true,
		choPhepDangKyVuotTinChi: true,
		choPhepDangKyDuThinh: true,
		boLocTatCa: true,
		boLocKhoaNganh: true,
		boLocLopHanhChinh: true,
	};

	const phieuDangKy: DangKyTinChi.IPhieuDangKy = {
		_id: 'mock-phieu-dang-ky',
		idDotDangKyTinChi: dotDangKyHienTai._id,
		sinhVienSsoId: 'mock-student',
		maHocKy,
		soTinChiDaDk: 10,
		soTinChiToiThieu: 12,
		soTinChiToiDa: 24,
		soTinChiToiDaSongNganh: 30,
		maSvHk: `mock-student|${maHocKy}`,
		lopHpSvList: [],
	};

	const sinhVienDot = {
		_id: 'mock-sinh-vien-dot',
		dotDangKyTinChiId: dotDangKyHienTai._id,
		dotDangKyTinChi: dotDangKyHienTai,
		sinhVienSsoId: 'mock-student',
		sinhVien: {},
		maHocKy,
		ghiChu: undefined,
		trangThaiSvDangKyTinChi: ETrangThaiSinhVienDKTinChi.DUOC_DK,
		hoTen: 'Nguyễn Văn An',
		maSinhVien: 'V202400001',
	} as DangKyTinChi.ISinhVienDotDangKy;

	const danhSachLopDktc = lopHocPhanList.map((item) => ({ ...item, maHocKy }));
	const danhSachLopDangKy = danhSachLopDktc.slice(0, 5).map(
		(item, index) =>
			({
				...item,
				soTinChi: item.hocPhan?.soTinChi ?? 0,
				loai: ELoaiHocPhanDangKyTinChi.TIEN_TRINH,
				loaiLop: item.loai,
				trangThai: ETrangThaiDangKyTinChi.DA_DANG_KY,
				maKhoaNganh: 'CS_2024',
				dangKyHocDuThinh:
					index === 3
						? {
								_id: 'preview-audit',
								trangThai: TrangThaiDonDangKyHocDuThinh.DA_DUYET,
								nguoiDuyet: 'Dr. Nguyen Minh Anh',
								thoiGianDuyet: dayjs().subtract(1, 'day').toISOString(),
								ghiChuDuyet: 'Approved for auditing this semester.',
							}
						: undefined,
				dkVuotTinChiLop:
					index === 4
						? {
								_id: 'preview-overload',
								trangThai: TrangThaiDonDangKyHocVuot.CHO_DUYET,
							}
						: undefined,
				createdAt: dayjs()
					.subtract(index + 1, 'day')
					.toDate(),
			}) as DangKyTinChi.ILopDangKy,
	);

	return {
		hocKy: {
			ma: maHocKy,
			ten: 'Semester 1 · 2026–2027',
			soTuan: 16,
			thoiGianBatDau: '2026-09-01T00:00:00.000Z',
		},
		dotDangKyHienTai,
		phieuDangKy,
		sinhVienDot,
		danhSachLopDktc,
		danhSachLopDangKy,
	};
};

export type TDangKyTinChiPreviewData = ReturnType<typeof createDangKyTinChiPreviewData>;
