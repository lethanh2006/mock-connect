import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';

import { Button, Modal } from 'antd';
import moment from 'moment';
import { useCallback, useState } from 'react';
import { useModel } from 'umi';
import FormQuyChe from './components/Form';
import ViewQuyChe from './components/View';
import { EDoiTuongKeHoachNCKH, MapKeyDoiTuongKeHoachNCKH } from '@/services/KhoaHoc/KeHoach/constants';

const QuyCheComponent = () => {
	const { getModel, page, limit, setRecord, record: recordQuyChe } = useModel('khoahoc.quychenckh');

	const [visibleView, setVisibleView] = useState<boolean>(false);

	const getData = () => {
		getModel({ maModule: 'QLKH', doiTuong: EDoiTuongKeHoachNCKH.SINH_VIEN as any });
	};

	const onCell = (record: QuyChe.IRecord) => ({
		onClick: () => {
			// setVisibleView(true);
			setRecord(record);
		},
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<QuyChe.IRecord>[] = [
		{
			title: 'Tên',
			dataIndex: 'ten',
			width: 300,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Đối tượng áp dụng',
			dataIndex: 'doiTuong',
			width: 150,
			align: 'center',
			filterType: 'select',
			render: (val: EDoiTuongKeHoachNCKH[]) => val.map((item) => MapKeyDoiTuongKeHoachNCKH[item]).join(', '),
			filterData: Object.values(EDoiTuongKeHoachNCKH).map((item) => ({
				value: item,
				label: MapKeyDoiTuongKeHoachNCKH[item],
			})),
			onCell,
		},
		{
			title: 'Số văn bản',
			dataIndex: 'soQuyetDinh',
			width: 120,
			onCell,
			align: 'center',
		},
		{
			title: 'Ngày ban hành',
			dataIndex: 'ngayBanHanh',
			width: 150,
			sortable: true,
			onCell,
			align: 'center',
			render: (val) => (val ? moment(val).format('DD/MM/YYYY') : ''),
		},
		{
			title: 'File đính kèm',
			dataIndex: 'fileDinhKem',
			width: 150,
			align: 'center',
			render: (val: string) => (
				<a href={val} target='_blank' rel='noreferrer'>
					Xem tập tin
				</a>
			),
		},
		// {
		// 	title: 'Ngày tạo',
		// 	dataIndex: 'createdAt',
		// 	align: 'center',
		// 	width: 120,
		// 	filterType: 'datetime',
		// 	sortable: true,
		// 	render: (val) => moment(val).format('HH:mm DD/MM/YYYY'),
		// 	onCell,
		// },
	];

	const Form = useCallback(() => <FormQuyChe getData={getData} />, []);

	return (
		<>
			{' '}
			<TableBase
				buttons={{ create: false }}
				widthDrawer={800}
				title='Quy chế, quy định'
				getData={getData}
				columns={columns}
				dependencies={[page, limit]}
				modelName='khoahoc.quychenckh'
				Form={Form}
			/>
			<Modal
				width={800}
				visible={visibleView}
				onCancel={() => {
					setVisibleView(false);
				}}
				title={recordQuyChe?.ten}
				footer={<Button onClick={() => setVisibleView(false)}>Đóng</Button>}
			>
				{recordQuyChe && <ViewQuyChe record={recordQuyChe} />}
			</Modal>
		</>
	);
};

export default QuyCheComponent;
