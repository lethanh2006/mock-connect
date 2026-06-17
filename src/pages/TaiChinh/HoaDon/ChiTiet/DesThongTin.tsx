import dayjs from '@/utils/dayjs';
import { inputFormat } from '@/utils/utils';
import { Descriptions } from 'antd';
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
			<Descriptions.Item label={'Số điện thoại'}>{recHoaDon?.userPhone ?? '-'}</Descriptions.Item>
			<Descriptions.Item label={'Ngày sinh'}>{recHoaDon?.userDOB ?? '-'}</Descriptions.Item>
			<Descriptions.Item label={'Địa chỉ'}>{recHoaDon?.userAddress ?? '-'}</Descriptions.Item>
			<Descriptions.Item label={'Khóa'}>{recHoaDon?.userMaKhoaSinhVien ?? '-'}</Descriptions.Item>
			<Descriptions.Item label={'Ngành'}>{recHoaDon?.userMaNganh ?? '-'}</Descriptions.Item>
			<Descriptions.Item label={'Lớp hành chính'}>{recHoaDon?.userLopHanhChinh ?? '-'}</Descriptions.Item>
			<Descriptions.Item label={'Tính chất'}>
				{(recHoaDon as any)?.userTenTinhChat || (recHoaDon as any)?.userMaTinhChat || '-'}
			</Descriptions.Item>
			<Descriptions.Item label={'Mã định danh'}>{recHoaDon?.identityCode ?? '-'}</Descriptions.Item>
			<Descriptions.Item label={'Loại tiền'}>{recHoaDon?.currency ?? 'VND'}</Descriptions.Item>
			<Descriptions.Item label={'Phải thu'}>{inputFormat(recHoaDon?.soTienPhaiThu ?? 0)} VNĐ</Descriptions.Item>
			<Descriptions.Item label={'Đã thu'}>{inputFormat(recHoaDon?.soTienDaThu ?? 0)} VNĐ</Descriptions.Item>
			<Descriptions.Item label={'Khuyến mại'}>{inputFormat(recHoaDon?.soTienKhuyenMai ?? 0)} VNĐ</Descriptions.Item>
			<Descriptions.Item label={'Còn lại'}>{inputFormat(recHoaDon?.soTienConLai ?? 0)} VNĐ</Descriptions.Item>
		</Descriptions>
	);
};

export default DesThongTinHoaDon;
