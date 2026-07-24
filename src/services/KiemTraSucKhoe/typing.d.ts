import { EDeclarationType, EKtscPublishStatus, EKtscReviewStatus, KtscPaymentStatus } from './constant';

declare module KiemTraSucKhoe {
	export interface IDotDangKy {
		_id?: string;
		periodId: string;
		name: string;
		maNamHoc?: string;
		tenNamHoc?: string;
		registrationStartAt: string;
		registrationEndAt: string;
		publishStatus: EKtscPublishStatus;
		periodStatus?: 'OPEN' | string;
		registrationId?: string;
		periodStudentId?: string;
		student?: IStudentRegistration;
		note?: string;
		declarationType?: EDeclarationType;
		reviewStatus?: EKtscReviewStatus | string | null;
		paymentStatus?: KtscPaymentStatus | null;
	}

	export interface IMyRegistration {
		_id?: string;
		declarationType?: EDeclarationType;
		reviewStatus?: EKtscReviewStatus | null;
		paymentStatus?: KtscPaymentStatus | null;
	}

	/** Snapshot của một đợt đăng ký kiểm tra sức khỏe của sinh viên, trả về bởi `/me/current` */
	export interface IPeriodSnapshot {
		hasActivePeriod?: boolean;
		message?: string;
		period?: IDotDangKy;
		myRegistration?: IMyRegistration;
		student?: IStudentRegistration;
		canSubmit?: boolean;
	}

	/**
	 * Một dòng lịch sử đăng ký kiểm tra sức khỏe, trả về bởi `/me/history`.
	 * `declarationSnapshot` là dữ liệu tại thời điểm của record nhưng có thể thiếu field;
	 * `student` là dữ liệu mới nhất, đầy đủ field, dùng để bổ khuyết cho declarationSnapshot.
	 */
	export interface IHistoryItem {
		_id?: string;
		periodStudentId?: string;
		declarationType?: EDeclarationType;
		reviewStatus?: EKtscReviewStatus | null;
		reviewerId?: string;
		reviewerName?: string;
		action?: string;
		note?: string;
		createdAt?: string;
		period?: IDotDangKy;
		declarationSnapshot?: IStudentRegistration;
		student?: IStudentRegistration;
	}

	export interface IStudentRegistration extends Partial<ISinhVienMienKham>, Partial<ISinhVienDangKy> {
		_id?: string;
		academicYearId?: string;
		studentId?: string;
		nationality?: string;
		khoa?: string;
		nganh?: string;
		institute?: string;
		declarationType?: EDeclarationType;
		reviewStatus?: string | null;
		paymentStatus?: KtscPaymentStatus | null;
		reminderCount?: number;
		billRequestedAt?: string | null;
		createdAt?: string;
		updatedAt?: string;
	}

	export interface ISinhVienDangKyThongTin {
		ssoId?: string;
		studentId?: string;
		periodStudentId?: string;
		periodId?: string;
		fullName?: string;
		studentCode?: string;
		ngaySinh?: string;
		cccd?: string;
		nationality?: string;
		gioiTinh?: string;
		khoa?: string;
		nganh?: string;
		maKhoa?: string;
		maNganh?: string;
		phone?: string;
		email?: string;
	}

	/** Payload đăng ký khám sức khỏe tại trường: chỉ gồm thông tin cá nhân sinh viên, gửi thẳng không qua form */
	export interface ISinhVienDangKy extends ISinhVienDangKyThongTin {}

	/** Payload khai báo miễn khám sức khỏe: thông tin cá nhân + tối đa 5 ảnh minh chứng */
	export interface ISinhVienMienKham extends ISinhVienDangKyThongTin {
		proofFileIds: string[];
	}
}
