import { getThongBao, readNotification } from '@/services/ThongBao';
import { type ThongBao } from '@/services/ThongBao/typing';
import { message } from 'antd';
import DOMPurify from 'dompurify';
import { useState } from 'react';

const toPlainText = (value?: string) =>
	DOMPurify.sanitize(value ?? '', { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })
		.replace(/\s+/g, ' ')
		.trim();

export default () => {
	const [loading, setLoading] = useState<boolean>(true);
	const [record, setRecord] = useState<ThongBao.IRecord>();
	const [danhSach, setDanhSach] = useState<ThongBao.IRecord[]>([]);
	const [page, setPage] = useState<number>(1);
	const [limit, setLimit] = useState<number>(20);
	const [total, setTotal] = useState<number>(0);
	const [unread, setUnread] = useState<number>(0);

	const getThongBaoModel = async (): Promise<ThongBao.IRecord[]> => {
		setLoading(true);
		try {
			const response = await getThongBao({ page, limit });
			const responseData = response?.data?.data?.data ?? response?.data?.data;
			const list = (responseData?.result ?? []).map((item: any): ThongBao.IRecord => ({
				...item,
				_id: item.id ?? item._id,
				content: item.body ?? item.content,
				description: toPlainText(item.description ?? item.body ?? item.content),
				read: item.isRead ?? item.read,
			}));
			if (page === 1) setDanhSach(list);
			else setDanhSach([...danhSach, ...list]);
			setUnread(responseData?.unread ?? 0);
			setTotal(responseData?.total ?? 0);

			return list;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};

	const readNotificationModel = async (
		type: 'ALL' | 'ONE',
		notificationId?: string,
		messageText?: string,
	): Promise<any> => {
		setLoading(true);
		try {
			const response = await readNotification({ type, notificationId });
			if (page !== 1) setPage(1);
			else getThongBaoModel();
			if (type === 'ALL') messageText ?? message.success('Đã đọc tất cả thông báo');

			return response?.data?.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};

	return {
		unread,
		total,
		danhSach,
		setDanhSach,
		page,
		setPage,
		limit,
		setLimit,
		record,
		setRecord,
		loading,
		setLoading,
		getThongBaoModel,
		readNotificationModel,
	};
};
