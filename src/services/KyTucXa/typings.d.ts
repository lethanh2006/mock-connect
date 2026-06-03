import { ETrangThaiDuyet, ETrangThaiMinhChung, EGioiTinh, ELoaiKhoanThu } from './constant';

declare module DangKyKyTucXa {
    export interface IToaKTX {
        _id: string;
        ma: string;
        ten: string;
        soPhongKtx?: number;
    }

    export interface ITienIchKTX {
        maDanhMucTienIch: string;
    }

    export interface IDanhMucChung {
		_id: string;
		maLoai: string;
		ma: string;
		ten: string;
	}

    export interface IPhongKTXSinhVien {
        _id: string;
        ma: string;
        ten: string;
        maToaNha: string;
        maGioiTinh?: EGioiTinh;
        soLuongToiDa: number;
        soLuongHienTai: number;

        maLoaiPhongKtx?: string;
        tangThu?: number;
        cachBoTri?: string;
        dienTich?: number;
        moTa?: string;
        danhSachTienIch?: ITienIchKTX[];
        danhSachAnh?: string[];
        maKhoanThuPhong?: string;
        maKhoanThuCoc?: string;

        giaPhong?: number;

        coTheDangKy?: boolean;
        lyDoKhongTheDangKy?: string[];
    }

    export interface IThongTinDangKyKTX {
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
        formDon?: IFormDangKyKTX;
        phong?: IPhongKTXSinhVien;
        ngayChuyenVao?: string;
        ngayChuyenRa?: string;
    }

    export interface IKhoanThuKTX {
        _id: string;
        ten: string;
        loai: ELoaiKhoanThu;
        maMucThu: string;
        unitLabel: string;
        unitAmount: number;
        currency: string;
    }

    export interface IDotDangKyKTX {
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
    }

    export interface IFormDangKyKTX {
        fullName: string
        studentId: string;
        gender: EGioiTinh;
        email: string;
        phoneNumber: string;
        college: string;
        dateOfBirth: string;
        specialRequirements?: string;
        conditionDetails?: string;
        emergencyContactName: string;
        emergencyRelationship: string;
        emergencyContactNumber: string;
        emergencyEmail: string;
        program: string;
        identityNumber: string;
        dateOfIssue: string;
        placeOfIssue: string;
        nationality: string;
        permanentHomeAddress: string;
        haveHealthInsurance: boolean;
        healthInsuranceFile?: string;
        secondaryContactNumber?: string;
        address: string;
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