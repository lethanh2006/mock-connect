import { ETrangThaiDuyet, ETrangThaiMinhChung, EGioiTinh, ELoaiKhoanThu } from './constant';

declare module KyTucXa {
    export interface IToa {
        _id: string;
        ma: string;
        ten: string;
        soPhongKtx?: number;
    }

    export interface ITienIch {
        maDanhMucTienIch: string;
    }

    export interface IDanhMucChung {
		_id: string;
		maLoai: string;
		ma: string;
		ten: string;
        anh?: string;
	}

    export interface IPhong {
        _id: string;
        ma: string;
        ten: string;
        maToaNha: string;
        toaNha?: IToa;
        maGioiTinh?: EGioiTinh;
        soLuongToiDa: number;
        soLuongHienTai: number;
        maLoaiPhongKtx?: string;
        tangThu?: number;
        cachBoTri?: string;
        dienTich?: number;
        soPhongTam?: number;
        moTa?: string;
        danhSachTienIch?: ITienIch[];
        danhSachAnh?: string[];
        maKhoanThuPhong?: string;
        maKhoanThuCoc?: string;
        giaPhong?: number;
        coTheDangKy?: boolean;
        lyDoKhongTheDangKy?: string[];
    }

    export interface IThongTinDangKy {
        _id: string;
        maDotId?: string;
        maPhong?: string;
        nguoiTaoMa?: string;
        nguoiTaoHoTen?: string;
        nguoiTaoSsoId?: string;
        identityCode?: string;
        thoiHanThanhToan?: string;
        urlMinhChung?: string;
        trangThaiMinhChung?: ETrangThaiMinhChung;
        trangThaiDuyet?: ETrangThaiDuyet;
        createdAt?: string;
        updatedAt?: string;
        formDon?: IFormDangKy;
        phong?: IPhong;
    }

    export interface IKhoanThu {
        _id: string;
        ten: string;
        loai: ELoaiKhoanThu;
        maMucThu: string;
        unitLabel: string;
        unitAmount: number;
        currency: string;
    }

    export interface IDotDangKy {
        _id: string;
        tenDot: string;
        maHocKy: string;
        thoiGianBatDau: string;
        thoiGianKetThuc: string;
        maKhoaNganh: string[];
        ghiChu: string;
        soLuongDon: number;
        danhSachToaNha: string[];
        danhSachPhong?: string[];
        ngayChuyenVao: string;
        ngayChuyenRa: string;
    }

    export interface IEmergencyContacts {
        emergencyContactName: string,
        emergencyRelationship: string,
        emergencyContactNumber: string,
        secondaryContactNumber: string,
        emergencyEmail: string,
        address: string
    }

    export interface IFormDangKy {
        fullName: string
        studentId: string;
        gender: EGioiTinh;
        email: string;
        phoneNumber: string;
        college: string;
        dateOfBirth: string;
        program: string;
        identityNumber: string;
        dateOfIssue: string;
        placeOfIssue: string;
        nationality: string;
        permanentHomeAddress: string;
        emergencyContacts: IEmergencyContacts[];
    }

    export interface INganhHoc {
        ten: string
    }

    export interface IKhoaSinhVien {
        ten: string
    }

    export interface IQuocTich {
        _id: string;
        ma: string;
        tenQuocTich: string;
    }

    export interface IThongTinSinhVien {
        ten: string;
        ma: string;
        email: string;
        ngaySinh: string;
        gioiTinh: EGioiTinh;
        nganh: INganhHoc;
        khoaSinhVien: IKhoaSinhVien;
        quocTich: string;
        cccd: string;
        noiCapCccd: string;
        ngayCapCccd: string;
        soDienThoai: string;
        hoKhauThuongTru: string;
        nguoiLienLac: string;
        soDienThoaiNguoiLienLac: string;
        thanhVienGiaDinh: string;
    }
}