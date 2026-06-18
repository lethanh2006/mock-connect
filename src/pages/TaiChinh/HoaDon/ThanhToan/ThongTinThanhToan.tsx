import type { GiaoDich } from '@/services/TaiChinh/GiaoDich/typing';
import {
	EMaTrangThaiThanhToan,
	EMauTrangThaiThanhToanTable,
	ETrangThaiThanhToan,
	ETransactionPaymentType,
	ETransactionSourceType,
	ETransactionStatus,
} from '@/services/TaiChinh/constant';
import { currencyFormat } from '@/utils/utils';
import { CalendarOutlined, MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Col, Modal, Row, Space, Tabs, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import { disableThanhToan } from '..';
import FormItemHoaDonChiTiet from '../ChiTiet/FormItem';
import FormThanhToan from '../ThanhToan/FormThanhToan';
import LichSuThanhToan from './LichSuThanhToan';

const { Text } = Typography;

/** Một dòng thông tin dạng nhãn trên, giá trị dưới */
const InfoItem = (props: { icon?: React.ReactNode; label: string; value?: React.ReactNode }) => (
	<div style={{ marginBottom: 4 }}>
		<Text type='secondary' style={{ fontSize: 12 }}>
			{props.icon && <span style={{ marginRight: 6 }}>{props.icon}</span>}
			{props.label}
		</Text>
		<div style={{ fontWeight: 500, color: '#1f1f1f', wordBreak: 'break-word' }}>{props.value || '-'}</div>
	</div>
);

/** Thẻ số liệu tài chính */
const StatBox = (props: { label: string; value: number | string; color: string }) => (
	<div
		style={{
			background: '#fafafa',
			border: '1px solid #f0f0f0',
			borderRadius: 8,
			padding: '12px 16px',
			height: '100%',
		}}
	>
		<div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 6 }}>{props.label}</div>
		<div style={{ fontSize: 18, fontWeight: 700, color: props.color, lineHeight: 1.2 }}>
			{typeof props.value === 'number' ? `${currencyFormat(props.value)} VND` : props.value}
		</div>
	</div>
);

const ThongTinThanhToan = (props: { setVisible: (val: boolean) => void; getData?: () => void }) => {
	const intl = useIntl();
	const { setVisible, getData } = props;
	const { record: recHoaDon } = useModel('taichinh.hoadon');
	const { visibleThanhToan, setVisibleThanhToan, xemRutGonChiTiet, setXemRutGonChiTiet } =
		useModel('taichinh.hoadonchitiet');
	const {
		getAllModel,
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
	const daThu = recHoaDon?.soTienDaThu ?? 0;
	const khuyenMai = recHoaDon?.soTienKhuyenMai ?? 0;
	const conLai = recHoaDon?.soTienConLai ?? 0;
	const daThanhToan = recHoaDon?.soTienDaThu ?? 0;

	// Trạng thái thanh toán
	const statusText: string | undefined = ETrangThaiThanhToan[recHoaDon?.status as EMaTrangThaiThanhToan];
	const statusColor = EMauTrangThaiThanhToanTable[recHoaDon?.status as EMaTrangThaiThanhToan];

	// Chữ cái đầu cho avatar
	const fullname: string = recHoaDon?.userFullname || '';
	const initial = (fullname.trim().split(' ').filter(Boolean).pop() || '?').charAt(0).toUpperCase();

	/** Get giao dịch pending */
	const getGiaoDich = () =>
		getAllModel(true, undefined, {
			status: ETransactionStatus.PENDING,
			billIdentityCode: recHoaDon?.identityCode,
			fromAccount: ETransactionSourceType.EXTERNAL,
		});

	const onChangeTab = (tab: string) => {
		setActiveTab(tab);
		// Get giao dịch nộp tiền chưa hoàn tất
		if (tab === '1' && recHoaDon?.identityCode) getGiaoDich();
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
					getGiaoDich();
					if (getData) getData();
				})
				.catch((er) => console.log(er));
		else return Promise.reject();
	};

	return (
		<Card title={intl.formatMessage({ id: 'taichinh.thanhtoan.title' })}>
			<>
				{/* Header sinh viên */}
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: 16,
						padding: 16,
						borderRadius: 10,
						background: 'linear-gradient(135deg, #f0f5ff 0%, #f9f0ff 100%)',
						border: '1px solid #f0f0f0',
						marginBottom: 16,
					}}
				>
					<Avatar size={64} style={{ background: 'var(--color-primary, #1677ff)', flexShrink: 0 }}>
						{initial}
					</Avatar>

					<div style={{ flex: 1, minWidth: 0 }}>
						<Space align='center' wrap size={8}>
							<span style={{ fontSize: 18, fontWeight: 700 }}>{fullname || 'Sinh viên'}</span>
							{statusText && <Tag color={statusColor}>{statusText}</Tag>}
						</Space>
						<div style={{ marginTop: 4, color: '#595959' }}>
							<Space split={<span style={{ color: '#d9d9d9' }}>|</span>} wrap size={8}>
								<span>
									<UserOutlined style={{ marginRight: 4 }} />
									{recHoaDon?.userCode || '-'}
								</span>
							</Space>
						</div>
						<div style={{ marginTop: 4, color: '#595959' }}>
							<Space wrap size={16}>
								<span>
									<MailOutlined style={{ marginRight: 4 }} />
									{recHoaDon?.userEmail || '-'}
								</span>
								<span>
									<PhoneOutlined style={{ marginRight: 4 }} />
									{recHoaDon?.userPhone || '-'}
								</span>
							</Space>
						</div>
					</div>

					{recHoaDon?.ngayHetHanThanhToan && (
						<div style={{ flexShrink: 0, textAlign: 'right' }}>
							<Text type='secondary' style={{ fontSize: 12 }}>
								<CalendarOutlined style={{ marginRight: 4 }} />
								Hạn thanh toán
							</Text>
							<div style={{ fontSize: 16, fontWeight: 700, color: '#ff4d4f' }}>
								{dayjs(recHoaDon.ngayHetHanThanhToan).format('DD/MM/YYYY')}
							</div>
						</div>
					)}
				</div>

				{/* Tổng quan tài chính */}
				<Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
					<Col xs={12} md={6}>
						<StatBox label='Tổng charge (1)' value={phaiThu} color='#1677ff' />
					</Col>

					<Col xs={12} md={6}>
						<StatBox label='Tổng deduction (2)' value={khuyenMai} color='#faad14' />
					</Col>
					<Col xs={12} md={6}>
						<StatBox label='Số tiền đã thanh toán (3)' value={daThanhToan} color='#52c41a' />
					</Col>
					<Col xs={12} md={6}>
						<StatBox label='Số tiền cần thanh toán (1-2-3)' value={conLai} color='#ff4d4f' />
					</Col>
				</Row>

				{/* Thông tin sinh viên */}
				<Card size='small' title='Thông tin sinh viên' style={{ marginBottom: 16 }}>
					<Row gutter={[16, 8]}>
						<Col xs={12} md={8}>
							<InfoItem icon={<CalendarOutlined />} label='Ngày sinh' value={recHoaDon?.userDOB} />
						</Col>
						<Col xs={12} md={8}>
							<InfoItem label='Khoá' value={recHoaDon?.userTenKhoa || recHoaDon?.userMaKhoaSinhVien} />
						</Col>
						<Col xs={12} md={8}>
							<InfoItem label='Ngành' value={recHoaDon?.userTenNganh || recHoaDon?.userMaNganh} />
						</Col>

						{/* {recHoaDon?.ghiChu && ( */}
						<Col xs={24}>
							<InfoItem label='Ghi chú' value={recHoaDon?.ghiChu} />
						</Col>
						{/* )} */}
					</Row>
				</Card>

				<Card size='small' title='Chi tiết giao dịch'>
					<Tabs
						activeKey={activeTab}
						onChange={onChangeTab}
						items={[
							{
								key: '1',
								label: 'Chi tiết',
								children: <FormItemHoaDonChiTiet />,
							},
							{
								key: '2',
								label: 'Lịch sử giao dịch',
								children: (
									<LichSuThanhToan
										onPay={onPay}
										onCancel={onCancel}
										ngoaiThoiGianThanhToan={disableThanhToan(recHoaDon)}
									/>
								),
							},
						]}
					/>
				</Card>
			</>

			<div style={{ marginTop: 18 }} className='form-footer'>
				<Button onClick={() => setVisible(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
			</div>

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
						if (activeTab === '1') getGiaoDich();
						if (getData) getData();
					}}
				/>
			</Modal>

			{/* <ModalThanhToanNganHang
			visible={visibleHuongDan}
			onOk={() => {
				if (activeTab === '1') getGiaoDich();
				if (getData) getData();
				setVisibleHuongDan(false);
			}}
		/> */}
		</Card>
	);
};

export default ThongTinThanhToan;
