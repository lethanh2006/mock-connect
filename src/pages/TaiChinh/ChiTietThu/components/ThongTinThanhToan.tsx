import { EMauTrangThaiThanhToanTable, ETrangThaiThanhToan } from '@/services/TaiChinh/constant';
import { Card, Col, Row, Tabs, Tag } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import HuongDanThanhToan from '../HuongDanThanhToan';
import TableDanhSachGiaoDich from './TableDanhSachGiaoDich';
import TableDanhSachKhoanThu from './TableDanhSachKhoanThu';

const ThongTinThanhToan = (props: { setVisible: any }) => {
	const { setVisible } = props;
	const { record } = useModel('taichinh.chitietthu');
	const [activeTab, setActiveTab] = useState('1');

	return (
		<Card title='Thông tin thanh toán'>
			<Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
				<Col span={24}>
					<b>Trạng thái:</b>{' '}
					{record?.status ? (
						<Tag color={EMauTrangThaiThanhToanTable?.[record.status]}>{ETrangThaiThanhToan?.[record.status] ?? ''}</Tag>
					) : (
						<i>Đang cập nhật</i>
					)}
				</Col>
				<Col span={24}>
					<b>Họ và tên người nộp:</b> {record?.customerInfo?.name ?? <i>Đang cập nhật</i>}
				</Col>
			</Row>

			<Tabs activeKey={activeTab} onChange={(tab) => setActiveTab(tab)}>
				<Tabs.TabPane key={'1'} tab='Chi tiết' />
				<Tabs.TabPane key={'2'} tab='Lịch sử thanh toán' />
			</Tabs>
			{activeTab === '1' ? (
				<TableDanhSachKhoanThu value={record?.items ?? []} />
			) : (
				<TableDanhSachGiaoDich identityCode={record?.identityCode} value={record?.paidHistory ?? []} />
			)}

			<HuongDanThanhToan setVisible={setVisible} />
		</Card>
	);
};

export default ThongTinThanhToan;
