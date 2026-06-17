import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { TRANSACTION_COLOR, TRANSACTION_LABEL } from '@/services/TaiChinh/constant';
import type { HoaDon } from '@/services/TaiChinh/HoaDon/typing';
import { inputFormat } from '@/utils/utils';
import { AppstoreAddOutlined } from '@ant-design/icons';
import { Col, Row, Tag } from 'antd';
import dayjs from 'dayjs';
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
		const data = record?.transactions
			?.filter((tran) => tran.status === 'success')
			?.sort((a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf());
		setResult(data ?? []);
	}, [record]);

	const columns: IColumn<HoaDon.ITransaction & { index: number }>[] = [
		{
			title: 'Mã giao dịch',
			dataIndex: 'identityCode',
			width: 130,
			render: (val) => val || '-',
		},
		// {
		// 	title: 'Khoản thu',
		// 	dataIndex: 'tenKhoanThu',
		// 	width: 160,
		// 	render: (val, rec) => val || rec?.maKhoanThu || '-',
		// },
		// {
		// 	title: 'Mức thu',
		// 	dataIndex: 'maMucThu',
		// 	width: 120,
		// 	render: (val) => val || '-',
		// },
		// {
		// 	title: 'Kỳ học',
		// 	dataIndex: 'tenKyHoc',
		// 	width: 130,
		// 	render: (val, rec) => val || rec?.maKyHoc || '-',
		// },
		{
			title: 'Loại giao dịch',
			dataIndex: 'type',
			width: 130,
			align: 'center',
			render: (val) => <Tag color={TRANSACTION_COLOR[val] ?? 'default'}>{TRANSACTION_LABEL[val] ?? val ?? '--'}</Tag>,
		},
		{
			title: 'Số tiền',
			dataIndex: 'amount',
			width: 120,
			align: 'right',
			render: (val) => inputFormat(val ?? 0),
		},

		{
			title: 'Ngày tạo',
			dataIndex: 'createdAt',
			width: 140,
			align: 'center',
			render: (val) => (val ? dayjs(val).format('HH:mm DD/MM/YYYY') : '-'),
		},
		{
			title: 'Ngày giao dịch',
			dataIndex: 'transactionDate',
			width: 140,
			align: 'center',
			render: (val) => (val ? dayjs(val).format('HH:mm DD/MM/YYYY') : '-'),
		},
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
				<TableStaticData
					columns={columns}
					data={result}
					loading={loading}
					addStt
					hasTotal
					otherProps={{
						pagination: false,
						size: 'small',
						scroll: { x: 1000 },
					}}
					otherButtons={[
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
						</ButtonExtend>,
					]}
				></TableStaticData>
			</Col>
		</Row>
	);
};

export default FormItemHoaDonChiTiet;
