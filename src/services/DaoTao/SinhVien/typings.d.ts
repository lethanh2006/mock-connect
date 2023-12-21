import type { KetQuaHocKy } from '@/services/HocTap/KetQuaHocKy/typing';
import type { ChungChi } from '../ChungChi/typing';
import { type ChuongTrinhDaoTao } from '../DanhMucHeThong/ChuongTrinhDaoTao/typings';
import { type ELoaiDiemChu } from '../KetQuaHocTap/constant';
import { type EGioiTinh, type EHinhThucTuyenDung, type ENoiNgoaiTru, type EViTriViecLam } from '../constant';

declare module SinhVien {
	export interface IRecord {
		_id: string;
		ssoId: string;
		trangThaiHoc?: string;
		anhDaiDienUrl: string;
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

		loaiNoiSinh: string;
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

		loaiKhuyetTat: string;
		canNang: number;
		chieuCao: number;
		soTaiKhoanNganHang: string;
		tenNganHang: string;
		chiNhanhNganHang: string;
		soBaoHiemSinhVien: string;
		maBenhVienKhamChuaBenh: string;

		tenGiamHo: string;
		ngaySinhGiamHo: string;
		ngheNghiepGiamHo: string;
		soDienThoaiGiamHo: string;
		emailGiamHo: string;
		noiCongTacGiamHo: string;
		nguyenQuanGiamHo: string;
		diaChiGiamHo: string;
		tenChuHo: string;

		chaDaMat: boolean;
		tenCha: string;
		ngaySinhCha: string;
		soDienThoaiCha: string;
		ngheNghiepCha: string;
		emailCha: string;
		noiCongTacCha: string;
		nguyenQuanCha: string;
		diaChiCha: string;

		meDaMat: boolean;
		tenMe: string;
		ngaySinhMe: string;
		soDienThoaiMe: string;
		ngheNghiepMe: string;
		emailMe: string;
		noiCongTacMe: string;
		nguyenQuanMe: string;
		diaChiMe: string;

		tenVoChong: string;
		ngheNghiepVoChong: string;
		diaChiVoChong: string;
		soDienThoaiVoChong: string;
		emailVoChong: string;
		thongTinAnhChiEm: string;
		thongTinCacCon: string;

		maKhoaNganh?: string;
		khoaNganh: {
			khoaSinhVien: KhoaSinhVien.IRecord;
			nganh: NganhDaoTao.IRecordCoSo;
			ten: string;
		};
		maKhoaSinhVien: string;
		khoaSinhVien?: KhoaSinhVien.IRecord;
		lopHanhChinhList?: LopHanhChinh.IRecord[];
		maNganh: string;
		nganh?: NganhDaoTao.IRecordCoSo;
		maTrinhDo: string;
		maHinhThuc: string;
		maChuongTrinhDaoTao: string;
	}

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
