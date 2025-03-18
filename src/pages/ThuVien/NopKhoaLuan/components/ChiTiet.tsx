import {
	colorTrangThaiNopThuVien,
	ELoaiDotQuanLyThuvien,
	type ETrangThaiNopThuVien,
} from '@/services/QuanLyThuVien/constant';
import { Card, Descriptions, Tag } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';

const ChiTietThuVien = (props: any) => {
	const { title, loai } = props;
	const { record } = useModel('thuvien.danhsachdot');

	return (
		<Card title={`Chi tiết ${title?.toLowerCase()}`}>
			<Descriptions bordered column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }} labelStyle={{ fontWeight: 600 }}>
				{loai !== ELoaiDotQuanLyThuvien.LUAN_AN && (
					<>
						<Descriptions.Item label='Tên đợt' span={24}>
							{record?.dot?.tenDot ?? '--'}
						</Descriptions.Item>
						<Descriptions.Item label='Thời gian' span={24}>
							{record?.dot?.thoiGianBatDau && record?.dot?.thoiGianKetThuc ? (
								<>
									{moment(record?.dot?.thoiGianBatDau).format('HH:mm DD/MM/YYYY')} -{' '}
									{moment(record?.dot?.thoiGianKetThuc).format('HH:mm DD/MM/YYYY')}
								</>
							) : (
								'--'
							)}
						</Descriptions.Item>
					</>
				)}
				<Descriptions.Item label='Tên đề tài' span={24}>
					{record?.tenDeTai ?? '--'}
				</Descriptions.Item>
				<Descriptions.Item label='Nơi công tác' span={24}>
					{record?.noiCongTac ?? '--'}
				</Descriptions.Item>
				<Descriptions.Item label='Người hướng dẫn'>{record?.nguoiHuongDan ?? '--'}</Descriptions.Item>
				<Descriptions.Item label='Loại'>{record?.loai ?? '--'}</Descriptions.Item>
				<Descriptions.Item label='Mã học viên'>{record?.maSinhVien ?? '--'}</Descriptions.Item>
				<Descriptions.Item label='Họ tên tác giả'>{record?.hoTenTacGia ?? '--'}</Descriptions.Item>
				<Descriptions.Item label='Ngày sinh'>
					{record?.sinhVien?.ngaySinh ? moment(record?.sinhVien?.ngaySinh).format('DD/MM/YYYY') : '--'}
				</Descriptions.Item>
				<Descriptions.Item label='Số điện thoại'>{record?.sinhVien?.soDienThoai ?? '--'}</Descriptions.Item>
				<Descriptions.Item label='Chức danh'>{record?.chucDanh ?? '--'}</Descriptions.Item>
				<Descriptions.Item label='Học vị'>{record?.hocVi ?? '--'}</Descriptions.Item>
				<Descriptions.Item label='Trạng thái'>
					{record?.trangThai ? (
						<Tag color={colorTrangThaiNopThuVien[record?.trangThai as ETrangThaiNopThuVien]}>{record?.trangThai}</Tag>
					) : (
						'--'
					)}
				</Descriptions.Item>
				<Descriptions.Item label='Thời gian nộp'>
					{record?.thoiGianNop ? moment(record?.thoiGianNop).format('DD/MM/YYYY') : '--'}
				</Descriptions.Item>
				<Descriptions.Item label='Chuyên ngành'>{record?.nganh?.ten ?? '--'}</Descriptions.Item>
				<Descriptions.Item label='Mã chuyên ngành'>{record?.maNganh ?? '--'}</Descriptions.Item>
				<Descriptions.Item label='Tài liệu toàn bộ đề tài'>
					{record?.urlTaiLieu ? (
						<a href={record?.urlTaiLieu} rel='noreferrer' target='_blank'>
							Xem tài liệu
						</a>
					) : (
						'--'
					)}
				</Descriptions.Item>
				<Descriptions.Item label='Tài liệu tóm tắt đề tài'>
					{record?.urlTomTat ? (
						<a href={record?.urlTomTat} rel='noreferrer' target='_blank'>
							Xem tài liệu
						</a>
					) : (
						'--'
					)}
				</Descriptions.Item>
				<Descriptions.Item label='Tài liệu minh chứng đề tài'>
					{record?.urlTaiLieuMinhChung ? (
						<a href={record?.urlTaiLieuMinhChung} rel='noreferrer' target='_blank'>
							Xem tài liệu
						</a>
					) : (
						'--'
					)}
				</Descriptions.Item>
			</Descriptions>
		</Card>
	);
};

export default ChiTietThuVien;
