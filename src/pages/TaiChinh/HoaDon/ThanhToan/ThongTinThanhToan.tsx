import ButtonExtend from '@/components/Table/ButtonExtend';
import type { GiaoDich } from '@/services/TaiChinh/GiaoDich/typing';
import {
	EMaTrangThaiThanhToan,
	ETransactionPaymentType,
	ETransactionSourceType,
	ETransactionStatus,
} from '@/services/TaiChinh/constant';
import { AppstoreAddOutlined, DollarOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Col, Modal, Popconfirm, Row, Space, Tabs } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import DesThongTinHoaDon from '../ChiTiet/DesThongTin';
import FormItemHoaDonChiTiet from '../ChiTiet/FormItem';
import FormThanhToan from '../ThanhToan/FormThanhToan';
import LichSuThanhToan from '../ThanhToan/LichSuThanhToan';
import ModalThanhToanNganHang from './ModalThanhToanNganHang';

const ThongTinThanhToan = (props: { setVisible: (val: boolean) => void; getData?: () => void }) => {
	const { setVisible, getData } = props;
	const { record: recHoaDon } = useModel('taichinh.hoadon');
	const { visibleThanhToan, setVisibleThanhToan } = useModel('taichinh.hoadonchitiet');
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
	const [activeTab, setActiveTab] = useState('1');
	const ngoaiThoiGianThanhToan =
		!recHoaDon?.dotThu?.thoiGianBatDau ||
		!recHoaDon.dotThu.thoiGianKetThuc ||
		moment().isBefore(recHoaDon.dotThu.thoiGianBatDau) ||
		moment().isAfter(recHoaDon.dotThu.thoiGianKetThuc);

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

	const onPay = (rec: GiaoDich.IRecord) => {
		if (rec?.paymentType === ETransactionPaymentType.BANK) {
			setRecord(rec);
			setVisibleHuongDan(true);
		} else if (rec?.paymentType === ETransactionPaymentType.MOMO_WALLET && rec.identityCode)
			thanhToanMomoModel(rec.identityCode);
	};

	const onCancel = (rec: GiaoDich.IRecord) => {
		if (rec._id)
			huyThanhToanModel(rec._id)
				.then(() => {
					getGiaoDich();
					if (getData) getData();
				})
				.catch((er) => console.log(er));
	};

	return (
		<Card title='Thông tin thanh toán'>
			<Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
				<Col span={24}>
					<DesThongTinHoaDon />
				</Col>

				<Col span={24}>
					<Tabs activeKey={activeTab} onChange={(tab) => onChangeTab(tab)}>
						<Tabs.TabPane key={'1'} tab='Chi tiết' />
						<Tabs.TabPane key={'2'} tab='Lịch sử thanh toán' />
					</Tabs>

					{activeTab === '1' ? (
						<>
							{recGiaoDich?._id && recGiaoDich.paymentType !== ETransactionPaymentType.MANUAL ? (
								<Alert
									message='Có giao dịch nộp tiền đang chờ xử lý! Bạn đã thực hiện thanh toán chưa?'
									showIcon
									type='info'
									action={
										<Space wrap>
											<Button
												type='primary'
												onClick={() => onPay(recGiaoDich)}
												icon={<DollarOutlined />}
												loading={loading}
											>
												Thanh toán ngay
											</Button>
											{/* <Popconfirm title='Xác nhận hủy giao dịch này?' onConfirm={() => onCancel(recGiaoDich)}>
												<Button danger type='link'>
													Hủy giao dịch
												</Button>
											</Popconfirm> */}
										</Space>
									}
								/>
							) : (
								<ButtonExtend
									disabled={recHoaDon?.status === EMaTrangThaiThanhToan.DA_THANH_TOAN_DU || ngoaiThoiGianThanhToan}
									onClick={() => setVisibleThanhToan(true)}
									icon={<AppstoreAddOutlined />}
									type='primary'
									loading={loading}
									tooltip={ngoaiThoiGianThanhToan ? 'Ngoài thời gian thanh toán' : undefined}
								>
									Thanh toán
								</ButtonExtend>
							)}

							<FormItemHoaDonChiTiet />
						</>
					) : (
						<LichSuThanhToan onPay={onPay} onCancel={onCancel} />
					)}
				</Col>
			</Row>

			<div style={{ marginTop: 18 }} className='form-footer'>
				<Button onClick={() => setVisible(false)}>Đóng</Button>
			</div>

			<Modal
				title='Thông tin thanh toán'
				visible={visibleThanhToan}
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

			<ModalThanhToanNganHang
				visible={visibleHuongDan}
				onOk={() => {
					if (activeTab === '1') getGiaoDich();
					if (getData) getData();
					setVisibleHuongDan(false);
				}}
			/>
		</Card>
	);
};

export default ThongTinThanhToan;
