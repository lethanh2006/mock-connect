import ButtonExtend from '@/components/Table/ButtonExtend';
import { EMaTrangThaiThanhToan, EMauTrangThaiThanhToanTable, ETrangThaiThanhToan } from '@/services/TaiChinh/constant';
import { inputFormat } from '@/utils/utils';
import { AppstoreAddOutlined } from '@ant-design/icons';
import { Button, Card, Col, Descriptions, Modal, Row, Tabs, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import FormItemHoaDonChiTiet from '../ChiTiet/FormItem';
import FormThanhToan from '../ThanhToan/FormThanhToan';
import LichSuThanhToan from '../ThanhToan/LichSuThanhToan';
import ModalThanhToanNganHang from './ModalThanhToanNganHang';

const ThongTinThanhToan = (props: { setVisible: (val: boolean) => void; getData?: () => void }) => {
	const { setVisible, getData } = props;
	const { record, visibleHuongDan, setVisibleHuongDan } = useModel('taichinh.hoadon');
	const { selectedIds, setSelectedIds, visibleThanhToan, setVisibleThanhToan } = useModel('taichinh.hoadonchitiet');
	const [activeTab, setActiveTab] = useState('1');

	useEffect(() => {
		setSelectedIds([]);
	}, [record?._id]);

	return (
		<Card title='Thông tin thanh toán'>
			<Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
				<Col span={24}>
					<Descriptions column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }} bordered>
						<Descriptions.Item label='Trạng thái'>
							{record?.status ? (
								<Tag color={EMauTrangThaiThanhToanTable?.[record.status]}>
									{ETrangThaiThanhToan?.[record.status] ?? ''}
								</Tag>
							) : (
								<i>Đang cập nhật</i>
							)}
						</Descriptions.Item>
						<Descriptions.Item label='Họ tên người nộp'>
							{record?.userFullname ?? <i>Đang cập nhật</i>}
						</Descriptions.Item>
						<Descriptions.Item label='Tổng thành tiền'>
							{inputFormat(
								record?.billItems
									?.filter((item) => item.status !== EMaTrangThaiThanhToan.DONG)
									?.reduce((acc, item) => acc + (item.amountDue || 0), 0),
							)}{' '}
							VNĐ
						</Descriptions.Item>
						<Descriptions.Item label='Số tiền ưu đãi'>
							{inputFormat(
								record?.billItems
									?.filter((item) => item.status !== EMaTrangThaiThanhToan.DONG)
									?.reduce((acc, item) => acc + (item.amountDiscount || 0), 0),
							)}{' '}
							VNĐ
						</Descriptions.Item>
						<Descriptions.Item label='Số tiền đã thu'>
							{inputFormat(
								record?.billItems
									?.filter((item) => item.status !== EMaTrangThaiThanhToan.DONG)
									?.reduce((acc, item) => acc + (item.amountPaid || 0), 0),
							)}{' '}
							VNĐ
						</Descriptions.Item>
						<Descriptions.Item label='Số tiền còn lại phải thu'>
							{inputFormat(
								record?.billItems
									?.filter((item) => item.status !== EMaTrangThaiThanhToan.DONG)
									?.reduce((acc, item) => acc + (item.amountRemaining || 0), 0),
							)}{' '}
							VNĐ
						</Descriptions.Item>
					</Descriptions>
				</Col>

				<Col span={24}>
					<Tabs activeKey={activeTab} onChange={(tab) => setActiveTab(tab)}>
						<Tabs.TabPane key={'1'} tab='Chi tiết' />
						<Tabs.TabPane key={'2'} tab='Lịch sử thanh toán' />
					</Tabs>

					{activeTab === '1' ? (
						<>
							<ButtonExtend
								disabled={record?.status === EMaTrangThaiThanhToan.DA_THANH_TOAN_DU || !selectedIds?.length}
								onClick={() => setVisibleThanhToan(true)}
								icon={<AppstoreAddOutlined />}
								type='primary'
							>
								Thanh toán
							</ButtonExtend>

							<FormItemHoaDonChiTiet isThanhToan />
						</>
					) : (
						<LichSuThanhToan />
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
