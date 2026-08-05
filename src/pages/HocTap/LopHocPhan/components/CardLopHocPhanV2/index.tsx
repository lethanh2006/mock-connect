import {
	colorTrangThaiCardLopHp,
	ETrangThaiCardLopHp,
	labelTrangThaiCardLopHp,
} from '@/services/DaoTao/LopHocPhan/constant';
import type { LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import dayjs from '@/utils/dayjs';
import { getPublicAssetPath } from '@/utils/path';
import { Avatar, Card, Flex, Tag, Typography } from 'antd';
import { useMemo } from 'react';
import { history, useIntl } from 'umi';
import './style.less';

const { Text } = Typography;

type CardLopHocPhanV2Props = {
	lop: any;
	isHienTai?: boolean;
	isKeTiep?: boolean;
};

const CardLopHocPhanV2 = ({ lop, isHienTai, isKeTiep }: CardLopHocPhanV2Props) => {
	const intl = useIntl();
	const t = (id: string) => intl.formatMessage({ id });

	const maLop = String(lop?.ten || lop?.maLop || '--');
	const maHocPhan = String(lop?.maHocPhan || '--');
	const tenHocPhan = lop?.hocPhan?.ten || lop?.ten || '--';
	const soTinChi = lop?.hocPhan?.soTinChi;
	const nhanSuList: LopHocPhan.IRecordNhanSuLopHP[] = lop?.nhanSuList ?? [];

	const getNhanSuAvatar = (item: LopHocPhan.IRecordNhanSuLopHP) =>
		item.nhanSu?.urlAnhDaiDien ||
		getPublicAssetPath(`images/${item.nhanSu?.gioiTinh === 'Nữ' ? 'teacher-female.svg' : 'teacher-male.svg'}`);

	const getNhanSuName = (item: LopHocPhan.IRecordNhanSuLopHP) =>
		item.nhanSu?.hoTen ||
		(item.nhanSu?.ten ? [item.nhanSu.hoDem, item.nhanSu.ten].filter(Boolean).join(' ') : item.tenNhanSu) ||
		'';

	const status = useMemo(() => {
		if (isHienTai) return ETrangThaiCardLopHp.HIEN_TAI;
		if (isKeTiep) return ETrangThaiCardLopHp.SAP_TOI;

		const allTkb = [
			...(lop?.thoiKhoaBieuList ?? []),
			...(lop?.children?.flatMap((child: any) => child?.thoiKhoaBieuList ?? []) ?? []),
		];
		if (!allTkb.length) return undefined;

		const hasUpcoming = allTkb.some((tkb: any) => dayjs(tkb?.thoiGianBatDau ?? tkb?.ngay).isAfter(dayjs()));

		return hasUpcoming ? ETrangThaiCardLopHp.SAP_TOI : ETrangThaiCardLopHp.DANG_HOC;
	}, [isHienTai, isKeTiep, lop]);

	return (
		<div className='card-lhp-v2'>
			<Card
				variant='borderless'
				className='card-lhp-v2__inner'
				onClick={() => history.push(`/hoc-tap/lop-tin-chi/${lop._id}`)}
			>
				<Flex justify='space-between' align='center' gap={8} className='card-lhp-v2__header'>
					<Flex align='center' gap={8} style={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
						<Text
							className='card-lhp-v2__code'
							style={{ flex: '0 1 auto' }}
							ellipsis={{ tooltip: maLop }}
							copyable={{
								text: maLop,
								tooltips: [t('lophocphan.card.saochep'), t('lophocphan.card.dasaochep')],
							}}
						>
							{maLop}
						</Text>
						<span className='card-lhp-v2__dot' />
						<Text
							className='card-lhp-v2__code'
							style={{ flex: '0 1 auto' }}
							ellipsis={{ tooltip: maHocPhan }}
							copyable={{
								text: maHocPhan,
								tooltips: [t('lophocphan.card.saochep.mahocphan'), t('lophocphan.card.dasaochep.mahocphan')],
							}}
						>
							{maHocPhan}
						</Text>
					</Flex>
					{status ? (
						<Tag bordered={false} color={colorTrangThaiCardLopHp[status]} className='card-lhp-v2__status'>
							{t(labelTrangThaiCardLopHp[status])}
						</Tag>
					) : null}
				</Flex>

				<div className='card-lhp-v2__title'>{tenHocPhan}</div>

				<Flex justify='space-between' align='center' className='card-lhp-v2__footer'>
					<span>{soTinChi != null ? `${soTinChi} ${t('lophocphan.tin-chi')}` : `-- ${t('lophocphan.tin-chi')}`}</span>
					{nhanSuList.length > 0 ? (
						<Avatar.Group
							size={24}
							max={{
								count: 3,
								popover: { trigger: 'click' },
							}}
						>
							{nhanSuList.map((item, index) => {
								const name = getNhanSuName(item);
								return (
									<Avatar
										key={item._id ?? item.nhanSuSsoId ?? item.maNhanSu ?? index}
										src={getNhanSuAvatar(item)}
										alt={name}
									>
										{!item.nhanSu?.urlAnhDaiDien && name ? name.slice(0, 1).toUpperCase() : null}
									</Avatar>
								);
							})}
						</Avatar.Group>
					) : null}
				</Flex>
			</Card>
		</div>
	);
};

export default CardLopHocPhanV2;
