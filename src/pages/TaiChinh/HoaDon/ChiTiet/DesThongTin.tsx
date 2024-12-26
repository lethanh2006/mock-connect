import { EMaTrangThaiThanhToan, EMauTrangThaiThanhToanTable, ETrangThaiThanhToan } from '@/services/TaiChinh/constant';
import { inputFormat } from '@/utils/utils';
import { Descriptions, Tag } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';

const DesThongTinHoaDon = () => {
	const { record: recHoaDon } = useModel('taichinh.hoadon');
	const ngoaiThoiGianThanhToan =
		!!recHoaDon?.dotThu?._id &&
		!!recHoaDon?.dotThu?.thoiGianBatDau &&
		!!recHoaDon.dotThu.thoiGianKetThuc &&
		(moment().isBefore(recHoaDon.dotThu.thoiGianBatDau) || moment().isAfter(recHoaDon.dotThu.thoiGianKetThuc));
	return (
		<Descriptions column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }} bordered>
			<Descriptions.Item label='Đợt thu'>
				{recHoaDon?.dotThu?.tenDot ?? <i>Đang cập nhật</i>} -{' '}
				{!recHoaDon?.dotThu?.kichHoat ? <span className='text-error'>Chưa mở đợt</span> : null}
			</Descriptions.Item>
			<Descriptions.Item label='Thời gian thu'>
				<span className={ngoaiThoiGianThanhToan ? 'text-error' : undefined}>
					{recHoaDon?.dotThu?.thoiGianBatDau ? (
						`${moment(recHoaDon.dotThu.thoiGianBatDau).format('HH:mm DD/MM/YYYY')} - ${moment(
							recHoaDon.dotThu.thoiGianKetThuc,
						).format('HH:mm DD/MM/YYYY')}`
					) : (
						<i>Đang cập nhật</i>
					)}
				</span>
			</Descriptions.Item>
			<Descriptions.Item label='Trạng thái'>
				{recHoaDon?.status ? (
					<Tag color={EMauTrangThaiThanhToanTable?.[recHoaDon.status]}>
						{ETrangThaiThanhToan?.[recHoaDon.status] ?? ''}
					</Tag>
				) : (
					<i>Đang cập nhật</i>
				)}
			</Descriptions.Item>
			<Descriptions.Item label='Người nộp tiền'>
				{recHoaDon?.userFullname ? `${recHoaDon.userFullname} - ${recHoaDon.userCode}` : <i>Đang cập nhật</i>}
			</Descriptions.Item>
			<Descriptions.Item label='Tổng thành tiền'>
				{inputFormat(
					recHoaDon?.billItems
						?.filter((item) => item.status !== EMaTrangThaiThanhToan.DONG)
						?.reduce((acc, item) => acc + (item.amountDue || 0), 0),
				)}{' '}
				VNĐ
			</Descriptions.Item>
			<Descriptions.Item label='Số tiền ưu đãi'>
				{inputFormat(
					recHoaDon?.billItems
						?.filter((item) => item.status !== EMaTrangThaiThanhToan.DONG)
						?.reduce((acc, item) => acc + (item.amountDiscount || 0), 0),
				)}{' '}
				VNĐ
			</Descriptions.Item>
			<Descriptions.Item label='Số tiền đã nộp'>
				{inputFormat(
					recHoaDon?.billItems
						?.filter((item) => item.status !== EMaTrangThaiThanhToan.DONG)
						?.reduce((acc, item) => acc + (item.amountPaid || 0), 0),
				)}{' '}
				VNĐ
			</Descriptions.Item>
			<Descriptions.Item label='Số tiền còn lại phải nộp'>
				{inputFormat(
					recHoaDon?.billItems
						?.filter((item) => item.status !== EMaTrangThaiThanhToan.DONG)
						?.reduce((acc, item) => acc + (item.amountRemaining || 0), 0),
				)}{' '}
				VNĐ
			</Descriptions.Item>
		</Descriptions>
	);
};

export default DesThongTinHoaDon;
