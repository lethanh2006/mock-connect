import type { ELoaiHinhThucThanhToan } from './constant';

declare module HinhThucThanhToan {
	export interface IRecord {
		_id: string;
		/** Tên ngân hàng */
		maNganHang: string;
		/** Tên tài khoản */
		tenNganHang: string;
		loaiKenhThanhToan: ELoaiHinhThucThanhToan;
		isMacDinh: boolean;
		maNganHangVNPay: string;

		// Thanh toán động
		tienToSTK: string;

		// STK cố định
		soTaiKhoanThanhToanCoDinh: string;

		//		linkQR: string;
		huongDanThanhToan: string;
	}
}
