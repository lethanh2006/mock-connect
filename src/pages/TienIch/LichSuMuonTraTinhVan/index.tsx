import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import { Card } from 'antd';
import { useModel } from 'umi';

const currencyFormat = new Intl.NumberFormat('vi-VN', {
	style: 'currency',
	currency: 'VND',
});

const LichSuMuonTraTinhVanPage = () => {
	const { getModel } = useModel('thuvientinhvan.thuvien');
	const columns: IColumn<any>[] = [
		{
			title: 'Mã',
			dataIndex: 'Code',
			width: 80,
		},
		{
			title: 'Tiêu đề',
			dataIndex: 'Title',
			width: 170,
		},
		{
			title: 'Số copy',
			dataIndex: 'CopyNumber',
			width: 80,
		},
		{
			title: 'Giá',
			dataIndex: 'Price',
			width: 80,
			render: (val) => currencyFormat.format(val),
		},
		{
			title: 'Check-in',
			dataIndex: 'CheckInDate',
			width: 80,
		},
		{
			title: 'Check-out',
			dataIndex: 'CheckOutDate',
			width: 80,
		},
		{
			title: 'Số ngày quá hạn',
			dataIndex: 'OverDueDays',
			width: 80,
		},
		{
			title: 'Phạt quá hạn',
			dataIndex: 'OverDueFine',
			width: 80,
			render: (val) => currencyFormat.format(val),
		},
	];
	return (
		<Card title='Lịch sử mượn trả'>
			<TableBase
				modelName={'thuvientinhvan.thuvien'}
				columns={columns}
				buttons={{ create: false }}
				getData={() => getModel(undefined, undefined, undefined, undefined, undefined, '/me/muon/page')}
			/>
		</Card>
	);
};

export default LichSuMuonTraTinhVanPage;
