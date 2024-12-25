import { type ThoiKhoaBieu } from '@/services/DaoTao/ThoiKhoaBieu/typing';
import { colorTrangThaiUserDiemDanh, trangThaiUserDiemDanh } from '@/services/DaoTao/constant';
import { colorHinhThucGiangDay } from '@/services/HocTap/LopHocPhan/constant';
import { THU_TRONG_TUAN } from '@/services/SuKien/constant';
import { Descriptions, Tag } from 'antd';
import moment from 'moment';

const ThongTinBuoiHoc = (props: { buoiHoc?: ThoiKhoaBieu.IRecord; title?: string | JSX.Element }) => {
	const { buoiHoc, title } = props;

	return (
		<Descriptions column={{ xs: 1, md: 3 }} title={title ?? 'Thông tin buổi học'}>
			<Descriptions.Item label='Ngày học'>
				{THU_TRONG_TUAN[moment(buoiHoc?.ngay).day()]}, {moment(buoiHoc?.ngay).format('DD/MM/YYYY')}
			</Descriptions.Item>
			<Descriptions.Item label='Tiết học'>
				{buoiHoc?.tietBatDau} - {buoiHoc?.tietKetThuc}
			</Descriptions.Item>
			<Descriptions.Item label='Hình thức'>
				{buoiHoc?.hinhThucGiangDay ? (
					<Tag color={colorHinhThucGiangDay[buoiHoc.hinhThucGiangDay]}>{buoiHoc.hinhThucGiangDay}</Tag>
				) : (
					'--'
				)}
			</Descriptions.Item>

			<Descriptions.Item label='Phòng học'>{buoiHoc?.phongHoc ?? <i>Chưa cập nhật</i>}</Descriptions.Item>
			<Descriptions.Item label='Giảng viên' span={2}>
				{buoiHoc?.nhanSu?.ten
					? [buoiHoc.nhanSu?.hoDem, buoiHoc.nhanSu?.ten].join(' ')
					: buoiHoc?.tenNhanSu ?? <i>Chưa cập nhật</i>}
			</Descriptions.Item>
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
