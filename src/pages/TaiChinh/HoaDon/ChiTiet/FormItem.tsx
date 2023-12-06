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
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormItemHoaDonChiTiet = (props: { isThanhToan?: boolean }) => {
	const { isThanhToan } = props;
	const { record } = useModel('taichinh.hoadon');
	const { getAllModel, danhSach, selectedIds, setSelectedIds } = useModel('taichinh.hoadonchitiet');

	const getData = () => record?._id && getAllModel(undefined, undefined, { billIdentityCode: record?.identityCode });

	useEffect(() => {
		getData();
	}, [record?._id]);

	const columns: IColumn<HoaDon.IBillItem & { index: number }>[] = [
		{
			title: 'Nội dung',
			dataIndex: 'tenKhoanThu',
			width: 180,
		},
		{
			title: 'Đơn giá',
			dataIndex: 'unitAmount',
			width: 100,
			align: 'right',
			render: (val) => `${inputFormat(val)} VND`,
		},
		{ title: 'Hệ số', dataIndex: 'heSo', width: 50, align: 'center' },
		{ title: 'Số lượng', dataIndex: 'quantity', width: 50, align: 'center' },
		{
			title: 'Thành tiền',
			width: 100,
			align: 'right',
			render: (val, rec) => `${inputFormat(rec.quantity * rec.unitAmount * rec.heSo)} VND`,
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
					addStt
					size='small'
					otherProps={{
						summary: (data: HoaDon.IBillItem[]) => {
							let sum = 0;
							data.forEach(({ unitAmount, quantity }) => (sum += unitAmount * quantity));
							return (
								<Table.Summary fixed>
									<Table.Summary.Row>
										<Table.Summary.Cell index={0} colSpan={5} align='center'>
											<b>Tổng cộng</b>
										</Table.Summary.Cell>
										<Table.Summary.Cell index={1} align='right'>
											<b>{inputFormat(sum)} VND</b>
										</Table.Summary.Cell>
										<Table.Summary.Cell index={2} />
									</Table.Summary.Row>
								</Table.Summary>
							);
						},
						rowKey: (rec: HoaDon.IBillItem) => rec._id,
						rowSelection: isThanhToan
							? {
									type: 'checkbox',
									selectedRowKeys: selectedIds ?? [],
									preserveSelectedRowKeys: true,
									onChange: (selectedRowKeys: string[]) => setSelectedIds(selectedRowKeys),
									// getCheckboxProps: (rec: HoaDon.IBillItem) => ({
									// 	disabled: ![
									// 		EMaTrangThaiThanhToan.CHUA_THANH_TOAN,
									// 		EMaTrangThaiThanhToan.CHUA_THANH_TOAN_DU,
									// 	].includes(rec.status),
									// }),
									columnWidth: 40,
							  }
							: null,
					}}
				/>
			</Col>

			{/* <Modal
				visible={visibleForm}
				onCancel={() => setVisibleForm(false)}
				footer={null}
				title='Thêm mới'
				width={600}
				maskClosable={false}
			>
				<FormHoaDonChiTiet onOk={onAdd} />
			</Modal> */}
		</Row>
	);
};

export default FormItemHoaDonChiTiet;
