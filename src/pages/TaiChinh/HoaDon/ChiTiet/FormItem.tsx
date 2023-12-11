import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import type { HoaDon } from '@/services/TaiChinh/HoaDon/typing';
import {
	EMauTrangThaiThanhToanTable,
	ETrangThaiThanhToan,
	type EMaTrangThaiThanhToan,
} from '@/services/TaiChinh/constant';
import { inputFormat } from '@/utils/utils';
import { Col, Row, Table, Tag } from 'antd';
import _ from 'lodash';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormItemHoaDonChiTiet = () => {
	const { record } = useModel('taichinh.hoadon');
	const { getAllModel, danhSach, loading } = useModel('taichinh.hoadonchitiet');

	const getData = () => record?._id && getAllModel(undefined, undefined, { billIdentityCode: record?.identityCode });

	useEffect(() => {
		getData();
	}, [record?._id]);

	const columns: IColumn<HoaDon.IBillItem & { index: number }>[] = [
		{
			title: 'Nội dung',
			dataIndex: 'ten',
			width: 180,
		},
		{
			title: 'Đơn giá',
			dataIndex: 'unitAmount',
			width: 120,
			align: 'right',
			render: (val, rec) => `${inputFormat(val)} VND${rec.unitLabel ? `/${rec.unitLabel}` : ''}`,
		},
		{ title: 'Hệ số', dataIndex: 'heSo', width: 50, align: 'center' },
		{ title: 'Số lượng', dataIndex: 'quantity', width: 50, align: 'center' },
		{
			title: 'Thành tiền',
			dataIndex: 'amountDue',
			width: 100,
			align: 'right',
			render: (val) => `${inputFormat(val)} VND`,
		},
		{
			title: 'Ưu đãi',
			dataIndex: 'amountDiscount',
			width: 100,
			align: 'right',
			render: (val) => `${inputFormat(val)} VND`,
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
					data={danhSach}
					loading={loading}
					addStt
					size='small'
					otherProps={{
						summary: (data: HoaDon.IBillItem[]) => {
							const sumDue = _.sumBy(data, (item) => item.amountDue);
							const sumDiscount = _.sumBy(data, (item) => item.amountDiscount);
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
