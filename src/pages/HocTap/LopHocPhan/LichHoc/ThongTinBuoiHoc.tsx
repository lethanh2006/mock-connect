import { type ThoiKhoaBieu } from '@/services/DaoTao/ThoiKhoaBieu/typing';
import { colorTrangThaiUserDiemDanh, trangThaiUserDiemDanh } from '@/services/DaoTao/constant';
import { Descriptions, Tag } from 'antd';
import moment from 'moment';

const ThongTinBuoiHoc = (props: { buoiHoc?: ThoiKhoaBieu.IRecord; title?: string | JSX.Element }) => {
	const { buoiHoc, title } = props;

	return (
		<Descriptions column={{ xs: 1, md: 3 }} title={title ?? 'Thông tin buổi học'}>
			<Descriptions.Item label='Ngày học' span={2}>
				Tuần {moment(buoiHoc?.ngay).week()}, {moment(buoiHoc?.ngay).format('dddd')}, ngày{' '}
				{moment(buoiHoc?.ngay).format('DD/MM/YYYY')}
			</Descriptions.Item>
			<Descriptions.Item label='Tiết học'>
				{buoiHoc?.tietBatDau} - {buoiHoc?.tietKetThuc}
			</Descriptions.Item>
			<Descriptions.Item label='Tên lớp' span={2}>
				{buoiHoc?.lopHocPhan?.ten}
			</Descriptions.Item>
			<Descriptions.Item label='Giảng viên'>
				{buoiHoc?.nhanSu?.ten
					? [buoiHoc.nhanSu?.hoDem, buoiHoc.nhanSu?.ten].join(' ')
					: buoiHoc?.tenNhanSu ?? <i>Chưa cập nhật</i>}
			</Descriptions.Item>
			<Descriptions.Item label='Phòng học'>{buoiHoc?.phongHoc ?? <i>Chưa cập nhật</i>}</Descriptions.Item>
			<Descriptions.Item label='Loại hình'>{buoiHoc?.loaiHinhHocTap ?? <i>Chưa cập nhật</i>}</Descriptions.Item>
			<Descriptions.Item label='Điểm danh'>
				{buoiHoc?.trangThaiDiemDanhCaNhan ? (
					<Tag color={colorTrangThaiUserDiemDanh[buoiHoc.trangThaiDiemDanhCaNhan]}>
						{trangThaiUserDiemDanh[buoiHoc.trangThaiDiemDanhCaNhan]}
					</Tag>
				) : (
					''
				)}
			</Descriptions.Item>
		</Descriptions>
	);
};
export default ThongTinBuoiHoc;
