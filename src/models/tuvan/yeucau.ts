import useInitModel from '@/hooks/useInitModel';
import { getAdvisorBookingStatsService } from '@/services/TuVan';
import type { TuVan } from '@/services/TuVan/typing';
import { ipCCT } from '@/utils/ip';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<TuVan.IBooking>('advising/bookings', 'condition', undefined, ipCCT);
	const { getModel, postModel, putModel } = objInit;
	// Lưu ở model (không phải state riêng của trang) để recordResultModel bên dưới tự refetch đúng
	// theo năm học đang lọc, thay vì phải truyền lại maNamHoc qua từng lệnh gọi getData.
	const [maNamHoc, setMaNamHoc] = useState<string>();

	const [bookingStats, setBookingStats] = useState<TuVan.IAdvisingBookingStats>();
	const [loadingBookingStats, setLoadingBookingStats] = useState(false);

	/** Thống kê lịch tư vấn của cố vấn hiện tại — `GET advising/bookings/advisor/me/stats`. Lọc theo `maNamHoc` đang chọn nếu có. */
	const getBookingStatsModel = async () => {
		setLoadingBookingStats(true);
		try {
			const res = await getAdvisorBookingStatsService(maNamHoc ? { maNam: maNamHoc } : undefined);
			const d: TuVan.IAdvisingBookingStats | undefined = res.data?.data;
			setBookingStats(d);
			return d;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setLoadingBookingStats(false);
		}
	};

	/** Danh sách yêu cầu đặt lịch với cố vấn hiện tại (phân trang) — `GET advising/bookings/advisor/me/page`.
	 * Chỉ để xem, BE chưa có endpoint cho advisor duyệt/từ chối booking (SV đặt là CONFIRMED ngay).
	 * Lọc theo `maNam` (năm học, vd '2025-2026') đang chọn nếu có. */
	const getMyListModel = () =>
		getModel(
			maNamHoc ? ({ maNam: maNamHoc } as Partial<TuVan.IBooking>) : undefined,
			undefined,
			undefined,
			undefined,
			undefined,
			'advisor/me/page',
		);

	/** Refetch cả danh sách lẫn thống kê — dùng làm `getData` cho các thao tác làm đổi số liệu thống kê. */
	const refetchListAndStats = () => {
		getMyListModel();
		getBookingStatsModel();
	};

	/** Ghi nhận kết quả 1 buổi tư vấn — `PUT advising/bookings/:id/result`. */
	const recordResultModel = (id: string, payload: TuVan.IRecordResultRequest, messageText?: string) =>
		putModel(id, payload as Partial<TuVan.IBooking>, refetchListAndStats, true, true, messageText, `${id}/result`);

	/** Cố vấn tự thêm sinh viên vào 1 ca tư vấn của mình — `POST advising/bookings/advisor/students`. */
	const createBookingModel = (payload: TuVan.IAddStudentsToSlotRequest, messageText?: string) =>
		postModel(payload as unknown as Partial<TuVan.IBooking>, refetchListAndStats, true, messageText, 'advisor/students');

	/** Cố vấn sửa nội dung 1 lịch đã đặt trong slot của mình — `PUT advising/bookings/advisor/:id`. */
	const updateBookingModel = (id: string, payload: TuVan.IUpdateBookingRequest, messageText?: string) =>
		putModel(id, payload as Partial<TuVan.IBooking>, refetchListAndStats, true, true, messageText, `advisor/${id}`);

	/** Cố vấn huỷ 1 lịch đã đặt trong slot của mình — `PUT advising/bookings/advisor/:id/cancel`. */
	const cancelBookingModel = (id: string, payload: TuVan.ICancelBookingRequest, messageText?: string) =>
		putModel(id, payload as Partial<TuVan.IBooking>, refetchListAndStats, true, true, messageText, `advisor/${id}/cancel`);

	return {
		...objInit,
		maNamHoc,
		setMaNamHoc,
		getMyListModel,
		recordResultModel,
		createBookingModel,
		updateBookingModel,
		cancelBookingModel,
		bookingStats,
		loadingBookingStats,
		getBookingStatsModel,
		refetchListAndStats,
	};
};
