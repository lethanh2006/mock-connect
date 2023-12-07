import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';

import { EDoiTuongKeHoachNCKH, MapKeyDoiTuongKeHoachNCKH } from '@/services/KeHoachNCKH/constants';
import type { KeHoachNCKH } from '@/services/KeHoachNCKH/typings';
import { Button, Modal } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import ViewDetailKeHoachNCKH from './components/ViewDetail';

const KeHoachNCKHComponent = () => {
	const { getModel, page, limit, setRecord, record: recordKeHoach } = useModel('kehoachnckh');

	const [visibleViewDetail, setVisibleViewDetail] = useState<boolean>(false);

	const onCell = (record: KeHoachNCKH.IRecord) => ({
		onClick: () => {
			setVisibleViewDetail(true);
			setRecord(record);
		},
		style: { cursor: 'pointer' },
	});

	const getData = () => {
		getModel({ doiTuong: EDoiTuongKeHoachNCKH.SINH_VIEN }, undefined, undefined, undefined, undefined, 'page/duyet');
	};

	const columns: IColumn<KeHoachNCKH.IRecord>[] = [
		{
			title: 'Tên',
			dataIndex: 'ten',
			width: 250,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Đối tượng áp dụng',
			dataIndex: 'doiTuong',
			width: 150,
			align: 'center',
			filterType: 'select',
			render: (val: EDoiTuongKeHoachNCKH) => MapKeyDoiTuongKeHoachNCKH[val],
			filterData: Object.values(EDoiTuongKeHoachNCKH).map((item) => ({
				value: item,
				label: MapKeyDoiTuongKeHoachNCKH[item],
			})),
			onCell,
		},
		{
			title: 'Năm áp dụng',
			dataIndex: 'namApDung',
			width: 150,
			filterType: 'string',
			onCell,
			align: 'center',
		},
	];

	const handleCancelViewDetail = () => {
		setVisibleViewDetail(false);
		setRecord(undefined);
	};

	return (
		<>
			<TableBase
				buttons={{ create: false }}
				getData={getData}
				columns={columns}
				dependencies={[page, limit]}
				modelName='kehoachnckh'
				title='Kế hoạch NCKH'
			/>
			<Modal
				destroyOnClose
				bodyStyle={{ padding: 0 }}
				width={1200}
				footer={<Button onClick={handleCancelViewDetail}>Đóng</Button>}
				visible={visibleViewDetail}
				onCancel={handleCancelViewDetail}
			>
				{recordKeHoach && <ViewDetailKeHoachNCKH record={recordKeHoach} />}
			</Modal>
		</>
	);
};

export default KeHoachNCKHComponent;
