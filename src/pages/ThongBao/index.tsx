import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import type { ThongBao } from '@/services/ThongBao/typing';
import { Modal } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { useModel } from 'umi';
import news from '../../assets/new6.gif';
import ViewThongBao from './components/ViewThongBao';

const ThongBaoPage = () => {
	const { setRecord, record, getModel } = useModel('thongbao.thongbao');
	const getData = () => {
		getModel(undefined, undefined, undefined, undefined, undefined, 'me/page');
	};
	const [visible, setVisible] = useState<boolean>(false);
	const onCell = (recordThongBao: ThongBao.IRecord) => ({
		onClick: () => {
			setVisible(true);
			setRecord(recordThongBao);
		},
		style: { cursor: 'pointer' },
	});

	const column: IColumn<ThongBao.IRecord>[] = [
		{
			title: 'Người gửi',
			dataIndex: 'senderName',
			width: 150,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Tiêu đề',
			dataIndex: 'title',
			width: 200,
			filterType: 'string',
			onCell,
			render: (val, recordVal) => (
				<>
					<ExpandText>
						{val}{' '}
						{moment().diff(moment(recordVal?.createdAt), 'days') < 3 ? (
							<img style={{ width: 30, height: 20 }} src={news} />
						) : (
							''
						)}
					</ExpandText>
				</>
			),
		},
		{
			title: 'Mô tả',
			dataIndex: 'description',
			width: 280,
			filterType: 'string',
			onCell,
			render: (val) => <ExpandText>{val}</ExpandText>,
		},
		// {
		// 	title: 'Đối tượng nhận thông báo',
		// 	dataIndex: 'receiverType',
		// 	width: 140,
		// 	filterType: 'select',
		// 	filterData: Object.values(EReceiverType).map((value) => ({
		// 		value,
		// 		label: LoaiDoiTuongThongBao?.[value] ?? '',
		// 	})),
		// 	onCell,
		// 	render: (val: EReceiverType) => LoaiDoiTuongThongBao?.[val],
		// },
		{
			title: 'Thời gian gửi',
			dataIndex: 'createdAt',
			width: 120,
			align: 'center',
			filterType: 'datetime',
			sortable: true,
			onCell,
			render: (val) => moment(val).format('HH:mm DD/MM/YYYY'),
		},
	];

	return (
		<>
			<TableBase
				buttons={{ create: false }}
				getData={getData}
				modelName={'thongbao.thongbao'}
				columns={column}
				title='Thông báo'
			/>
			<Modal
				width={800}
				bodyStyle={{ padding: 0 }}
				okButtonProps={{ hidden: true }}
				cancelText='Đóng'
				visible={visible}
				onCancel={() => setVisible(false)}
				destroyOnClose
			>
				<ViewThongBao record={record} />
			</Modal>
		</>
	);
};

export default ThongBaoPage;
