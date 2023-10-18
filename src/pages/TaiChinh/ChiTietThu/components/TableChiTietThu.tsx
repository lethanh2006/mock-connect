import TableBase from '@/components/Table';
import { type ChiTietThu } from '@/services/TaiChinh/ChiTietThu/typing';
import { UnorderedListOutlined } from '@ant-design/icons';
import { Button, Modal, Tooltip } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import ThongTinThanhToan from './ThongTinThanhToan';
import columns from './columns';

const TableChiTietThu = () => {
	const { setRecord, getModel, record, page, limit } = useModel('taichinh.chitietthu');
	const [visibleModal, setVisibleModal] = useState<boolean>(false);

	const getData = () => getModel(undefined, undefined, undefined, undefined, undefined, 'me');

	const handleDetail = (rec: ChiTietThu.Record) => {
		setRecord(rec);
		setVisibleModal(true);
	};

	return (
		<>
			<TableBase
				columns={[
					...columns,
					{
						title: 'Thao tác',
						align: 'center',
						width: 80,
						fixed: 'right',
						render: (val, rec) => (
							<>
								<Tooltip title='Thông tin thanh toán'>
									<Button onClick={() => handleDetail(rec)} type='link'>
										<UnorderedListOutlined />
									</Button>
								</Tooltip>
							</>
						),
					},
				]}
				getData={getData}
				buttons={{ create: false }}
				dependencies={[page, limit]}
				modelName='taichinh.chitietthu'
				widthDrawer={800}
				hideCard
			/>

			<Modal
				visible={visibleModal}
				onCancel={() => setVisibleModal(false)}
				footer={null}
				bodyStyle={{ padding: 0 }}
				width={1000}
				destroyOnClose
			>
				{record?._id ? <ThongTinThanhToan setVisible={setVisibleModal} /> : null}
			</Modal>
		</>
	);
};

export default TableChiTietThu;
