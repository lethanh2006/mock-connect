import { ESettingKey } from '@/services/base/constant';
import { ipDaoTao } from '@/utils/ip';
import { useModel } from '@umijs/max';
import DOMPurify from 'dompurify';
import React, { useEffect } from 'react';

export interface InstitutionalPoliciesSectionProps {}

const InstitutionalPoliciesSection: React.FC<InstitutionalPoliciesSectionProps> = () => {
	const { settings, getByKeyModel: getSettings } = useModel('tienich.caidat');

	useEffect(() => {
		getSettings(ESettingKey.GENERAL_INFO, ipDaoTao);
	}, []);

	const syllabusPoliciesFromSettings = (settings?.[ESettingKey.GENERAL_INFO] as any)?.syllabusPolicies?.trim();

	return <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(syllabusPoliciesFromSettings ?? '') }} />;
};

export default InstitutionalPoliciesSection;
