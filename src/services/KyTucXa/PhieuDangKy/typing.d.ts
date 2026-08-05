import { Phong } from '../Phong/typing';
import { ETrangThaiThanhToanKTX } from './constant';

declare module PhieuDangKyKTX {
	export interface IRecord {
		_id: string;
		trangThaiThanhToan?: ETrangThaiThanhToanKTX;
		maDotId?: string;
		maPhong?: string;
		nguoiTaoMa?: string;
		nguoiTaoSsoId?: string;
		nguoiTaoHoTen?: string;
		khoa?: string;
		nganh?: string;
		soDienThoai?: string;
		email?: string;
		trangThaiDuyet?: string;
		thoiHanThanhToan?: string;
		identityCode?: string;
		urlMinhChung?: string | null;
		trangThaiMinhChung?: string | null;
		loaiDangKy?: string;
		thoiGianBatDauVerify?: string | null;
		thoiGianKetThucVerify?: string | null;
		daVerify?: boolean;
		dataPartitionCode?: string | null;
		createdAt?: string;
		updatedAt?: string;

		phong?: Phong.IRecord;
		formDon?: IDangKy;
		thoiGianChuyenRa: Date;
		thoiGianChuyenVao: Date;
	}

	export interface IDangKy {
		_id?: string;
		dangKyKyTucXaId?: string;

		fullName?: string;
		studentId?: string;
		gender?: string;
		email?: string;
		phoneNumber?: string;
		apid?: string | null;
		college?: string;
		dateOfBirth?: string;

		specialRequirements?: string | null;
		hasSpecialCondition?: boolean | null;
		conditionDetails?: string | null;

		program?: string;
		identityNumber?: string;
		dateOfIssue?: string;
		placeOfIssue?: string;
		nationality?: string;
		permanentHomeAddress?: string;

		haveHealthInsurance?: boolean | null;
		healthInsuranceFile?: string | null;
		identityCardFrontUrl?: string | null;
		identityCardBackUrl?: string | null;
		passportUrl?: string | null;

		agreedToPolicy?: boolean;
		signatureUrl?: string | null;
		signedAt?: string | Date;

		emergencyContacts?: INguoiThan[];

		dataPartitionCode?: string | null;
		createdAt?: string;
		updatedAt?: string;
	}

	export interface INguoiThan {
		index?: number;
		emergencyContactName?: string;
		emergencyRelationship?: string;
		emergencyContactNumber?: string;
		secondaryContactNumber?: string;
		emergencyEmail?: string;
		address?: string;
	}
}
