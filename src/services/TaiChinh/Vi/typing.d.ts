import type { ELoaiGiaoDichVi, ETrangThaiYeuCauRutTien } from './constant';

declare module Vi {
	export interface IRecord {
		_id: string;
		userSsoId: string;
		userCode?: string;
		userFullname?: string;
		userEmail?: string;
		userPhone?: string;
		soDu?: number;
		currency?: string;
		active?: boolean;

		createdAt?: Date;

		updatedAt?: Date;
	}

	/** Yêu cầu rút tiền từ ví do sinh viên gửi lên, chờ chuyên viên duyệt */
	export interface IYeuCauRutTien {
		_id: string;
		viId?: string;
		userSsoId: string;
		userCode?: string;
		userName?: string;
		soDienThoai?: string;

		/** Số tiền rút, backend tự lấy toàn bộ số dư khả dụng của ví tại thời điểm tạo đơn */
		soTienRut: number;

		/** Thông tin tài khoản nhận tiền */
		soTaiKhoanNganHang: string;
		tenNganHang: string;
		chiNhanhNganHang?: string;

		/** Lý do sinh viên điền khi gửi yêu cầu */
		lyDoSinhVien?: string;

		trangThai: ETrangThaiYeuCauRutTien;
		/** Ghi chú của chuyên viên / lý do từ chối */
		lyDo?: string;
		/** Chuyên viên đã thực hiện chuyển tiền hay chưa */
		isDaChuyenTien?: boolean;
		/** Link minh chứng chuyển khoản do chuyên viên đính kèm */
		minhChung?: string;

		createdAt?: Date;

		updatedAt?: Date;
	}

	export type TYeuCauRutTienPayload = Pick<
		IYeuCauRutTien,
		'soTaiKhoanNganHang' | 'tenNganHang' | 'chiNhanhNganHang' | 'soDienThoai' | 'lyDoSinhVien'
	>;

	export interface IGiaoDich {
		_id: string;
		viId: string;
		vi?: IRecord;
		userSsoId: string;
		userCode?: string;
		userFullname?: string;
		loaiGiaoDich: ELoaiGiaoDichVi;
		soTien: number;
		soDuTruoc: number;
		soDuSau: number;
		refTransactionId?: string;
		refBillId?: string;
		refBillIdentityCode?: string;
		noiDung?: string;
		/** Người thực hiện giao dịch */
		createdByUsername?: string | null;

		createdAt?: Date;

		updatedAt?: Date;
	}
}
