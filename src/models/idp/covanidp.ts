import useInitModel from '@/hooks/useInitModel';
import type { IdpCoVan } from '@/services/IdpCoVan/typing';
import { ipCCT } from '@/utils/ip';
import { useModel } from 'umi';
import type { QueryCondition } from '@/components/Table/typing';

export default () => {
	const objInit = useInitModel<IdpCoVan.IIdpListItem>('idp', 'condition', undefined, ipCCT);
	const { putModel, getModel } = objInit;
	const { initialState } = useModel('@@initialState');

	/** Danh sách IDP của toàn bộ sinh viên thuộc cố vấn hiện tại — `GET advisor/:advisorSsoId/idp/page`. */
	const getMyStudentsIdpModel = (condition?: QueryCondition<IdpCoVan.IIdpListItem>) => {
		const advisorSsoId = initialState?.currentUser?.ssoId;
		if (!advisorSsoId) return Promise.resolve([]);

		return getModel(
			condition,
			undefined,
			undefined,
			undefined,
			undefined,
			`advisor/me/idp/page`,
			undefined,
			undefined,
			true,
		);
	};

	/** Danh sách IDP đang có hiệu lực (đã được duyệt áp dụng) của các sinh viên do cố vấn hiện tại phụ trách — `GET advisor/me/idp/approved/page`. */
	const getApprovedIdpModel = () => {
		const advisorSsoId = initialState?.currentUser?.ssoId;
		if (!advisorSsoId) return Promise.resolve([]);

		return getModel(
			undefined,
			undefined,
			undefined,
			undefined,
			undefined,
			`advisor/me/idp/approved/page`,
			undefined,
			undefined,
			true,
		);
	};

	/**
	 * Duyệt 1 bản IDP — `PUT idp/advisor/:id/review`. Không tự refetch: nơi gọi tự quyết định
	 * refetch theo đúng danh sách đang hiển thị (theo 1 sinh viên hay toàn bộ sinh viên của cố vấn).
	 */
	const reviewIdpModel = async (
		id: string,
		payload: IdpCoVan.IReviewPayload,
		messageText?: string,
	): Promise<IdpCoVan.IIdpListItem> => putModel(id, payload, undefined, true, true, messageText, `advisor/${id}/review`);

	return {
		...objInit,
		getMyStudentsIdpModel,
		getApprovedIdpModel,
		reviewIdpModel,
	};
};
