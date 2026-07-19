import type { DotThuTaiChinh } from '../DotThu/typing';
import type { UuDaiThanhToan } from '../UuDaiThanhToan/typing';
import type { EMaTrangThaiThanhToan, ETransactionStatus, ETransactionType } from '../constant';

declare module HoaDon {
	export interface IRecord extends IKhachHang {
		amountPaid?: number;
		totalDebit?: number;
		balance?: number;
		totalDiscount?: number
		_id: string;
		identityCode: string;
		ma?: string;
		name?: string;

		callBackUrl?: string;
		status: EMaTrangThaiThanhToan;
		soTienThue: number;
		idDotThu: string;
		dotThu?: DotThuTaiChinh.IRecord;
		metadata?: Record;
		moTa?: string;

		ngayHetHanThanhToan: string;
		urlBienLai?: string;
		maBienLai?: string;
		billItems?: IBillItem[];

		soTienPhaiThu?: number;
		soTienKhuyenMai?: number;
		soTienConLai?: number;
		soTienDaThu?: number;

		transactions?: ITransaction[];
		loaiTienTe?: string;

		ghiChu?: string;
		virtualBill?: HoaDon.IRecord
	}

	interface IKhachHang {
		userSsoId: string;
		userFullname: string;
		userCode: string;
		userAddress: string;
		userEmail: string;
		userDOB: string;
		userPhone: string;
		userMetadata?: Record;

		userTenKhoa?: string;
		userMaKhoaSinhVien?: string

		userTenNganh?: string;
		userMaNganh?: string;

		userLopHanhChinh?: string;

		userTenTinhChat?: string;
		userMaTinhChat?: string;
		userTrangThaiSV?: string;
		userTrangThaiHoc?: string;
	}

	export interface IBillItem {
		_id: string;
		billIdentityCode?: string;
		// maNguonThu: string;
		ten: string;

		//Khoản thu
		maKhoanThu: string;
		tenKhoanThu: string;

		//Mức thu
		maMucThu: string;
		unitAmount: number;
		unitLabel: string;
		quantity: number;
		heSo: number;

		amountDue: number;
		amountDiscount: number;
		amountPaid: number;
		amountRemaining: number;

		listUserUuDai?: Partial<UuDaiThanhToan.IUuDaiUser>[];
		status: EMaTrangThaiThanhToan;
		createdAt?: Date;
		updatedAt?: Date;
	}

	export interface ITransaction {
		_id: string;
		amount: number;
		isKtxDeposit: boolean
		amountAvailable?: number | null;
		bankName?: string | null;
		billId: string;
		billIdentityCode: string;
		createdAt: string; // Hoặc Date nếu bạn parse thủ công
		createdById?: string | null;
		createdByUsername?: string | null;
		dataPartitionCode?: string | null;
		debitCredit: 'DEBIT' | 'CREDIT' | string;
		deletedById?: string | null;
		deletedByUsername?: string | null;
		externalAlias?: string | null;
		externalIdentityCode?: string | null;
		externalQrCode?: string | null;
		fromAccount: string;
		fullBill: boolean;
		ghiChu: string;
		idDotThu: string;
		idDotThuTruocHocPhi?: string | null;
		identityCode: string;
		identityCodeIn?: string | null;
		isDoiSoat: boolean;
		isManual: boolean;
		loaiTienTe: 'VND' | string;
		manualUserCode: string;
		manualUserEmail?: string | null;
		manualUserFullname: string;
		manualUserPhone?: string | null;
		manualUserSsoId: string;
		mbBillNumber?: string | null;
		name: string;
		phanTramUuDai?: numbẻ
		ngayDoiSoat?: string | null;
		oldTransDate?: string | null;
		paymentType: 'manual' | string;
		requestData?: any | null;
		requestId?: string | null;
		responseData?: any | null;
		shbCreateAliasMsgId?: string | null;
		shbDebtQrCode?: string | null;
		status: ETransactionStatus
		toAccount: string;
		transactionDate?: string | null;
		transactionId?: string | null;
		type: ETransactionType
		updatedAt: string;
		updatedById?: string | null;
		updatedByUsername?: string | null;
		userAddress?: string | null;
		userCode: string;
		userCodeClose?: string | null;
		userDOB?: string | null;
		userEmail: string;
		userFullname: string;
		userFullnameClose?: string | null;
		userIdClose?: string | null;
		userLopHanhChinh?: string | null;
		userMaKhoaSinhVien: string;
		userMaNganh: string;
		userMetadata?: any | null;
		userPhone?: string | null;
		userSsoId: string;
		userUuDaiBillId?: string | null;
		vnpayTransactionNo?: string | null;

		maKhoanThu?: string;
		tenKhoanThu?: string;
		maMucThu?: string;
		tenMucThu?: string;
		maKyHoc?: string;
		tenKyHoc?: string;
		donGia?: number;

		soLuong?: number;
		quantity?: number
		ten?: string;
		unitLabel?: string;
		unitAmount?: number;
	}

	export interface IThongTinHoaDon {
		_id: string;
		userSsoId: string;
		userFullName: string;
		userCode: string;
		tenToChuc: string;
		maSoThue: string;
		diaChi: string;
		emailNhanHoaDonDienTu: string;
		userSoDienThoai: string;
		userMaKhoa: string;
		userTenKhoa: string;
		userMaNganh: string;
		userTenNganh: string;
	}
}
