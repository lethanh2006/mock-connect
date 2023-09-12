import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import type { ChiTietThu } from '@/services/TaiChinh/ChiTietThu/typing';
import { inputFormat } from '@/utils/utils';
import { Table } from 'antd';

const TableDanhSachKhoanThu = (props: any) => {
	const value: ChiTietThu.IThongTinSanPham[] = props.value ?? [];

	const columns: IColumn<ChiTietThu.IThongTinSanPham>[] = [
		{
			title: 'Nội dung',
			dataIndex: 'productName',
			width: 200,
			render: (val, rec: any) => rec.priceId?.name ?? rec.productName,
		},
		{
			title: 'Đơn giá',
			dataIndex: 'unitAmount',
			width: 80,
			align: 'center',
			render: (val) => inputFormat(val),
		},
		{ title: 'Số lượng', dataIndex: 'quantity', width: 60, align: 'center' },
		{
			title: 'Thành tiền',
			width: 60,
			align: 'center',
			render: (val, rec) => inputFormat(rec.quantity * rec.unitAmount),
		},
	];

	return (
		<TableStaticData
			columns={columns.filter((item) => !item.hide)}
			data={value}
			addStt
			size='small'
			otherProps={{
				summary: (data: ChiTietThu.IThongTinSanPham[]) => {
					let sum = 0;
					data.forEach(({ unitAmount, quantity }) => (sum += unitAmount * quantity));
					return (
						<Table.Summary fixed>
							<Table.Summary.Row>
								<Table.Summary.Cell index={0} colSpan={4} align='center'>
									<b>Tổng cộng</b>
								</Table.Summary.Cell>
								<Table.Summary.Cell index={1} align='center'>
									<b>{inputFormat(sum)}</b>
								</Table.Summary.Cell>
							</Table.Summary.Row>
						</Table.Summary>
					);
				},
			}}
		/>
	);
};

export default TableDanhSachKhoanThu;
