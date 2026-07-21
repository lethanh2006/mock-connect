import { primaryColor } from '@/services/base/constant';
import {
	colorTrangThaiCardLopHp,
	ETrangThaiCardLopHp,
	labelTrangThaiCardLopHp,
} from '@/services/DaoTao/LopHocPhan/constant';
import { ToChucNhanSu } from '@/services/ToChucNhanSu/typing';
import dayjs from '@/utils/dayjs';
import { ArrowLeftOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Card, Descriptions, Flex, Space, Tag, Tooltip, Typography } from 'antd';
import { useMemo, useState } from 'react';
import { Link, useAccess, useIntl, useModel, useNavigate } from 'umi';
import ModalThongTinGiangVien from './ModalGiangVien';
import ModalWithdraw from './ModalWithdraw';
import './style.less';

const { Title, Text } = Typography;

const ThongTinChungHeaderCard = (props: { onShowDeCuong: () => void }) => {
	const intl = useIntl();
	const { cctFilter } = useAccess();
	const { record } = useModel('lophocphan.lophocphan');
	const [selectedGiangVien, setSelectedGiangVien] = useState<ToChucNhanSu.INhanSu>();
	const [visibleGvDetailModal, setVisibleGvDetailModal] = useState(false);
	const [visibleWithdraw, setVisibleWithdraw] = useState(false);
	const navigate = useNavigate();

	const status = useMemo((): ETrangThaiCardLopHp | null => {
		const allThoiKhoaBieu = [
			...(record?.thoiKhoaBieuList ?? []),
			...(record?.children?.flatMap((child) => child.thoiKhoaBieuList ?? []) ?? []),
		];
		if (!allThoiKhoaBieu.length) return null;

		const now = dayjs();
		const isTeachingNow = allThoiKhoaBieu.some((tkb) => {
			const start = dayjs(tkb?.thoiGianBatDau ?? tkb?.ngay);
			const end = tkb?.thoiGianKetThuc ? dayjs(tkb.thoiGianKetThuc) : start.endOf('day');
			return now.isSameOrAfter(start) && now.isSameOrBefore(end);
		});
		if (isTeachingNow) return ETrangThaiCardLopHp.HIEN_TAI;

		const hasUpcoming = allThoiKhoaBieu.some((tkb) => dayjs(tkb?.thoiGianBatDau ?? tkb?.ngay).isAfter(now));
		if (hasUpcoming) return ETrangThaiCardLopHp.SAP_TOI;

		return null;
	}, [record]);

	const maLop = record?.ten || record?.soThuTuLop || record?.maLop || '--';
	const maHocPhan = record?.hocPhan?.ma || record?.maHocPhan || '--';

	return (
		<Card
			variant='borderless'
			style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0, boxShadow: 'none' }}
			styles={{ body: { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 } }}
		>
			<Flex justify='space-between' align='flex-start' gap={16} wrap>
				<div style={{ flex: 1, minWidth: 0 }}>
					<Flex align='center' gap={12} wrap>
						<Tooltip title={intl.formatMessage({ id: 'lophocphan.id.thongtinchung.quaylai' })}>
							<ArrowLeftOutlined
								style={{ color: '#333', fontSize: 14, cursor: 'pointer', flexShrink: 0 }}
								onClick={() => navigate('/hoc-tap/lop-tin-chi')}
							/>
						</Tooltip>
						<Title level={4} style={{ margin: 0, color: primaryColor }}>
							{record?.hocPhan?.ten ? (
								<Tooltip title={intl.formatMessage({ id: 'lophocphan.id.thongtinchungheader.chitiet' })}>
									<a onClick={() => props.onShowDeCuong?.()} style={{ color: primaryColor }}>
										{record?.hocPhan?.ten}
										<InfoCircleOutlined style={{ marginLeft: 8 }} />
									</a>
								</Tooltip>
							) : (
								<i>{intl.formatMessage({ id: 'lophocphan.id.thongtinchungheader.chuacapnhat' })}</i>
							)}
						</Title>
						{status ? (
							<Tag color={colorTrangThaiCardLopHp[status]}>
								{intl.formatMessage({ id: labelTrangThaiCardLopHp[status] })}
							</Tag>
						) : null}
						<Text type='secondary'>
							• {record?.hocPhan?.soTinChi ?? '--'} {intl.formatMessage({ id: 'lophocphan.tin-chi' })}
						</Text>
					</Flex>
				</div>

				<Space wrap>
					{/* {record?.lmsUrl ? (
						<a href={record.lmsUrl} target='_blank' rel='noreferrer'>
							{intl.formatMessage({ id: 'lophocphan.id.thongtinchung.hoctructuyen' })} <ExportOutlined />
						</a>
					) : null} */}
					{/* {cctFilter?.() && (
						<ButtonExtend
							tooltip={intl.formatMessage({ id: 'lophocphan.id.thongtinchungheader.withdraw' })}
							icon={<LogoutOutlined />}
							onClick={() => setVisibleWithdraw(true)}
						/>
					)} */}
				</Space>
			</Flex>

			<Descriptions
				className='highlight'
				colon={false}
				layout='vertical'
				column={{ xs: 1, sm: 2, md: 4, lg: 4, xl: 4, xxl: 4 }}
				style={{ marginTop: 16 }}
			>
				<Descriptions.Item label={intl.formatMessage({ id: 'lophocphan.id.thongtinchungheader.nhomlop' })}>
					<Text
						copyable={{
							text: String(maLop),
							tooltips: [
								intl.formatMessage({ id: 'lophocphan.card.saochep' }),
								intl.formatMessage({ id: 'lophocphan.card.dasaochep' }),
							],
						}}
					>
						{maLop}
					</Text>
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'lophocphan.id.thongtinchungheader.mahp' })}>
					<Text
						copyable={{
							text: String(maHocPhan),
							tooltips: [
								intl.formatMessage({ id: 'lophocphan.card.saochep.mahocphan' }),
								intl.formatMessage({ id: 'lophocphan.card.dasaochep.mahocphan' }),
							],
						}}
					>
						{maHocPhan}
					</Text>
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'lophocphan.id.thongtinchungheader.kyhoc' })}>
					{record?.hocKy?.ten ?? '--'}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'lophocphan.id.thongtinchungheader.gv' })}>
					{(record?.nhanSuList ?? []).length > 0 ? (
						(record?.nhanSuList ?? []).map((item, index) => (
							<span key={item?.nhanSu?._id ?? index}>
								{index > 0 ? ', ' : null}
								<Link
									to='#!'
									onClick={(e) => {
										e.preventDefault();
										setSelectedGiangVien({
											...item?.nhanSu,
											hoTen: item.nhanSu?.hoTen ?? item?.tenNhanSu ?? '',
											maCanBo: item.nhanSu?.maCanBo ?? item?.maNhanSu ?? '',
										} as ToChucNhanSu.INhanSu);
										setVisibleGvDetailModal(true);
									}}
								>
									{item?.nhanSu?.hoTen ?? item.tenNhanSu}
								</Link>
							</span>
						))
					) : (
						<Text type='secondary'>{intl.formatMessage({ id: 'lophocphan.id.thongtinchungheader.khongco' })}</Text>
					)}
				</Descriptions.Item>
			</Descriptions>

			<ModalThongTinGiangVien
				visible={visibleGvDetailModal}
				onCancel={() => setVisibleGvDetailModal(false)}
				giangVien={selectedGiangVien}
			/>

			<ModalWithdraw visible={visibleWithdraw} setVisible={setVisibleWithdraw} />
		</Card>
	);
};

export default ThongTinChungHeaderCard;
