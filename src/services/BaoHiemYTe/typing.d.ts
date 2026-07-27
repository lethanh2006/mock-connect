import { BhytPaymentStatus, EBhytPublishStatus, EBhytReviewStatus, EDeclarationType } from './constant';

declare module BaoHiemYTe {
	export interface IDotDangKy {
		_id?: string;
		periodId: string;
		name: string;
		maNamHoc?: string;
		tenNamHoc?: string;
		registrationStartAt: string;
		registrationEndAt: string;
		publishStatus: EBhytPublishStatus;
		periodStatus?: 'OPEN' | string;
		registrationId?: string;
		periodStudentId?: string;
		student?: IStudentRegistration;
		note?: string;
		declarationType?: EDeclarationType;
		reviewStatus?: EBhytReviewStatus | string | null;
		paymentStatus?: BhytPaymentStatus | null;
	}

	export interface IMyRegistration {
		_id?: string;
		declarationType?: EDeclarationType;
		reviewStatus?: EBhytReviewStatus | null;
		paymentStatus?: BhytPaymentStatus | null;
	}

	/** Snapshot của một đợt đăng ký BHYT của sinh viên, trả về bởi `/me/current` */
	export interface IPeriodSnapshot {
		hasActivePeriod?: boolean;
		message?: string;
		period?: IDotDangKy;
		myRegistration?: IMyRegistration;
		student?: IStudentRegistration;
		canSubmit?: boolean;
	}

	/**
	 * Một dòng lịch sử đăng ký BHYT, trả về bởi `/me/history`.
	 * `declarationSnapshot` là dữ liệu tại thời điểm của record nhưng có thể thiếu field;
	 * `student` là dữ liệu mới nhất, đầy đủ field, dùng để bổ khuyết cho declarationSnapshot.
	 */
	export interface IHistoryItem {
		_id?: string;
		periodStudentId?: string;
		declarationType?: EDeclarationType;
		reviewStatus?: EBhytReviewStatus | null;
		reviewerId?: string;
		reviewerName?: string;
		action?: string;
		note?: string;
		createdAt?: string;
		period?: IDotDangKy;
		declarationSnapshot?: IStudentRegistration;
		student?: IStudentRegistration;
	}

	export interface IStudentRegistration extends Partial<ISinhVienDangKy>, Partial<ISinhVienDangKyTruong> {
		_id?: string;
		academicYearId?: string;
		studentId?: string;
		nationality?: string;
		khoa?: string;
		nganh?: string;
		institute?: string;
		declarationType?: EDeclarationType;
		reviewStatus?: string | null;
		paymentStatus?: BhytPaymentStatus | null;
		reminderCount?: number;
		billRequestedAt?: string | null;
		createdAt?: string;
		updatedAt?: string;
	}

	export interface ISinhVienDangKyThongTin {
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

	export interface ISinhVienDangKy extends ISinhVienDangKyThongTin {
		ssnNumber?: string;
		cardNumber?: string;
		cardExpiredAt?: string;
		participantGroup?: string;
		initialClinicPlace?: string;
		insuranceProviderName?: string;
		insuranceCardNumber?: string;
		insuranceValidFrom?: string;
		insuranceValidTo?: string;
		passportImageFileId?: string;
		visaImageFileId?: string;
		proofFileId: string;
	}

	export interface ISinhVienDangKyTruong extends ISinhVienDangKyThongTin {
		ssnNumber?: string;
		hanBHYTHienTai?: string;
		diaChiThuongTru?: {
			maTinh?: string;
			maXaPhuong?: string;
			soNhaTenDuong?: string;
		};
	}
}
