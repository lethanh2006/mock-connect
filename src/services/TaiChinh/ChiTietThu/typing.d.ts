import type { EMaTrangThaiThanhToan } from '../constant';

declare module ChiTietThu {
	export interface Record {
		_id: string;
		code: string;
		items: IThongTinSanPham[];
		customerId: string;
		customerInfo: IThongTinKhachHang;
		moTa: string; // 'string';
		status: EMaTrangThaiThanhToan; // 'open';
		paidHistory: IThongTinGiaoDich[];
		amountDue: number; // 0;
		amountPaid: number; // 0;
		amountRemaining: number; // 0;
		amountRefund: number; // 0;
		dotThuId: string;
		dotThu?: any;
		productId: string;
		// product?: KhoanThu.Record;
		metadata?: any;
		identityCode: string;
	}

	export interface IThongTinKhachHang {
		customerId: string; // 'string';
		name: string; // 'string';
		cmtCccd: string; // 'string';
		email: string; //'string';
		address: string; // 'string';
		soDienThoai?: string; // 'string';
		dob?: string; // '2000-12-31';
	}

	export interface IThongTinSanPham {
		stt?: number;
		nguonThu: NguonThu.Record; // 'string';
		productId: string;
		productCode?: string;
		productName?: string;
		// product: KhoanThu.Record; // 'string';
		priceId: string;
		// price?: MucThu.Record; // 'string';
		quantity: number; // 0;
		unitAmount: number; // 0;
		unitLabel?: string;
		amountDue?: number; // 0;
		amountPaid?: number; // 0;
		amountRemaining?: number; // 0;
		layTuMucThu: boolean; // true;
	}

	export interface IThongTinGiaoDich {
		transactionId: string; // 'string';
		requestId: string;
		type: 'editPaid' | 'pay' | 'refund'; // 'editPaid';
		paymentType?: 'bank' | 'manual'; // 'bank';
		amountPaid: number; //0;
		soTienDaTra: number;
		nguoiThucHien: {
			userId: string; // 'string';
			username: string;
			hoTen: string; // 'string';
			thongTin?: any; // {};
		};
		transactionDate: string; // '2023-03-09T04:23:27.168Z';
	}

	export type TThongKeCongNo = {
		tongTienPhaiThu: number;
		tongTienConLai: number;
		tongTienDaThu: number;
		tongTienThua: number;
	};
}
