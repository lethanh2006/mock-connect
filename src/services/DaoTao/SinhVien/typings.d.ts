import type { KetQuaHocKy } from '@/services/HocTap/KetQuaHocKy/typing';
import type { DotXetTotNghiep } from '@/services/HocTap/XetTotNghiep/typing';
import type { ChungChi } from '../ChungChi/typing';
import type { ChuongTrinhDaoTao } from '../ChuongTrinhDaoTao/typing';
import { type ELoaiDiemChu } from '../KetQuaHocTap/constant';
import { type LopHanhChinh } from '../NamHoc/LopHanhChinh/typings';
import { type ETrangThaiHocSv } from '../constant';
import type {
	EGioiTinh,
	EHinhThucTuyenDung,
	ELoaiNoiSinh,
	ELoaiThanhVienGiaDinh,
	ENoiNgoaiTru,
	ETrangThaiThanhVienGiaDinh,
	EViTriViecLam,
} from './constant';
import type { ETrangThaiChungChiSinhVen } from './constants';

declare module SinhVien {
	export interface IRecord {
		_id: string;
		ssoId: string;
		trangThaiHoc?: ETrangThaiHocSv;
		anhDaiDienUrl?: string | null;
		ma: string;
		ten: string;
		firstName: string;
		lastName: string;
		choPhepSua: boolean;
		gioiTinh: EGioiTinh;

		quocTich: string;
		danToc: string;
		tonGiao: string;
		ngaySinh: string;
		cccd: string;
		noiCapCccd: string;
		ngayCapCccd: string;
		soDienThoai: string;
		email: string;
		// soDienThoai2: string;
		// email2: string;
		// nguoiLienLac: string;
		// soDienThoaiNguoiLienLac: string;

		loaiNoiSinh: ELoaiNoiSinh;
		quocGiaNoiSinh: string;
		tinhTpNoiSinh: string;
		// quanHuyenNoiSinh: string;
		// xaPhuongNoiSinh: string;

		tinhTpQueQuan: string;
		quanHuyenQueQuan: string;
		xaPhuongQueQuan: string;
		// soNhaTenDuongQueQuan: string;

		tinhTpThuongTru: string;
		quanHuyenThuongTru: string;
		xaPhuongThuongTru: string;
		soNhaTenDuongThuongTru: string;

		// laDoanVien: boolean;
		ngayVaoDoan: string;
		// daHocLopCamTinhDang: boolean;
		// laDangVien: boolean;
		ngayVaoDang: string;
		ngayVaoDangChinhThuc: string;

		soTaiKhoanNganHang: string;
		tenNganHang: string;
		chiNhanhNganHang: string;

		loaiKhuyetTat: string;
		canNang: number;
		chieuCao: number;
		soBaoHiemSinhVien: string;
		maBenhVienKhamChuaBenh: string;

		// tenGiamHo: string;
		// ngaySinhGiamHo: string;
		// ngheNghiepGiamHo: string;
		// soDienThoaiGiamHo: string;
		// emailGiamHo: string;
		// noiCongTacGiamHo: string;
		// nguyenQuanGiamHo: string;
		// diaChiGiamHo: string;
		// tenChuHo: string;

		// trangThaiCha: ETrangThaiThanhVienGiaDinh;
		// tenCha: string;
		// namSinhCha: number;
		// soDienThoaiCha: string;
		// ngheNghiepCha: string;
		// emailCha: string;
		// noiCongTacCha: string;
		// nguyenQuanCha: string;
		// diaChiCha: string;

		// trangThaiMe: ETrangThaiThanhVienGiaDinh;
		// tenMe: string;
		// namSinhMe: number;
		// soDienThoaiMe: string;
		// ngheNghiepMe: string;
		// emailMe: string;
		// noiCongTacMe: string;
		// nguyenQuanMe: string;
		// diaChiMe: string;

		// tenVoChong: string;
		// ngheNghiepVoChong: string;
		// diaChiVoChong: string;
		// soDienThoaiVoChong: string;
		// emailVoChong: string;
		// thongTinAnhChiEm: string;
		// thongTinCacCon: string;
		thanhVienGiaDinh?: TThongTinGiaDinh[];

		maKhoaNganh?: string;
		khoaNganh?: KhoaNganh.IRecord;
		maKhoaSinhVien: string;
		khoaSinhVien?: KhoaSinhVien.IRecord;
		maNganh: string;
		nganh?: NganhDaoTao.IRecordCoSo;

		// SONG NGÀNH
		maKhoaNganh2?: string;
		maKhoaSinhVien2?: string;
		maNganh2?: string;
		hoKhauThuongTru: TDiaChi;
		lopHanhChinhList?: LopHanhChinh.IRecord[];
		maTrinhDo: string;
		trinhDoDaoTao: TrinhDoDaoTao.IRecordCoSo;
		maHinhThuc: string;

		// Thông tin tuyển sinh
		doiTuongDauVao: string;
		diemTrungTuyen: number;
		soQuyetDinhTrungTuyen: string;
		ngayKyQuyetDinhTrungTuyen: string;
		ngayNhapHoc: string;

		//Kết quả học tập tích lũy
		kqhtTichLuy?: KetQuaHocKy.IKetQuaTichLuy;
	}

	export type TThongTinGiaDinh = {
		key?: number;
		loaiThanhVien: ELoaiThanhVienGiaDinh;
		trangThaiThanhVien: ETrangThaiThanhVienGiaDinh;
		hoDem?: string;
		ten?: string;
		ngaySinh?: string;
		namSinh?: number;

		quocTich?: string;
		danToc?: string;
		tonGiao?: string;

		soDienThoai?: string;
		email?: string;
		ngheNghiep?: string;
		coQuanCongTac?: string;
		diaChiHienNay?: TDiaChi;
		hoKhauThuongTru?: TDiaChi;
		soTheBHYT?: string;
		hoatDongChinhTriXaHoi?: string;
	};

	export type TDiaChi = {
		maTP: string;
		tenTP: string;
		maQH: string;
		tenQH: string;
		maXaPhuong: string;
		tenXaPhuong: string;
		diaChi?: string;
	};

	export interface INoiTruSinhVien {
		_id: string;
		sinhVienSsoId: string;
		sinhVien?: IRecord;
		maKyHoc: string;
		tinhTrang: ENoiNgoaiTru;
		diaChi: string;
		thoiGianKhaiBao: string;
	}

	export interface IViecLamSinhVien {
		_id: string;
		sinhVienSsoId: string;
		sinhVien?: IRecord;
		donViTuyenDung: string;
		hinhThucTuyenDung: EHinhThucTuyenDung;
		thoiGianTuyenDung: string;
		viTriViecLam: EViTriViecLam;
		mucLuongKhoiDiem: number;
		soDienThoaiLh: string;
		email: string;
	}

	export interface IThongTinHocTapHienTai {
		chuongTrinhDaoTao: ChuongTrinhDaoTao.IRecord;
		daoTaoTuNam: string; //"2023-04-28T07:06:57.151Z"
		diemTbtl4: number;
		diemTbtl10: number;
		diemTbtlChu: ELoaiDiemChu;
		hinhThucDaoTao: HinhThucDaoTao.IRecordCoSo;
		khoaSinhVien: KhoaSinhVien.IRecord;
		loaiHocVien: string; //"Sinh viên",
		lopHanhChinh: LopHanhChinh.IRecord;
		nganhDaoTao: NganhDaoTao.IRecordCoSo;
		sinhVienNamThu: string; //"Sinh viên năm nhất"
		soNamDaoTao: number;
		trangThaiSinhVien: string; //"Đang học"
	}

	export interface IChungChiSinhVien {
		_id: string;
		sinhVienSsoId: string;
		sinhVien?: IRecord;
		maSinhVien?: string;
		hoTen?: string;

		maChungChi: string;
		chungChi?: ChungChi.IRecord;
		ngayCap?: string;
		donViCap?: string;
		diem?: number;
		ghiChu: string;
		// ten?: string;
		// loaiThoiHan?: ELoaiThoiHanChungChi;
		// ngayHetHan?: string;
		// duDkDauRa?: boolean;
		trangThaiDuyet: ETrangThaiChungChiSinhVen;
		urlMinhChung: string | null;
	}

	export interface ITienTrinhTotNghiep {
		diemTichLuyToiThieu: number;
		thongTinCdr?: TChungChiDauRaSv[];
		kqhtHocKy?: KetQuaHocKy.IRecord;
		ctdtKeHoach?: ChuongTrinhDaoTao.IRecord;
	}

	export type TChungChiDauRaSv = ChuongTrinhDaoTao.IChungChiCTDT & {
		/** Chứng chỉ sinh viên đã đạt và còn hiệu lực */
		chungChiDaDat: ChungChi.IRecord[];
		/** Có đủ điều kiện đầu ra hay ko? */
		datChuanDauRa: boolean;
	};

	export type TDieuKienTotNghiep = {
		isDuDieuKienTBC: boolean;
		isDuDieuKienChungChi: boolean;
		phanTramTinChi: number;
		isDuKieuKien: boolean;
		noTaiChinh?: boolean;
		noThuVien?: boolean;
	};

	export interface ISinhVienNoNghiaVu {
		_id: string;
		sinhVienSsoId: string;
		sinhVien?: IRecord;
		maSinhVien?: string;
		tenSinhVien?: string;
		noTaiChinh?: boolean;
		noThuVien?: boolean;

		dotXetTotNghiepId: string;
		dotXetTotNghiep?: DotXetTotNghiep.IRecord;
	}

	export type TThongKeTrangThai = {
		baoLuu: number;
		dangHoc: number;
		thoiHoc: number;
		totNghiep: number;
	};
}
