import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import type { HoaDon } from '@/services/TaiChinh/HoaDon/typing';
import { EMaTrangThaiThanhToan, EMauTrangThaiThanhToanTable, ETrangThaiThanhToan } from '@/services/TaiChinh/constant';
import { inputFormat } from '@/utils/utils';
import { Col, Row, Table, Tag } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const FormItemHoaDonChiTiet = () => {
	const { record } = useModel('taichinh.hoadon');
	const { getAllModel, loading, danhSach, xemRutGonChiTiet } = useModel('taichinh.hoadonchitiet');
	const [result, setResult] = useState<HoaDon.IBillItem[]>([]);

	const setBillItemResult = (list: HoaDon.IBillItem[]) => {
		setResult(list.filter((item) => !xemRutGonChiTiet || item.status !== EMaTrangThaiThanhToan.DONG));
	};

	const getData = () =>
		record?._id &&
		getAllModel(undefined, undefined, { billIdentityCode: record?.identityCode }).then((list) =>
			setBillItemResult(list),
		);


	useEffect(() => {
		getData();
	}, [record?._id]);

	useEffect(() => setBillItemResult(danhSach), [xemRutGonChiTiet]);

	const columns: IColumn<HoaDon.IBillItem & { index: number }>[] = [
		{
			title: 'Nội dung',
			dataIndex: 'ten',
			width: 180,
		},
		{
			title: 'Đơn giá',
			dataIndex: 'unitAmount',
			width: 110,
			align: 'right',
			render: (val, rec) => `${inputFormat(val)} VND${rec.unitLabel ? `/${rec.unitLabel}` : ''}`,
		},
		{ title: 'Hệ số', dataIndex: 'heSo', width: 45, align: 'center' },
		{ title: 'SL', dataIndex: 'quantity', width: 45, align: 'center' },
		{
			title: 'Thành tiền',
			dataIndex: 'amountDue',
			width: 100,
			align: 'right',
			render: (val, rec) => (
				<span className={rec.status === EMaTrangThaiThanhToan.DONG ? 'text-line' : undefined}>
					{inputFormat(val)} VND
				</span>
			),
		},
		{
			title: 'Ưu đãi',
			dataIndex: 'amountDiscount',
			width: 100,
			align: 'right',
			render: (val, rec) => (
				<span className={rec.status === EMaTrangThaiThanhToan.DONG ? 'text-line' : undefined}>
					{inputFormat(val)} VND
				</span>
			),
		},
		{
			title: 'Thời gian tạo',
			dataIndex: 'createdAt',
			width: 120,
			align: 'left',
			render: (val) => moment(val).format('HH:mm DD/MM/YYYY'),
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			align: 'center',
			width: 120,
			render: (val: EMaTrangThaiThanhToan) =>
				val && <Tag color={EMauTrangThaiThanhToanTable?.[val]}>{ETrangThaiThanhToan?.[val] ?? ''}</Tag>,
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
					size='small'
					otherProps={{
						summary: (data: HoaDon.IBillItem[]) => {
							const dataFiltered = data.filter((item) => item.status !== EMaTrangThaiThanhToan.DONG);
							const sumDue = _.sumBy(dataFiltered, (item) => item.amountDue);
							const sumDiscount = _.sumBy(dataFiltered, (item) => item.amountDiscount);
							return (
								<Table.Summary fixed>
									<Table.Summary.Row>
										<Table.Summary.Cell index={0} colSpan={5} align='center'>
											<b>Tổng cộng</b>
										</Table.Summary.Cell>
										<Table.Summary.Cell index={1} align='right'>
											<b>{inputFormat(sumDue)} VND</b>
										</Table.Summary.Cell>
										<Table.Summary.Cell index={2} align='right'>
											<b>{inputFormat(sumDiscount)} VND</b>
										</Table.Summary.Cell>
										<Table.Summary.Cell index={3} />
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
