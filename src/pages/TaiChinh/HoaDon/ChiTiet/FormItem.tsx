import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import type { HoaDon } from '@/services/TaiChinh/HoaDon/typing';
import { inputFormat } from '@/utils/utils';
import { AppstoreAddOutlined } from '@ant-design/icons';
import { Col, Row, Space, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import { disableThanhToan } from '..';

const FormItemHoaDonChiTiet = () => {
	const intl = useIntl();
	const { record, visibleModalThanhToan, setVisibleModalThanhToan } = useModel('taichinh.hoadon');

	const { getAllModel, loading, danhSach, xemRutGonChiTiet } = useModel('taichinh.hoadonchitiet');
	// const [result, setResult] = useState<HoaDon.IBillItem[]>([]);
	const [result, setResult] = useState<HoaDon.ITransaction[]>([]);

	const isDisabled = disableThanhToan(record);

	useEffect(() => {
		const data = record?.transactions?.filter((tran) => tran.status === 'success' && tran.type === 'CHARGE');
		setResult(data ?? []);
	}, [record]);

	const columns: IColumn<HoaDon.ITransaction & { index: number }>[] = [
		{
			title: 'Mã định danh',
			dataIndex: 'identityCode',
			width: 130,
			render: (val) => val || '-',
		},
		{
			title: 'Khoản thu',
			dataIndex: 'tenKhoanThu',
			width: 160,
			render: (val, rec) => val || rec?.maKhoanThu || '-',
		},
		{
			title: 'Mức thu',
			dataIndex: 'maMucThu',
			width: 120,
			render: (val) => val || '-',
		},
		{
			title: 'Kỳ học',
			dataIndex: 'tenKyHoc',
			width: 130,
			render: (val, rec) => val || rec?.maKyHoc || '-',
		},
		// {
		// 	title: 'Đơn giá',
		// 	dataIndex: 'donGia',
		// 	width: 120,
		// 	align: 'right',
		// 	render: (val) => inputFormat(val) ?? 0,
		// },
		// {
		// 	title: 'SL',
		// 	dataIndex: 'soLuong',
		// 	width: 70,
		// 	align: 'center',
		// 	render: (val) => val ?? '-',
		// },
		{
			title: 'Số tiền',
			dataIndex: 'amount',
			width: 120,
			align: 'right',
			render: (val) => inputFormat(val ?? 0),
		},
		{
			title: 'Loại GD',
			dataIndex: 'type',
			width: 100,
			align: 'center',
			render: (val) => <Tag color={val === 'CHARGE' ? 'blue' : 'green'}>{val || '--'}</Tag>,
		},
		// {
		// 	title: 'Trạng thái',
		// 	dataIndex: 'status',
		// 	width: 100,
		// 	align: 'center',
		// 	render: (val) => <Tag color={val === 'success' ? 'green' : 'default'}>{val || '--'}</Tag>,
		// },
		// {
		// 	title: 'Thanh toán',
		// 	dataIndex: 'paid',
		// 	width: 140,
		// 	align: 'center',
		// 	render: (val) => <Tag color={val ? 'green' : 'orange'}>{val ? 'Đã thanh toán' : 'Chưa thanh toán'}</Tag>,
		// },
		{
			title: 'Ghi chú',
			dataIndex: 'ghiChu',
			width: 220,
			render: (val) => val || '-',
		},
	];

	return (
		<Row gutter={[12, 0]}>
			<Col span={24}>
				<TableStaticData columns={columns} data={result} loading={loading} addStt size='small'>
					<Space wrap>
						<ButtonExtend
							disabled={isDisabled}
							onClick={() => setVisibleModalThanhToan(true)}
							icon={<AppstoreAddOutlined />}
							type='primary'
							className='btn-success'
							loading={loading}
							notHideText
							tooltip={isDisabled ? intl.formatMessage({ id: 'taichinh.thanhtoan.tooltip.outOfTime' }) : undefined}
						>
							{intl.formatMessage({ id: 'taichinh.thanhtoan.button.thanhtoan' })}
						</ButtonExtend>
					</Space>
				</TableStaticData>
			</Col>
		</Row>
	);
};

export default FormItemHoaDonChiTiet;
