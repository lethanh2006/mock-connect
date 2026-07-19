import { type ThoiKhoaBieu } from '@/services/DaoTao/ThoiKhoaBieu/typing';
import { colorTrangThaiUserDiemDanh, trangThaiUserDiemDanh } from '@/services/DaoTao/constant';
import { colorHinhThucGiangDay } from '@/services/HocTap/LopHocPhan/constant';
import { THU_TRONG_TUAN } from '@/services/SuKien/constant';
import dayjs from '@/utils/dayjs';
import { formatDate } from '@/utils/formatDate';
import { Card, Descriptions, Space, Tag } from 'antd';
import type { JSX } from 'react';
import { useIntl } from 'umi';

const ThongTinBuoiHoc = (props: {
	buoiHoc?: ThoiKhoaBieu.IRecord;
	title?: string | JSX.Element;
	hideCard?: boolean;
	column?: any;
}) => {
	const intl = useIntl();
	const {
		buoiHoc,
		title = intl.formatMessage({ id: 'lophocphan.id.lichhoc.hocgannhat.thongtin' }),
		hideCard,
		column,
	} = props;

	const content = (
		<Descriptions column={column ?? { xs: 1, sm: 1, md: 3, lg: 3, xl: 3, xxl: 3 }}>
			<Descriptions.Item label={intl.formatMessage({ id: 'lophocphan.id.lichhoc.hocgannhat.ngahoc' })}>
				{THU_TRONG_TUAN[dayjs(buoiHoc?.ngay).day()]}, {formatDate(buoiHoc?.ngay)}
			</Descriptions.Item>
			<Descriptions.Item label={intl.formatMessage({ id: 'lophocphan.id.lichhoc.hocgannhat.tiethoc' })}>
				{buoiHoc?.tietBatDau} - {buoiHoc?.tietKetThuc}
				{buoiHoc?.thoiGianBatDau && buoiHoc?.thoiGianKetThuc
					? ` (${formatDate(buoiHoc.thoiGianBatDau, 'HH:mm')} - ${formatDate(buoiHoc.thoiGianKetThuc, 'HH:mm')})`
					: ''}
			</Descriptions.Item>
			<Descriptions.Item label={intl.formatMessage({ id: 'lophocphan.id.lichhoc.hocgannhat.hinhthuc' })}>
				<Space wrap>
					{buoiHoc?.hinhThucGiangDay ? (
						<Tag color={colorHinhThucGiangDay[buoiHoc.hinhThucGiangDay]}>{buoiHoc.hinhThucGiangDay}</Tag>
					) : (
						'--'
					)}
					{buoiHoc?.loaiHinhHocTap ?? <i></i>}
				</Space>
			</Descriptions.Item>

			<Descriptions.Item label={intl.formatMessage({ id: 'lophocphan.id.lichhoc.hocgannhat.phonghoc' })}>
				{buoiHoc?.phongHoc ?? <i>{intl.formatMessage({ id: 'lophocphan.id.lichhoc.hocgannhat.chuacapnhat' })}</i>}
			</Descriptions.Item>
			<Descriptions.Item label={intl.formatMessage({ id: 'lophocphan.id.lichhoc.hocgannhat.giangvien' })}>
				{buoiHoc?.nhanSu?.ten
					? [buoiHoc.nhanSu?.hoDem, buoiHoc.nhanSu?.ten].join(' ')
					: (buoiHoc?.tenNhanSu ?? <i>{intl.formatMessage({ id: 'lophocphan.id.lichhoc.hocgannhat.chuacapnhat' })}</i>)}
			</Descriptions.Item>
			<Descriptions.Item label={intl.formatMessage({ id: 'lophocphan.id.lichhoc.hocgannhat.diemdanh' })}>
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
