import type { KetQuaHocKy } from '@/services/HocTap/KetQuaHocKy/typing';
import type { ChungChi } from '../ChungChi/typing';
import { type ChuongTrinhDaoTao } from '../DanhMucHeThong/ChuongTrinhDaoTao/typings';
import { type ELoaiDiemChu } from '../KetQuaHocTap/constant';
import type { KhoaNganh } from '../KhoaNganh/typing';
import type { ETrangThaiHocSv, EGioiTinh, EHinhThucTuyenDung, ENoiNgoaiTru, EViTriViecLam } from '../constant';

declare module SinhVien {
	export interface IRecord {
		_id: string;
		ssoId: string;
		trangThaiHoc?: ETrangThaiHocSv; //Trạng thái học tổng
		trangThaiHocNganh1?: ETrangThaiHocSv;
		trangThaiHocNganh2?: ETrangThaiHocSv;
		anhDaiDienUrl?: string | null;
		ma: string;
		ten: string;
		firstName: string;
		lastName: string;
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

		thanhVienGiaDinh?: TThongTinGiaDinh[];

		maKhoaNganh?: string;
		maNganh: string;
		maKhoaSinhVien: string;
		khoaNganh?: KhoaNganh.IRecord;
		nganh?: NganhDaoTao.IRecordCoSo;
		khoaSinhVien?: KhoaSinhVien.IRecord;

		// SONG NGÀNH
		maKhoaNganh2?: string;
		maNganh2?: string;
		maKhoaSinhVien2?: string;
		khoaNganh2: KhoaNganh.IRecord;
		nganh2: NganhDaoTao.IRecordCoSo;
		khoaSinhVien2: KhoaSinhVien.IRecord;

		lopHanhChinhList?: LopHanhChinh.IRecord[];
		maTrinhDo: string;
		maHinhThuc: string;
		maChuongTrinhDaoTao: string;

		// Thông tin tuyển sinh
		doiTuongDauVao: string;
		diemTrungTuyen: number;
		soQuyetDinhTrungTuyen: string;
		ngayKyQuyetDinhTrungTuyen: string;
		ngayNhapHoc: string;
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

	export interface IHocBongSinhVien {
		_id: string;
		sinhVienSsoId: string;
		sinhVien?: IRecord;
		ten: string;
		donViTaiTro: string;
		thoiGianTraoTangHocBong: string;
		loaiHocBongId: string;
		loaiHocBong?: LoaiHocBong.IRecord;
		giaTriHocBong: number;
	}

	export interface IKhenThuongSinhVien {
		_id: string;
		sinhVienSsoId: string;
		sinhVien?: IRecord;
		namKhenThuong: number;
		soQuyetDinhKhenThuong: string;
		danhHieuThiDuaGiaiThuongKhenThuong: string;
		capKhenThuong: string;
		loaiDanhHieuThiDuaGiaiThuongKhenThuong: string;
		phuongThucKhenThuong: string;
	}

	export interface IKyLuatSinhVien {
		_id: string;
		sinhVienSsoId: string;
		sinhVien?: IRecord;
		capQuyetDinh: string;
		soQuyetDinh: string;
		ngayQuyetDinh: string;
		namBiKyLuat: number;
		lyDo: string;
		loaiKyLuat: string;
	}

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
		maChungChi: string;
		chungChi?: ChungChi.IRecord;
		ngayCap?: string;
		donViCap?: string;
		diem?: number;
		// ten?: string;
		// loaiThoiHan?: ELoaiThoiHanChungChi;
		// ngayHetHan?: string;
		// duDkDauRa?: boolean;
	}

	export interface ITienTrinhTotNghiep {
		diemTichLuyToiThieu: number;
		thongTinCdr?: ChuongTrinhDaoTao.IChungChiCTDT[];
		kqhtHocKy?: KetQuaHocKy.IRecord;
		ctdtKeHoach?: ChuongTrinhDaoTao.IRecord;
	}

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
		sinhVien?: SinhVien.IRecord;
		maSinhVien?: string;
		tenSinhVien?: string;
		noTaiChinh?: boolean;
		noThuVien?: boolean;

		dotXetTotNghiepId: string;
		dotXetTotNghiep?: IRecord;
	}
}
