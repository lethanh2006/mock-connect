import ButtonExtend from '@/components/Table/ButtonExtend';
import type { GiaoDich } from '@/services/TaiChinh/GiaoDich/typing';
import {
	EMaTrangThaiThanhToan,
	EMauTrangThaiThanhToanTable,
	ETrangThaiThanhToan,
	ETransactionPaymentType,
	ETransactionSourceType,
	ETransactionStatus,
} from '@/services/TaiChinh/constant';
import { inputFormat } from '@/utils/utils';
import { AppstoreAddOutlined, DollarOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Col, Descriptions, Modal, Popconfirm, Row, Space, Tabs, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import FormItemHoaDonChiTiet from '../ChiTiet/FormItem';
import FormThanhToan from '../ThanhToan/FormThanhToan';
import LichSuThanhToan from '../ThanhToan/LichSuThanhToan';
import ModalThanhToanNganHang from './ModalThanhToanNganHang';

const ThongTinThanhToan = (props: { setVisible: (val: boolean) => void; getData?: () => void }) => {
	const { setVisible, getData } = props;
	const { record: recHoaDon, visibleHuongDan, setVisibleHuongDan, getInfoMomoModel } = useModel('taichinh.hoadon');
	const { visibleThanhToan, setVisibleThanhToan } = useModel('taichinh.hoadonchitiet');
	const { getAllModel, record: recGiaoDich, loading } = useModel('taichinh.giaodich');
	const [activeTab, setActiveTab] = useState('1');

	const onChangeTab = (tab: string) => {
		setActiveTab(tab);
		if (tab === '1' && recHoaDon?.identityCode)
			getAllModel(true, undefined, {
				status: ETransactionStatus.PENDING,
				billIdentityCode: recHoaDon?.identityCode,
				fromAccount: ETransactionSourceType.EXTERNAL,
			});
	};

	useEffect(() => {
		onChangeTab('1');
	}, [recHoaDon?.identityCode]);

	const onPay = (rec: GiaoDich.IRecord) => {
		if (rec?.paymentType === ETransactionPaymentType.BANK) setVisibleHuongDan(true);
		else if (rec?.paymentType === ETransactionPaymentType.MOMO_WALLET && rec.billIdentityCode)
			getInfoMomoModel(rec.billIdentityCode).then((info) => {
				window.location.href = info.payUrl;
			});
	};

	const onCancel = (rec: GiaoDich.IRecord) => {};

	return (
		<Card title='Thông tin thanh toán'>
			<Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
				<Col span={24}>
					<Descriptions column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }} bordered>
						<Descriptions.Item label='Trạng thái'>
							{recHoaDon?.status ? (
								<Tag color={EMauTrangThaiThanhToanTable?.[recHoaDon.status]}>
									{ETrangThaiThanhToan?.[recHoaDon.status] ?? ''}
								</Tag>
							) : (
								<i>Đang cập nhật</i>
							)}
						</Descriptions.Item>
						<Descriptions.Item label='Họ tên người nộp'>
							{recHoaDon?.userFullname ?? <i>Đang cập nhật</i>}
						</Descriptions.Item>
						<Descriptions.Item label='Tổng thành tiền'>
							{inputFormat(
								recHoaDon?.billItems
									?.filter((item) => item.status !== EMaTrangThaiThanhToan.DONG)
									?.reduce((acc, item) => acc + (item.amountDue || 0), 0),
							)}{' '}
							VNĐ
						</Descriptions.Item>
						<Descriptions.Item label='Số tiền ưu đãi'>
							{inputFormat(
								recHoaDon?.billItems
									?.filter((item) => item.status !== EMaTrangThaiThanhToan.DONG)
									?.reduce((acc, item) => acc + (item.amountDiscount || 0), 0),
							)}{' '}
							VNĐ
						</Descriptions.Item>
						<Descriptions.Item label='Số tiền đã thu'>
							{inputFormat(
								recHoaDon?.billItems
									?.filter((item) => item.status !== EMaTrangThaiThanhToan.DONG)
									?.reduce((acc, item) => acc + (item.amountPaid || 0), 0),
							)}{' '}
							VNĐ
						</Descriptions.Item>
						<Descriptions.Item label='Số tiền còn lại phải thu'>
							{inputFormat(
								recHoaDon?.billItems
									?.filter((item) => item.status !== EMaTrangThaiThanhToan.DONG)
									?.reduce((acc, item) => acc + (item.amountRemaining || 0), 0),
							)}{' '}
							VNĐ
						</Descriptions.Item>
					</Descriptions>
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
									message='Có giao dịch nộp tiền đang chờ xử lý!'
									showIcon
									type='info'
									action={
										<Space wrap>
											<Button type='primary' onClick={() => onPay(recGiaoDich)} icon={<DollarOutlined />}>
												Thanh toán ngay
											</Button>
											<Popconfirm
												title='Xác nhận hủy giao dịch này?'
												onConfirm={() => onCancel && onCancel(recGiaoDich)}
											>
												<Button danger type='link'>
													Hủy giao dịch
												</Button>
											</Popconfirm>
										</Space>
									}
								/>
							) : (
								<ButtonExtend
									disabled={recHoaDon?.status === EMaTrangThaiThanhToan.DA_THANH_TOAN_DU}
									onClick={() => setVisibleThanhToan(true)}
									icon={<AppstoreAddOutlined />}
									type='primary'
									loading={loading}
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
				<FormThanhToan getData={getData} />
			</Modal>

			<ModalThanhToanNganHang visibleHuongDan={visibleHuongDan} setVisibleHuongDan={setVisibleHuongDan} />
		</Card>
	);
};

export default ThongTinThanhToan;
