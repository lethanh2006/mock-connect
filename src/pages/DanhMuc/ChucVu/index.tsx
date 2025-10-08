import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import { getPartitionCode } from '@/utils/constants';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';
import Form from './components/Form';

const ChucVuPage = () => {
	const { getModel, page, limit, deleteModel, handleEdit } = useModel('danhmuc.chucvu');

	const columns: IColumn<ChucVu.IRecord>[] = [
		{
			title: 'Mã',
			dataIndex: 'ma',
			width: 80,
			filterType: 'select',
			filterData: ['M01', 'M02', 'M03'],
			sortable: true,
		},
		{
			title: 'Tên chức vụ',
			dataIndex: 'ten',
			width: 250,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Ngày tạo',
			dataIndex: 'createdAt',
			align: 'center',
			width: 120,
			filterType: 'datetime',
			sortable: true,
			render: (val) => moment(val).format('HH:mm DD/MM/YYYY'),
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (record: ChucVu.IRecord) => {
				const isPhanVung = !record?.dataPartitionCode || record?.dataPartitionCode === getPartitionCode();

				return (
					<>
						<ButtonExtend
							disabled={!isPhanVung}
							tooltip='Chỉnh sửa'
							onClick={() => handleEdit(record)}
							type='link'
							icon={<EditOutlined />}
						/>

						<Popconfirm
							onConfirm={() => deleteModel(record._id, getModel)}
							title='Bạn có chắc chắn muốn xóa chức vụ này?'
							placement='topLeft'
						>
							<ButtonExtend disabled={!isPhanVung} tooltip='Xóa' danger type='link' icon={<DeleteOutlined />} />
						</Popconfirm>
					</>
				);
			},
		},
	];

	return (
		<TableBase
			columns={columns}
			dependencies={[page, limit]}
			modelName='danhmuc.chucvu'
			title='Chức vụ'
			Form={Form}
			buttons={{ import: true }}
		/>
	);
};

export default ChucVuPage;
