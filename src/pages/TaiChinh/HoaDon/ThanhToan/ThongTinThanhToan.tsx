import { usePermissionCheck } from '@/hooks/usePermissionCheck';
import { colorTrangThaiHocSv, ETrangThaiHocSv } from '@/services/DaoTao/constant';
import type { GiaoDich } from '@/services/TaiChinh/GiaoDich/typing';
import {
	EMaTrangThaiThanhToan,
	EMauTrangThaiThanhToanTable,
	ETransactionPaymentType,
} from '@/services/TaiChinh/constant';
import { currencyFormat } from '@/utils/utils';
import {
	BankOutlined,
	BookOutlined,
	CalendarOutlined,
	DollarOutlined,
	FileOutlined,
	IdcardOutlined,
	MailOutlined,
	PhoneOutlined,
	UserOutlined,
} from '@ant-design/icons';
import { Alert, Avatar, Button, Modal, Space, Tabs, Tag, Typography } from 'antd';
import { Card } from '@/components/PageCard';
import { Col, Row } from '@/components/MyGrid';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import { disableThanhToan } from '..';
import FormItemHoaDonChiTiet from '../ChiTiet/FormItem';
import FormThanhToan from './FormThanhToan';
import LichSuThanhToan from './LichSuThanhToan';
import ModalThanhToanNganHang from './ModalThanhToanNganHang';

const { Text } = Typography;

/** Một dòng thông tin dạng nhãn trên, giá trị dưới */
const InfoItem = (props: { icon?: React.ReactNode; label: string; value?: React.ReactNode }) => (
	<div style={{ marginBottom: 4 }}>
		<Text type='secondary' style={{ fontSize: 12 }}>
			{props.icon && <span style={{ marginRight: 6 }}>{props.icon}</span>}
			{props.label}
		</Text>
		<div style={{ fontWeight: 500, color: 'var(--color-text, inherit)', wordBreak: 'break-word' }}>{props.value || '-'}</div>
	</div>
);

/** Thẻ số liệu tài chính */
const StatBox = (props: { label: string; value: number | string; color: string }) => (
	<div
		style={{
			background: 'var(--color-bg-container, #fafafa)',
			border: '1px solid var(--color-border-secondary, #f0f0f0)',
			borderRadius: 8,
			padding: '12px 16px',
			height: '100%',
		}}
	>
		<div style={{ fontSize: 12, color: 'var(--color-text-secondary, #8c8c8c)', marginBottom: 6 }}>{props.label}</div>
		<div style={{ fontSize: 18, fontWeight: 700, color: props.color, lineHeight: 1.2 }}>
			{typeof props.value === 'number' ? `${currencyFormat(props.value)} VND` : props.value}
		</div>
	</div>
);

const ThongTinThanhToan = (props: { setVisible: (val: boolean) => void; getData?: () => void }) => {
	const intl = useIntl();
	const { hasPermission } = usePermissionCheck();
	const { setVisible, getData } = props;
	const canPay = hasPermission('tc.transaction:pay');
	const { record: recHoaDon } = useModel('taichinh.hoadon');
	const { visibleThanhToan, setVisibleThanhToan } =
		useModel('taichinh.hoadonchitiet');

	const {
		record: recGiaoDich,
		setRecord,
		loading,
		visibleHuongDan,
		setVisibleHuongDan,
		thanhToanMomoModel,
		huyThanhToanModel,
	} = useModel('taichinh.giaodich');
	const { record: recDotThu, getByIdModel: getDotThu } = useModel('taichinh.dotthu');
	const [activeTab, setActiveTab] = useState('1');

	// Tổng quan tài chính
	const phaiThu = recHoaDon?.soTienPhaiThu ?? 0;
	const khuyenMai = recHoaDon?.soTienKhuyenMai ?? 0;
	const conLai = recHoaDon?.soTienConLai ?? 0;
	const daThanhToan = recHoaDon?.soTienDaThu ?? 0;

	// Trạng thái thanh toán
	const statusText = recHoaDon?.status
		? intl.formatMessage({ id: `taichinh.hoadon.status.${recHoaDon.status}` })
		: undefined;
	const statusColor = EMauTrangThaiThanhToanTable[recHoaDon?.status as EMaTrangThaiThanhToan];
	const ngoaiThoiGianThanhToan = disableThanhToan(recHoaDon);

	// Chữ cái đầu cho avatar
	const fullname: string = recHoaDon?.userFullname || '';
	const initial = (fullname.trim().split(' ').filter(Boolean).pop() || '?').charAt(0).toUpperCase();

	// Trạng thái sinh viên
	const trangThaiSinhVien: string | undefined =
		recHoaDon?.userTrangThaiSV ||
		recHoaDon?.userTrangThaiHoc ||
		recHoaDon?.userMetadata?.trangThaiHoc ||
		recHoaDon?.userMetadata?.trangThaiSv;

	const daRelease: boolean = !!recHoaDon?.dotThu?.daRelease || !!recHoaDon?.dotThu?.thoiGianRelease;

	/** Get giao dịch pending */
	// const getGiaoDich = () =>
	// 	getAllModel(true, undefined, {
	// 		status: ETransactionStatus.PENDING,
	// 		billIdentityCode: recHoaDon?.identityCode,
	// 		fromAccount: ETransactionSourceType.EXTERNAL,
	// 	});

	const onChangeTab = (tab: string) => {
		setActiveTab(tab);
		// Get giao dịch nộp tiền chưa hoàn tất
		// if (tab === '1' && recHoaDon?.identityCode) getGiaoDich();
	};

	useEffect(() => {
		onChangeTab('1');
	}, [recHoaDon?.identityCode]);

	const handleShowModalThanhToan = async (tran: GiaoDich.IRecord) => {
		// Get đợt thu trước khi hiển thị modal để lấy thông tin kênh thanh toán
		if (recDotThu?._id !== tran.idDotThu || (!!recDotThu.kenhThanhToanId && !recDotThu.kenhThanhToan?._id))
			await getDotThu(tran.idDotThu);
		// Set record để hiển thị thông tin thanh toán
		setRecord(tran);
		setVisibleHuongDan(true);
	};

	const onPay = (rec: GiaoDich.IRecord) => {
		if (rec?.paymentType === ETransactionPaymentType.BANK) {
			handleShowModalThanhToan(rec);
		} else if (rec?.paymentType === ETransactionPaymentType.MOMO_WALLET && rec.identityCode)
			thanhToanMomoModel(rec.identityCode);
	};

	const onCancel = (rec: GiaoDich.IRecord) => {
		if (rec._id)
			return huyThanhToanModel(rec._id)
				.then(() => {
					// getGiaoDich();
					if (getData) getData();
				})
				.catch((er: unknown) => console.log(er));

		return Promise.reject();
	};

	const pendingPaymentAlert =
		canPay &&
			recGiaoDich?._id &&
			recGiaoDich.paymentType !== ETransactionPaymentType.MANUAL &&
			!ngoaiThoiGianThanhToan ? (
			<Alert
				message={intl.formatMessage({ id: 'taichinh.thanhtoan.alert.pending.title' })}
				description={intl.formatMessage({ id: 'taichinh.thanhtoan.alert.pending.desc' })}
				showIcon
				type='info'
				action={
					<Button type='primary' onClick={() => onPay(recGiaoDich)} icon={<DollarOutlined />} loading={loading}>
						{intl.formatMessage({ id: 'taichinh.thanhtoan.button.thanhtoan' })}
					</Button>
				}
			/>
		) : null;

	return (
		<Card title={intl.formatMessage({ id: 'taichinh.thanhtoan.title' })}>
			{/* Header sinh viên */}
			<div
				style={{
					padding: 16,
					borderRadius: 10,
					background: 'linear-gradient(135deg, #f0f5ff 0%, #f9f0ff 100%)',
					border: '1px solid #f0f0f0',
					marginBottom: 16,
				}}
			>
				<div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
					<Avatar size={64} style={{ background: 'var(--color-primary, #1677ff)', flexShrink: 0 }}>
						{initial}
					</Avatar>

					<div style={{ flex: 1, minWidth: 0 }}>
						<Space align='center' wrap size={8}>
							<span style={{ fontSize: 18, fontWeight: 700 }}>
								{fullname || intl.formatMessage({ id: 'taichinh.thanhtoan.info.sinhvien' })}
							</span>
							{statusText && <Tag color={statusColor}>{statusText}</Tag>}
							{trangThaiSinhVien && (
								<Tag color={colorTrangThaiHocSv[trangThaiSinhVien as ETrangThaiHocSv]}>{trangThaiSinhVien}</Tag>
							)}
						</Space>
					</div>
				</div>

				<Row gutter={[16, 8]} style={{ marginTop: 16, paddingLeft: 80 }}>
					<Col xs={12} md={8}>
						<InfoItem
							icon={<UserOutlined />}
							label={intl.formatMessage({ id: 'taichinh.thanhtoan.info.masinhvien' })}
							value={recHoaDon?.userCode}
						/>
					</Col>
					<Col xs={12} md={8}>
						<InfoItem
							icon={<MailOutlined />}
							label={intl.formatMessage({ id: 'taichinh.thanhtoan.info.email' })}
							value={recHoaDon?.userEmail}
						/>
					</Col>
					<Col xs={12} md={8}>
						<InfoItem
							icon={<PhoneOutlined />}
							label={intl.formatMessage({ id: 'taichinh.thanhtoan.info.sodienthoai' })}
							value={recHoaDon?.userPhone}
						/>
					</Col>
					<Col xs={12} md={8}>
						<InfoItem
							icon={<CalendarOutlined />}
							label={intl.formatMessage({ id: 'taichinh.thanhtoan.info.ngaysinh' })}
							value={recHoaDon?.userDOB}
						/>
					</Col>
					<Col xs={12} md={8}>
						<InfoItem
							icon={<BankOutlined />}
							label={intl.formatMessage({ id: 'taichinh.thanhtoan.info.khoa' })}
							value={recHoaDon?.userTenKhoa || recHoaDon?.userMaKhoaSinhVien}
						/>
					</Col>
					<Col xs={12} md={8}>
						<InfoItem
							icon={<BookOutlined />}
							label={intl.formatMessage({ id: 'taichinh.thanhtoan.info.nganh' })}
							value={recHoaDon?.userTenNganh || recHoaDon?.userMaNganh}
						/>
					</Col>
					<Col xs={12} md={8}>
						<InfoItem
							icon={<IdcardOutlined />}
							label={intl.formatMessage({ id: 'taichinh.thanhtoan.info.trangthaisinhvien' })}
							value={trangThaiSinhVien}
						/>
					</Col>
				</Row>
			</div>

			{/* Tổng quan tài chính */}
			<Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
				<Col xs={12} md={6}>
					<StatBox
						label={intl.formatMessage({ id: 'taichinh.thanhtoan.stat.tongphiphainop' })}
						value={phaiThu}
						color='#1677ff'
					/>
				</Col>

				<Col xs={12} md={6}>
					<StatBox
						label={intl.formatMessage({ id: 'taichinh.thanhtoan.stat.tongphigiamtru' })}
						value={khuyenMai}
						color='#faad14'
					/>
				</Col>
				<Col xs={12} md={6}>
					<StatBox
						label={intl.formatMessage({ id: 'taichinh.thanhtoan.stat.tongdathanhtoan' })}
						value={daThanhToan}
						color='#52c41a'
					/>
				</Col>
				<Col xs={12} md={6}>
					<StatBox
						label={intl.formatMessage({ id: 'taichinh.thanhtoan.stat.tongcanthanhtoan' })}
						value={conLai}
						color='#ff4d4f'
					/>
				</Col>
				{/* <Col xs={12} md={6}>
					<StatBox
						label='Hạn thanh toán'
						value={dayjs(rec?.ngayHetHanThanhToan).format('DD/MM/YYYY')}
						color={'#ff4d4f'}
					/>
				</Col> */}
			</Row>

			{/* Thông tin phiếu thu */}
			<Card
				size='small'
				title={intl.formatMessage({ id: 'taichinh.thanhtoan.phieuthu.title' })}
				style={{ marginBottom: 16 }}
			>
				<Row gutter={[16, 8]}>
					{/* <Col xs={12} md={8}>
						<InfoItem
							icon={<ProfileOutlined />}
							label='Mã phiếu thu'
							value={rec?.billIdentityCode || rec?.identityCode}
						/>
					</Col> */}
					<Col xs={12} md={12}>
						<InfoItem
							icon={<CalendarOutlined />}
							label={intl.formatMessage({ id: 'taichinh.thanhtoan.phieuthu.hanthanhtoan' })}
							value={
								recHoaDon?.ngayHetHanThanhToan ? (
									<span style={{ color: '#ff4d4f', fontWeight: 700 }}>
										{dayjs(recHoaDon.ngayHetHanThanhToan).format('DD/MM/YYYY')}
									</span>
								) : (
									'-'
								)
							}
						/>
					</Col>
					<Col xs={12} md={12}>
						<InfoItem
							icon={<FileOutlined />}
							label={intl.formatMessage({ id: 'taichinh.thanhtoan.phieuthu.trangthai' })}
							value={
								<Tag color={daRelease ? 'success' : 'warning'}>
									{daRelease
										? intl.formatMessage({ id: 'taichinh.thanhtoan.phieuthu.darelease' })
										: intl.formatMessage({ id: 'taichinh.thanhtoan.phieuthu.chuarelease' })}
								</Tag>
							}
						/>
					</Col>
					{/* {daRelease && recHoaDon?.dotThu?.tenNguoiRelease && (
						<Col xs={12} md={8}>
							<InfoItem
								label={intl.formatMessage({ id: 'taichinh.thanhtoan.phieuthu.nguoirelease' })}
								value={recHoaDon?.dotThu?.tenNguoiRelease}
							/>
						</Col>
					)}
					{daRelease && recHoaDon?.dotThu?.thoiGianRelease && (
						<Col xs={12} md={8}>
							<InfoItem
								label={intl.formatMessage({ id: 'taichinh.thanhtoan.phieuthu.thoigianrelease' })}
								value={dayjs(recHoaDon?.dotThu?.thoiGianRelease).format('HH:mm DD/MM/YYYY')}
							/>
						</Col>
					)} */}
					{/* <Col xs={24}>
							<InfoItem
								icon={<FileTextOutlined />}
								label={intl.formatMessage({ id: 'taichinh.thanhtoan.phieuthu.ghichu' })}
								value={recHoaDon?.ghiChu}
							/>
						</Col> */}
				</Row>
			</Card>

			<Card size='small' title={intl.formatMessage({ id: 'taichinh.thanhtoan.phieuthu.chitietgiaodich' })}>
				<Tabs
					activeKey={activeTab}
					onChange={onChangeTab}
					items={[
						{
							key: '1',
							label: intl.formatMessage({ id: 'taichinh.thanhtoan.phieuthu.tab.chitiet' }),
							children: <FormItemHoaDonChiTiet />,
						},
						{
							key: '2',
							label: intl.formatMessage({ id: 'taichinh.thanhtoan.phieuthu.tab.lichsu' }),
							children: (
								<LichSuThanhToan onPay={onPay} onCancel={onCancel} ngoaiThoiGianThanhToan={ngoaiThoiGianThanhToan} />
							),
						},
					]}
				/>
			</Card>

			<div style={{ marginTop: 18 }} className='form-footer'>
				<Button onClick={() => setVisible(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
			</div>

			<ModalThanhToanNganHang
				visible={visibleHuongDan}
				onOk={() => {
					// if (activeTab === '1') getGiaoDich();
					if (getData) getData();
					setVisibleHuongDan(false);
				}}
			/>
			<Modal
				title={intl.formatMessage({ id: 'taichinh.thanhtoan.title' })}
				open={visibleThanhToan}
				onCancel={() => setVisibleThanhToan(false)}
				footer={null}
				width={1000}
				maskClosable={false}
			>
				<FormThanhToan
					getData={() => {
						// if (activeTab === '1') getGiaoDich();
						if (getData) getData();
					}}
				/>
			</Modal>


		</Card>
	);
};

export default ThongTinThanhToan;
