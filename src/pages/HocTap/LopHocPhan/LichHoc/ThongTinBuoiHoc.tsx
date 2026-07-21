import { type ThoiKhoaBieu } from '@/services/DaoTao/ThoiKhoaBieu/typing';
import { colorTrangThaiUserDiemDanh, mapTrangThaiUserDiemDanhI18n } from '@/services/DaoTao/constant';
import {
	colorHinhThucGiangDay,
	EHinhThucGiangDay,
	ELoaiHinhHocTap,
	mapHinhThucGiangDayI18n,
	mapLoaiHinhHocTapI18n,
} from '@/services/HocTap/LopHocPhan/constant';
import dayjs from '@/utils/dayjs';
import { formatDate } from '@/utils/formatDate';
import { Card, CardProps, Descriptions, Space, Tag } from 'antd';
import type { JSX } from 'react';
import { useIntl } from 'umi';

const getThuI18nId = (ngay?: string) => {
	const day = dayjs(ngay).day(); // 0 = CN ... 6 = T7
	return day === 0 ? 'dangkytinchi.thu.cn' : `dangkytinchi.thu.${day + 1}`;
};

const ThongTinBuoiHoc = (props: {
	buoiHoc?: ThoiKhoaBieu.IRecord;
	title?: string | JSX.Element;
	hideCard?: boolean;
	column?: any;
	cardProps?: CardProps;
}) => {
	const intl = useIntl();
	const {
		buoiHoc,
		title = intl.formatMessage({ id: 'lophocphan.id.lichhoc.hocgannhat.thongtin' }),
		hideCard,
		column,
		cardProps,
	} = props;

	const hinhThucI18nId = buoiHoc?.hinhThucGiangDay
		? mapHinhThucGiangDayI18n[buoiHoc.hinhThucGiangDay as EHinhThucGiangDay]
		: undefined;
	const loaiHinhI18nId = buoiHoc?.loaiHinhHocTap
		? mapLoaiHinhHocTapI18n[buoiHoc.loaiHinhHocTap as ELoaiHinhHocTap]
		: undefined;
	const diemDanhI18nId = buoiHoc?.trangThaiDiemDanhCaNhan
		? mapTrangThaiUserDiemDanhI18n[buoiHoc.trangThaiDiemDanhCaNhan]
		: undefined;

	const content = (
		<Descriptions column={column ?? { xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}>
			<Descriptions.Item label={intl.formatMessage({ id: 'lophocphan.id.lichhoc.hocgannhat.ngahoc' })}>
				{buoiHoc?.ngay
					? `${intl.formatMessage({ id: getThuI18nId(buoiHoc.ngay) })}, ${formatDate(buoiHoc.ngay)}`
					: '--'}
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
						<Tag color={colorHinhThucGiangDay[buoiHoc.hinhThucGiangDay as EHinhThucGiangDay]}>
							{hinhThucI18nId ? intl.formatMessage({ id: hinhThucI18nId }) : buoiHoc.hinhThucGiangDay}
						</Tag>
					) : (
						'--'
					)}
					{loaiHinhI18nId ? (
						intl.formatMessage({ id: loaiHinhI18nId })
					) : buoiHoc?.loaiHinhHocTap ? (
						buoiHoc.loaiHinhHocTap
					) : (
						<i></i>
					)}
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
						{diemDanhI18nId ? intl.formatMessage({ id: diemDanhI18nId }) : buoiHoc.trangThaiDiemDanhCaNhan}
					</Tag>
				) : (
					''
				)}
			</Descriptions.Item>
		</Descriptions>
	);

	if (hideCard) return content;

	return (
		<Card variant='borderless' title={title} {...cardProps}>
			{content}
		</Card>
	);
};

export default ThongTinBuoiHoc;
