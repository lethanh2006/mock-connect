import { EMauTrangThaiThanhToanTable, ETrangThaiThanhToan } from '@/services/TaiChinh/constant';
import dayjs from '@/utils/dayjs';
import { formatDateTime } from '@/utils/formatDate';
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
			<Descriptions.Item label={'Mã sinh viên'}>{recHoaDon?.userCode ?? '-'}</Descriptions.Item>

			<Descriptions.Item label={'Họ tên'}>{recHoaDon?.userFullname ?? '-'}</Descriptions.Item>
			<Descriptions.Item label={'Email'}>{recHoaDon?.userEmail ?? '-'}</Descriptions.Item>
			{/* <Descriptions.Item label={'Số điện thoại'}>
				{recHoaDon?.} 

			</Descriptions.Item> */}
			<Descriptions.Item label={intl.formatMessage({ id: 'taichinh.hoadon.desc.dotthu' })}>
				{recHoaDon?.dotThu?.tenDot ?? <i>{intl.formatMessage({ id: 'taichinh.common.updating' })}</i>} -{' '}
				{!recHoaDon?.dotThu?.kichHoat ? (
					<span className='text-error'>{intl.formatMessage({ id: 'taichinh.hoadon.status.notOpen' })}</span>
				) : null}
			</Descriptions.Item>
			<Descriptions.Item label={intl.formatMessage({ id: 'taichinh.hoadon.desc.thoigianthu' })}>
				<span className={ngoaiThoiGianThanhToan ? 'text-error' : undefined}>
					{recHoaDon?.dotThu?.thoiGianBatDau ? (
						`${formatDateTime(recHoaDon.dotThu.thoiGianBatDau)} - ${formatDateTime(recHoaDon.dotThu.thoiGianKetThuc)}`
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
				{inputFormat(recHoaDon?.soTienPhaiThu ?? 0)} VNĐ
			</Descriptions.Item>
			<Descriptions.Item label={intl.formatMessage({ id: 'taichinh.hoadon.desc.uudai' })}>
				{inputFormat(recHoaDon?.soTienKhuyenMai ?? 0)} VNĐ
			</Descriptions.Item>
			<Descriptions.Item label={intl.formatMessage({ id: 'taichinh.hoadon.desc.danop' })}>
				{inputFormat(recHoaDon?.soTienPhaiThu ?? 0)} VNĐ
			</Descriptions.Item>
			<Descriptions.Item label={intl.formatMessage({ id: 'taichinh.hoadon.desc.conlai' })}>
				{inputFormat(recHoaDon?.soTienConLai ?? 0)} VNĐ
			</Descriptions.Item>
		</Descriptions>
	);
};

export default DesThongTinHoaDon;
