import { buildUpLoadFile } from '@/services/uploadFile';
import type { TStep4Payload } from './typing';

export const buildStep4Payload = async (values: Record<string, any>): Promise<TStep4Payload> => {
	const [urlCheckup, urlInsurance] = await Promise.all([
		values.alreadyHadCheckup ? buildUpLoadFile(values, 'healthCheckupAttachment') : Promise.resolve(undefined),
		values.hasInsurance ? buildUpLoadFile(values, 'healthInsuranceAttachment') : Promise.resolve(undefined),
	]);

	const id1 = values.alreadyHadCheckup ? urlCheckup || 'CHECKUP_DONE' : 'CHECKUP_REGISTER';
	const id2 = values.hasInsurance
		? urlInsurance || values.healthInsuranceNumber || 'INSURANCE_EXISTING'
		: 'INSURANCE_REGISTER';
	const id3 = values.isRegisterDormitory === true ? 'DORMITORY_APPLY' : 'DORMITORY_NONE';

	return {
		id1,
		id2,
		id3,
		alreadyHadCheckup: Boolean(values.alreadyHadCheckup),
		healthCheckupAttachment: urlCheckup ?? undefined,
		hasInsurance: Boolean(values.hasInsurance),
		healthInsuranceNumber: values.hasInsurance ? values.healthInsuranceNumber : undefined,
		healthInsuranceAttachment: urlInsurance ?? undefined,
		isRegisterDormitory: Boolean(values.isRegisterDormitory),
	};
};
