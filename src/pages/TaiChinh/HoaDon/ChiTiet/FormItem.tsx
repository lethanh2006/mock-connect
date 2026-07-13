import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { colorTransactionStatus, colorTransactionType, ETransactionStatus, ETransactionType, transactionType } from '@/services/TaiChinh/constant';
import type { HoaDon } from '@/services/TaiChinh/HoaDon/typing';
import { currencyFormat } from '@/utils/utils';
import { AppstoreAddOutlined } from '@ant-design/icons';
import { Col, Row, Space, Tag } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import { disableThanhToan } from '..';

const FormItemHoaDonChiTiet = () => {
	const intl = useIntl();
	const { record, setVisibleModalThanhToan } = useModel('taichinh.hoadon');
	const { loading } = useModel('taichinh.hoadonchitiet');
	const [result, setResult] = useState<HoaDon.ITransaction[]>([]);

	const isDisabled = disableThanhToan(record);

	useEffect(() => {
		const data = (record?.transactions ?? [])
			.filter((tran) => tran.type === ETransactionType.PAYMENT ? tran.status === ETransactionStatus.SUCCESS : true)
			.sort((a, b) => dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf());
		setResult(data ?? []);
	}, [record]);

	const isTransactionStatus = (status?: unknown): status is ETransactionStatus =>
		Object.values(ETransactionStatus).includes(status as ETransactionStatus);

	const columns: IColumn<HoaDon.ITransaction & { index: number }>[] = [
		{
			title: intl.formatMessage({ id: 'taichinh.hoadonchitiet.col.magiaodich' }),
			dataIndex: 'identityCode',
			width: 140,
			render: (val) => val ?? '-',
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
			title: intl.formatMessage({ id: 'taichinh.hoadonchitiet.col.tenkhoanthu' }),
			dataIndex: 'tenKhoanThu',
			width: 200,
			render: (val, rec) => val ?? rec?.ten ?? rec?.name ?? '-',
		},
		{
			title: intl.formatMessage({ id: 'taichinh.hoadonchitiet.col.loaigiaodich' }),
			dataIndex: 'type',
			width: 130,
			align: 'center',
			render: (val: ETransactionType, record) => {
				if (!val) return '--';
				const status = record?.status;
				const isPayment = val === ETransactionType.PAYMENT || String(val).toLowerCase() === 'payment';
				return (
					<Space size={4} wrap>
						<Tag color={colorTransactionType[val]}>{transactionType[val] ?? val}</Tag>
						{isPayment && isTransactionStatus(status) ? (
							<Tag color={colorTransactionStatus[status]}>{status.toUpperCase()}</Tag>
						) : null}
					</Space>
				);
			},
		},
		{
			title: intl.formatMessage({ id: 'taichinh.hoadonchitiet.col.donvitinh' }),
			dataIndex: 'unitLabel',
			width: 110,
			align: 'center',
			render: (val) => val ?? '-',
		},
		{
			title: intl.formatMessage({ id: 'taichinh.hoadonchitiet.col.soluong' }),
			dataIndex: 'quantity',
			width: 100,
			align: 'right',
			render: (val) => val ?? '-',
		},
		{
			title: intl.formatMessage({ id: 'taichinh.hoadonchitiet.col.dongia' }),
			dataIndex: 'unitAmount',
			width: 140,
			align: 'right',
			render: (val) => (val != null ? `${currencyFormat(val)} VND` : '-'),
		},
		{
			title: intl.formatMessage({ id: 'taichinh.hoadonchitiet.col.thanhtien' }),
			dataIndex: 'amount',
			width: 140,
			align: 'right',
			render: (val) => <span className='fw500'>{currencyFormat(val ?? 0)} VND</span>,
		},
		{
			title: intl.formatMessage({ id: 'taichinh.hoadonchitiet.col.ngaytao' }),
			dataIndex: 'createdAt',
			width: 140,
			align: 'center',
			render: (val) => (val ? dayjs(val).format('HH:mm DD/MM/YYYY') : '-'),
		},
		{
			title: intl.formatMessage({ id: 'taichinh.hoadonchitiet.col.ngaygiaodich' }),
			dataIndex: 'transactionDate',
			width: 140,
			align: 'center',
			render: (val) => (val ? dayjs(val).format('HH:mm DD/MM/YYYY') : '-'),
		},
		{
			title: intl.formatMessage({ id: 'taichinh.hoadonchitiet.col.giaodich' }),
			dataIndex: 'isManual',
			width: 150,
			align: 'center',
			render: (val: boolean) => (
				<Tag color={val ? 'blue' : 'green'}>
					{val
						? intl.formatMessage({ id: 'taichinh.hoadonchitiet.giaodich.thucong' })
						: intl.formatMessage({ id: 'taichinh.hoadonchitiet.giaodich.hethong' })}
				</Tag>
			),
		},
		// {
		// 	title: 'Ghi chú',
		// 	dataIndex: 'ghiChu',
		// 	width: 220,
		// 	render: (val) => val || '-',
		// },
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
