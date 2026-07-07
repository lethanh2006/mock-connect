declare module PhieuDangKyKTX {
	export interface IRecord {
		fullName: string;
		studentId: string;
		gender: string;
		email: string;
		phoneNumber: string;
		apid: string;
		college: string;
		dateOfBirth: string;
		specialRequirements: string;
		hasSpecialCondition: boolean;
		conditionDetails: string;
		program: string;
		identityNumber: string;
		dateOfIssue: string;
		placeOfIssue: string;
		nationality: string;
		permanentHomeAddress: string;
		haveHealthInsurance: boolean;
		healthInsuranceFile: string;
		identityCardFrontUrl: string;
		identityCardBackUrl: string;
		passportUrl: string;
		agreedToPolicy: boolean;
		signatureUrl: string;
		signedAt: Date;
		emergencyContacts: INguoiThan[];
	}

	export interface INguoiThan {
		index: number;
		emergencyContactName: string;

		emergencyRelationship: string;
		emergencyContactNumber: string;
		secondaryContactNumber: string;
		emergencyEmail: string;
		address: string;
	}
}
