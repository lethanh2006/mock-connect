import useInitModel from '@/hooks/useInitModel';
import type { TuVan } from '@/services/TuVan/typing';
import { ipCCT } from '@/utils/ip';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<TuVan.ISlot>('advising/slots', 'condition', undefined, ipCCT);
	const { getModel, postModel, putModel } = objInit;
	// Lưu ở model (không phải state riêng của trang) để các action tạo/huỷ/xoá bên dưới tự refetch
	// đúng theo năm học đang lọc, thay vì phải truyền lại maNam qua từng lệnh gọi getData.
	const [maNamHoc, setMaNamHoc] = useState<string>();

	/** Danh sách ca tư vấn của cố vấn hiện tại (phân trang) — `GET advising/slots/me/page`. Lọc theo `maNam` nếu có chọn. */
	const getMyListModel = () =>
		getModel(
			maNamHoc ? ({ maNam: maNamHoc } as Partial<TuVan.ISlot>) : undefined,
			undefined,
			undefined,
			undefined,
			undefined,
			'me/page',
		);

	/** Tạo hàng loạt ca tư vấn — `POST advising/slots`. Response không trả data, tự refetch sau khi tạo. */
	const createSlotsModel = (payload: TuVan.ICreateSlotRequest, messageText?: string) =>
		postModel(payload as unknown as Partial<TuVan.ISlot>, getMyListModel, true, messageText);

	/** Huỷ 1 ca (kèm huỷ luôn các booking đang CONFIRMED của ca) — `PUT advising/slots/:id/cancel`. */
	const cancelSlotModel = (id: string, payload: TuVan.ICancelSlotRequest, messageText?: string) =>
		putModel(id, payload as Partial<TuVan.ISlot>, getMyListModel, true, true, messageText, `${id}/cancel`);

	return {
		...objInit,
		maNamHoc,
		setMaNamHoc,
		getMyListModel,
		createSlotsModel,
		cancelSlotModel,
	};
};
