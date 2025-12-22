import { EMaTrangThaiThanhToan, EMauTrangThaiThanhToanTable, ETrangThaiThanhToan } from '@/services/TaiChinh/constant';
import dayjs from '@/utils/dayjs';
import { inputFormat } from '@/utils/utils';
import { Descriptions, Tag } from 'antd';
import { useIntl, useModel } from 'umi';

const DesThongTinHoaDon = () => {
	const intl = useIntl();
	const { record: recHoaDon } = useModel('taichinh.hoadon');
	const ngoaiThoiGianThanhToan =
		!!recHoaDon?.dotThu?._id &&
		!!recHoaDon?.dotThu?.thoiGianBatDau &&
		!!recHoaDon.dotThu.thoiGianKetThuc &&
		(dayjs().isBefore(dayjs(recHoaDon.dotThu.thoiGianBatDau)) ||
			dayjs().isAfter(dayjs(recHoaDon.dotThu.thoiGianKetThuc)));

	return (
		<Descriptions column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }} bordered>
			<Descriptions.Item label={intl.formatMessage({ id: 'taichinh.hoadon.desc.dotthu' })}>
				{recHoaDon?.dotThu?.tenDot ?? <i>{intl.formatMessage({ id: 'taichinh.common.updating' })}</i>} -{' '}
				{!recHoaDon?.dotThu?.kichHoat ? (
					<span className='text-error'>{intl.formatMessage({ id: 'taichinh.hoadon.status.notOpen' })}</span>
				) : null}
			</Descriptions.Item>
			<Descriptions.Item label={intl.formatMessage({ id: 'taichinh.hoadon.desc.thoigianthu' })}>
				<span className={ngoaiThoiGianThanhToan ? 'text-error' : undefined}>
					{recHoaDon?.dotThu?.thoiGianBatDau ? (
						`${dayjs(recHoaDon.dotThu.thoiGianBatDau).format('HH:mm DD/MM/YYYY')} - ${dayjs(
							recHoaDon.dotThu.thoiGianKetThuc,
						).format('HH:mm DD/MM/YYYY')}`
					) : (
						<i>{intl.formatMessage({ id: 'taichinh.common.updating' })}</i>
					)}
				</span>
			</Descriptions.Item>
			<Descriptions.Item label={intl.formatMessage({ id: 'taichinh.hoadon.desc.trangthai' })}>
				{recHoaDon?.status ? (
					<Tag color={EMauTrangThaiThanhToanTable?.[recHoaDon.status]}>
						{ETrangThaiThanhToan?.[recHoaDon.status] ?? ''}
					</Tag>
				) : (
					<i>{intl.formatMessage({ id: 'taichinh.common.updating' })}</i>
				)}
			</Descriptions.Item>
			<Descriptions.Item label={intl.formatMessage({ id: 'taichinh.hoadon.desc.nguoinop' })}>
				{recHoaDon?.userFullname ? (
					`${recHoaDon.userFullname} - ${recHoaDon.userCode}`
				) : (
					<i>{intl.formatMessage({ id: 'taichinh.common.updating' })}</i>
				)}
			</Descriptions.Item>
			<Descriptions.Item label={intl.formatMessage({ id: 'taichinh.hoadon.desc.tongtien' })}>
				{inputFormat(
					recHoaDon?.billItems
						?.filter((item) => item.status !== EMaTrangThaiThanhToan.DONG)
						?.reduce((acc, item) => acc + (item.amountDue || 0), 0),
				)}{' '}
				VNĐ
			</Descriptions.Item>
			<Descriptions.Item label={intl.formatMessage({ id: 'taichinh.hoadon.desc.uudai' })}>
				{inputFormat(
					recHoaDon?.billItems
						?.filter((item) => item.status !== EMaTrangThaiThanhToan.DONG)
						?.reduce((acc, item) => acc + (item.amountDiscount || 0), 0),
				)}{' '}
				VNĐ
			</Descriptions.Item>
			<Descriptions.Item label={intl.formatMessage({ id: 'taichinh.hoadon.desc.danop' })}>
				{inputFormat(
					recHoaDon?.billItems
						?.filter((item) => item.status !== EMaTrangThaiThanhToan.DONG)
						?.reduce((acc, item) => acc + (item.amountPaid || 0), 0),
				)}{' '}
				VNĐ
			</Descriptions.Item>
			<Descriptions.Item label={intl.formatMessage({ id: 'taichinh.hoadon.desc.conlai' })}>
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
