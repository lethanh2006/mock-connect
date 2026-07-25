import type { SinhVien } from '@/services/DaoTao/SinhVien/typings';

/**
 * Inverse of `buildStep4Payload` — maps saved step 4 info back into step 4 form field names.
 */
export const buildStep4InitialValues = (sinhVien?: SinhVien.IRecord): Record<string, any> => {
	if (!sinhVien) return {};

	const hoSo = sinhVien.hoSoNhapHoc;

	return {
		alreadyHadCheckup: hoSo?.alreadyHadCheckup ?? false,
		healthCheckupAttachment: hoSo?.healthCheckupAttachment,
		hasInsurance: hoSo?.hasInsurance ?? false,
		healthInsuranceNumber: hoSo?.healthInsuranceNumber ?? sinhVien.soTheBHYT,
		healthInsuranceAttachment: hoSo?.healthInsuranceAttachment,
		isRegisterDormitory: hoSo?.isRegisterDormitory ?? false,
	};
};
