import { type IColumn } from '@/components/Table/typing';
import { EMaTrangThaiThanhToan, EMauTrangThaiThanhToanTable, ETrangThaiThanhToan } from '@/services/TaiChinh/constant';
import { inputFormat } from '@/utils/utils';
import { Tag } from 'antd';
import ExpandText from '@/components/ExpandText';
import { type ChiTietThu } from '@/services/TaiChinh/ChiTietThu/typing';

const columns: IColumn<ChiTietThu.Record>[] = [
	{
		title: 'Mã TT',
		dataIndex: 'code',
		align: 'center',
		filterType: 'string',
		width: 100,
	},
	// {
	// 	title: 'Họ và tên',
	// 	width: 150,
	// 	dataIndex: ['customerInfo.name'],
	// 	filterType: 'string',
	// 	render: (val, rec) => rec.customerInfo?.name,
	// },
	// {
	// 	title: 'CCCD',
	// 	width: 150,
	// 	dataIndex: ['customerInfo.cmtCccd'],
	// 	filterType: 'string',
	// 	render: (val, rec) => rec.customerInfo?.cmtCccd,
	// },
	{
		title: 'Đợt thu',
		width: 150,
		render: (val, rec) => rec.dotThu?.tenDot,
	},
	{
		title: 'Khoản thu',
		width: 300,
		render: (val, rec) => (
			<ExpandText>
				{rec?.items?.map((item: any) => (
					<div key={item.productName}>- {item.priceId?.name ?? item.productName}</div>
				))}
			</ExpandText>
		),
	},
	{
		title: 'Địa chỉ',
		width: 180,
		dataIndex: ['customerInfo.address'],
		filterType: 'string',
		render: (val, rec) => <ExpandText>{rec.customerInfo?.address}</ExpandText>,
	},
	{
		title: 'Trạng thái',
		dataIndex: 'status',
		align: 'center',
		width: 150,
		render: (val: EMaTrangThaiThanhToan) => (
			<Tag color={EMauTrangThaiThanhToanTable?.[val]}>{ETrangThaiThanhToan?.[val] ?? ''}</Tag>
		),
		filterType: 'select',
		filterData: Object.values(EMaTrangThaiThanhToan).map((item) => ({ label: ETrangThaiThanhToan[item], value: item })),
	},
	{
		title: 'Số tiền phải thu',
		dataIndex: 'amountDue',
		filterType: 'number',
		sortable: true,
		width: 150,
		render: (val) => `${inputFormat(val ?? 0)} VNĐ`,
	},
	{
		title: 'Số tiền đã thu',
		dataIndex: 'amountPaid',
		filterType: 'number',
		sortable: true,
		width: 150,
		render: (val) => `${inputFormat(val ?? 0)} VNĐ`,
	},
];

export default columns;
