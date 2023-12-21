import { type ETrangThaiThanhToan } from '../constant';

declare module ThanhToan {
	export interface Price {
		currency: string;
		active: boolean;
		_id: string;
		name: string;
		product: string;
		unitAmount: number;
		createdAt: string;
		updatedAt: string;
	}

	export interface Product {
		prices: Price[];
		active: boolean;
		_id: string;
		code: string;
		name: string;
		metaData: {
			source: string;
		};
		unitLabel: string;
		createdAt: string;
		updatedAt: string;
		currentPrice: Price;
	}

	export interface Item {
		_id: string;
		priceId: string;
		quantity: number;
		productCode: string;
		productId: string;
		productName: string;
		unitAmount: number;
		unitLabel: string;
	}

	export interface PaidHistory {
		amountPaid: number;
		nguoiThucHien: {
			hoTen: string;
			userId: string;
			username: string;
			_id: string;
		};
		paymentType: string;
		transactionDate: string;
		transactionId: string;
		type: string;
		_id: string;
	}

	export interface KhachHang {
		customerId: string;
		name: string;
		email: string;
		address: string;
		cmtCccd: string;
		soDienThoai: string;
		dob: string;
	}

	export interface Invoice {
		_id: string;
		code: string;
		customerInfo: KhachHang;
		items: Item[];
		paidHistory: PaidHistory[];
		identityCode: string;

		amountPaid: number;
		amountDue: number;
		amountRemaining: number;
		amountRefund: number;
		soTienThue?: number;

		dotThu?: any;
		metadata: {
			loai: string;
			mocThoiGian?: string;
			thongTinChiTiet?: any[];
			[x: string]: string;
		};
		moTa?: string;
		dot?: string;
		ngayHetHanThanhToan?: string;
		urlBienLai?: string;
		maBienLai?: string;

		status: ETrangThaiThanhToan;
		transactionDate: string;
		createdAt: string;
		updatedAt: string;
	}

	export interface PostInvoice {
		loaiThanhToan: string;
		mocThoiGian?: string;
		maSinhVien: string;
		soTienPhaiThu: number;
		thongTinChiTiet: any[];
		hinhThucDaoTaoId: string;
		phamVi: string;
	}

	export interface ThongKeInvoice {
		totalDue: number;
		totalRemaining: number;
		totalPaid: number;
		totalRefund: number;
	}

	export interface RecordResponseImport {
		maSinhVien: string;
		ghiChu: string;
	}

	export interface ResponseImportInvoice {
		listKhongHopLe: RecordResponseImport[];
		listHopLe: RecordResponseImport[];
	}
}
