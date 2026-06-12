import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import type { HoaDon } from '@/services/TaiChinh/HoaDon/typing';
import { EMaTrangThaiThanhToan } from '@/services/TaiChinh/constant';
import { inputFormat } from '@/utils/utils';
import { Col, Row, Table } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';

const FormItemHoaDonChiTiet = () => {
	const intl = useIntl();
	const { record } = useModel('taichinh.hoadon');

	const { getAllModel, loading, danhSach, xemRutGonChiTiet } = useModel('taichinh.hoadonchitiet');
	// const [result, setResult] = useState<HoaDon.IBillItem[]>([]);
	const [result, setResult] = useState<HoaDon.ITransaction[]>([]);

	// const setBillItemResult = (list: HoaDon.IBillItem[]) => {
	// 	setResult(list.filter((item) => !xemRutGonChiTiet || item.status !== EMaTrangThaiThanhToan.DONG));
	// };

	// const getData = () =>
	// 	record?._id &&
	// 	getAllModel(undefined, undefined, { billIdentityCode: record?.identityCode }).then((list) =>
	// 		setBillItemResult(list),
	// 	);

	// useEffect(() => {
	// 	getData();
	// }, [record?._id]);

	// useEffect(() => setBillItemResult(danhSach), [xemRutGonChiTiet]);

	useEffect(() => {
		setResult(record?.transactions ?? []);
	}, [record]);

	const columns: IColumn<HoaDon.ITransaction & { index: number }>[] = [
		{
			title: intl.formatMessage({ id: 'taichinh.thanhtoan.formItem.noidung' }),
			dataIndex: 'name',
			width: 180,
		},
		{
			title: intl.formatMessage({ id: 'taichinh.thanhtoan.formItem.dongia' }),
			dataIndex: 'amount',
			width: 110,
			align: 'right',
			render: (val, rec) => `${inputFormat(val)} ${rec.loaiTienTe ?? 'VND'}`,
			// render: (val, rec) => `${inputFormat(val)} VND${rec.transactions?. ? `/${rec.transactions?.unitLabel}` : ''}`,
		},
		// {
		// 	title: intl.formatMessage({ id: 'taichinh.thanhtoan.formItem.heso' }),
		// 	dataIndex: 'heSo',
		// 	width: 45,
		// 	align: 'center',
		// },
		{
			title: intl.formatMessage({ id: 'taichinh.thanhtoan.formItem.SL' }),
			dataIndex: 'quantity',
			width: 45,
			align: 'center',
			render: (val, rec) => (
				<div
					style={{
						textAlign: 'center',
					}}
				>
					{val ?? 1}
				</div>
			),
		},
		{
			title: intl.formatMessage({ id: 'taichinh.thanhtoan.formItem.thanhtien' }),
			// dataIndex: 'amountDue',
			width: 100,
			align: 'right',
			render: (val, rec) => {
				const thanhTien = (rec.amount ?? 0) * (rec.quantity ?? 1);
				return (
					<span className={rec.status === EMaTrangThaiThanhToan.DONG ? 'text-line' : undefined}>
						{inputFormat(thanhTien)} VND
					</span>
				);
			},
		},
		// {
		// 	title: intl.formatMessage({ id: 'taichinh.thanhtoan.formItem.uudai' }),
		// 	dataIndex: 'amountDiscount',
		// 	width: 100,
		// 	align: 'right',
		// 	render: (val, rec) => (
		// 		<span className={rec.status === EMaTrangThaiThanhToan.DONG ? 'text-line' : undefined}>
		// 			{inputFormat(val)} VND
		// 		</span>
		// 	),
		// },
		// {
		// 	title: intl.formatMessage({ id: 'taichinh.thanhtoan.formItem.thoigiantao' }),
		// 	dataIndex: 'createdAt',
		// 	width: 120,
		// 	align: 'left',
		// 	render: (val) => formatDateTime(val),
		// },
		// {
		// 	title: intl.formatMessage({ id: 'taichinh.thanhtoan.formItem.trangthai' }),
		// 	dataIndex: 'status',
		// 	align: 'center',
		// 	width: 120,
		// 	render: (val: EMaTrangThaiThanhToan) =>
		// 		val && <Tag color={EMauTrangThaiThanhToanTable?.[val]}>{ETrangThaiThanhToan?.[val] ?? ''}</Tag>,
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
					size='small'
					otherProps={{
						summary: (data: HoaDon.ITransaction[]) => {
							const dataFiltered = data.filter((item) => item.status !== EMaTrangThaiThanhToan.DONG);

							const sumCharge = dataFiltered
								.filter((item) => item.type === 'CHARGE')
								.reduce((sum, item) => sum + (item.amount ?? 0) * (item.quantity ?? 1), 0);

							const sumDiscount = dataFiltered
								.filter((item) => item.type === 'DISCOUNT')
								.reduce((sum, item) => sum + (item.amount ?? 0) * (item.quantity ?? 1), 0);

							const total = sumCharge - sumDiscount;
							return (
								<Table.Summary fixed>
									<Table.Summary.Row>
										<Table.Summary.Cell index={0} colSpan={4} align='center'>
											<b>{intl.formatMessage({ id: 'taichinh.thanhtoan.formItem.tongcong' })}</b>
										</Table.Summary.Cell>
										<Table.Summary.Cell index={1} align='right'>
											<b>{inputFormat(total)} VND</b>
										</Table.Summary.Cell>
										{/* <Table.Summary.Cell index={2} align='right'>
											<b>{inputFormat(sumDiscount)} VND</b>
										</Table.Summary.Cell>
										<Table.Summary.Cell index={3} /> */}
									</Table.Summary.Row>
								</Table.Summary>
							);
						},
						pagination: false,
						// rowKey: (rec: HoaDon.IBillItem) => rec._id,
						// rowSelection: isThanhToan
						// 	? {
						// 			type: 'checkbox',
						// 			selectedRowKeys: selectedIds ?? [],
						// 			preserveSelectedRowKeys: true,
						// 			onChange: (selectedRowKeys: string[]) => setSelectedIds(selectedRowKeys),
						// 			getCheckboxProps: (rec: HoaDon.IBillItem) => ({
						// 				disabled: ![
						// 					EMaTrangThaiThanhToan.CHUA_THANH_TOAN,
						// 					EMaTrangThaiThanhToan.CHUA_THANH_TOAN_DU,
						// 				].includes(rec.status),
						// 			}),
						// 			columnWidth: 40,
						// 	  }
						// 	: null,
					}}
				/>
			</Col>
		</Row>
	);
};

export default FormItemHoaDonChiTiet;
