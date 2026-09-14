import useInitModel from '@/hooks/useInitModel';
import { getAdvisorStatsService } from '@/services/IdpCoVan';
import type { IdpCoVan } from '@/services/IdpCoVan/typing';
import { ipCCT } from '@/utils/ip';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<IdpCoVan.IStudentSummary>('advisor/me/students', undefined, undefined, ipCCT);

	const [advisorStats, setAdvisorStats] = useState<IdpCoVan.IAdvisorStats>();
	const [loadingAdvisorStats, setLoadingAdvisorStats] = useState(false);

	/** Thống kê IDP/tư vấn của các sinh viên do cố vấn hiện tại phụ trách — `GET advisor/me/stats`. */
	const getAdvisorStatsModel = async (maNam?: string) => {
		setLoadingAdvisorStats(true);
		try {
			const res = await getAdvisorStatsService(maNam ? { maNam } : undefined);
			const d: IdpCoVan.IAdvisorStats | undefined = res.data?.data;
			setAdvisorStats(d);
			return d;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setLoadingAdvisorStats(false);
		}
	};

	return {
		...objInit,
		advisorStats,
		loadingAdvisorStats,
		getAdvisorStatsModel,
	};
};
