import { type ThoiKhoaBieu } from '@/services/DaoTao/ThoiKhoaBieu/typing';
import { colorTrangThaiUserDiemDanh, trangThaiUserDiemDanh } from '@/services/DaoTao/constant';
import { colorHinhThucGiangDay } from '@/services/HocTap/LopHocPhan/constant';
import { THU_TRONG_TUAN } from '@/services/SuKien/constant';
import dayjs from '@/utils/dayjs';
import { Card, Descriptions, Space, Tag } from 'antd';
import type { JSX } from 'react';

const ThongTinBuoiHoc = (props: {
	buoiHoc?: ThoiKhoaBieu.IRecord;
	title?: string | JSX.Element;
	hideCard?: boolean;
	column?: any;
}) => {
	const { buoiHoc, title = 'Thông tin buổi học', hideCard, column } = props;

	const content = (
		<Descriptions column={column ?? { xs: 1, sm: 1, md: 3, lg: 3, xl: 3, xxl: 3 }}>
			<Descriptions.Item label='Ngày học'>
				{THU_TRONG_TUAN[dayjs(buoiHoc?.ngay).day()]}, {dayjs(buoiHoc?.ngay).format('DD/MM/YYYY')}
			</Descriptions.Item>
			<Descriptions.Item label='Tiết học (Giờ)'>
				{buoiHoc?.tietBatDau} - {buoiHoc?.tietKetThuc}
				{buoiHoc?.thoiGianBatDau && buoiHoc?.thoiGianKetThuc
					? ` (${dayjs(buoiHoc.thoiGianBatDau).format('HH:mm')} - ${dayjs(buoiHoc.thoiGianKetThuc).format('HH:mm')})`
					: ''}
			</Descriptions.Item>
			<Descriptions.Item label='Hình thức - Loại hình'>
				<Space wrap>
					{buoiHoc?.hinhThucGiangDay ? (
						<Tag color={colorHinhThucGiangDay[buoiHoc.hinhThucGiangDay]}>{buoiHoc.hinhThucGiangDay}</Tag>
					) : (
						'--'
					)}
					{buoiHoc?.loaiHinhHocTap ?? <i>Chưa cập nhật</i>}
				</Space>
			</Descriptions.Item>

			<Descriptions.Item label='Phòng học'>{buoiHoc?.phongHoc ?? <i>Chưa cập nhật</i>}</Descriptions.Item>
			<Descriptions.Item label='Giảng viên'>
				{buoiHoc?.nhanSu?.ten
					? [buoiHoc.nhanSu?.hoDem, buoiHoc.nhanSu?.ten].join(' ')
					: (buoiHoc?.tenNhanSu ?? <i>Chưa cập nhật</i>)}
			</Descriptions.Item>
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

	if (!buoiHoc) return null;
	if (hideCard) return content;

	return (
		<Card className='card-big-title card-borderless' variant='borderless'>
			<Card variant='borderless'>
				<div className='fw500' style={{ fontSize: 16, marginBottom: 12 }}>
					{title}
				</div>
				{content}
			</Card>
		</Card>
	);
};

export default ThongTinBuoiHoc;
