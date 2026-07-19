import { EBhytPublishStatus } from './constant';

declare module BaoHiemYTe {
	export interface IDotDangKy {
		_id: string;
		periodId: string;
		name: string;
		academicYearId: string;
		academicYearLabel: string;
		registrationStartAt: string;
		registrationEndAt: string;
		publishStatus: EBhytPublishStatus;
		status?: 'OPEN' | string;
		myRegistration?: IMyRegistration;
		note?: string;
		createdAt: string;
		updatedAt: string;
	}

	export interface IMyRegistration {
		_id: string;
		declarationType?: 'CHUA_DANG_KY' | string;
		reviewStatus?: string;
		passportImageFileId?: string;
		visaImageFileId?: string;
	}

	export interface ISinhVienDangKy {
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

		//fake
		registrationType: any;
	}
}
