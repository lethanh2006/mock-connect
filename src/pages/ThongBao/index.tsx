import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import type { ThongBao } from '@/services/ThongBao/typing';
import dayjs from '@/utils/dayjs';
import { formatDateTime } from '@/utils/formatDate';
import { Modal } from 'antd';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import news from '../../assets/new6.gif';
import ViewThongBao from './components/ViewThongBao';

const ThongBaoPage = () => {
	const intl = useIntl();
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
			title: intl.formatMessage({ id: 'thongbao.column.nguoigui' }),
			dataIndex: 'senderName',
			width: 150,
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'thongbao.column.tieude' }),
			dataIndex: 'title',
			width: 200,
			filterType: 'string',
			onCell,
			render: (val, recordVal) => (
				<>
					<ExpandText>
						{val}{' '}
						{dayjs().diff(dayjs(recordVal?.createdAt), 'days') < 3 ? (
							<img style={{ width: 30, height: 20 }} src={news} />
						) : (
							''
						)}
					</ExpandText>
				</>
			),
		},
		{
			title: intl.formatMessage({ id: 'thongbao.column.mota' }),
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
			title: intl.formatMessage({ id: 'thongbao.column.thoigian' }),
			dataIndex: 'createdAt',
			width: 120,
			align: 'center',
			filterType: 'datetime',
			sortable: true,
			onCell,
			render: (val) => formatDateTime(val),
		},
	];

	return (
		<>
			<TableBase
				buttons={{ create: false }}
				getData={getData}
				modelName={'thongbao.thongbao'}
				columns={column}
				title={intl.formatMessage({ id: 'thongbao.title' })}
			/>
			<Modal
				width={800}
				styles={{ body: { padding: 0 } }}
				okButtonProps={{ hidden: true }}
				cancelText={intl.formatMessage({ id: 'global.button.dong' })}
				open={visible}
				onCancel={() => setVisible(false)}
				destroyOnClose
			>
				<ViewThongBao record={record} />
			</Modal>
		</>
	);
};

export default ThongBaoPage;
