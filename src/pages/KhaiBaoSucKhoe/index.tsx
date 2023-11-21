import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { colorETinhTrangSucKhoe, type ETinhTrangSucKhoe } from '@/services/KhaiBaoSucKhoe/constant';
import type { KhaiBaoSucKhoe } from '@/services/KhaiBaoSucKhoe/typing';
import { Tag } from 'antd';
import { useModel } from 'umi';

const KhaiBaoSuKhoePage = () => {
	const { getAllModel, page, limit } = useModel('khaibaosuckhoe.khaibaosuckhoe');

	const getData = () => getAllModel(undefined, undefined, undefined, undefined, 'me');

	const columns: IColumn<KhaiBaoSucKhoe.IRecord>[] = [
		{
			title: 'Mã sinh viên',
			dataIndex: 'maSinhVien',
			width: 120,
			align: 'center',
			filterType: 'string',
		},
		{
			title: 'Họ tên',
			dataIndex: 'hoTen',
			width: 170,
			filterType: 'string',
		},
		{
			title: 'Sức khỏe',
			dataIndex: 'tinhTrangSucKhoe',
			align: 'center',
			width: 170,

			render: (val, rec) => <Tag color={colorETinhTrangSucKhoe[val as ETinhTrangSucKhoe]}>{val}</Tag>,
		},
	];

	return (
		<>
			<TableBase
				columns={columns}
				getData={getData}
				dependencies={[page, limit]}
				modelName='khaibaosuckhoe.khaibaosuckhoe'
				title='Khai báo sức khỏe sinh viên'
				buttons={{ create: false }}
			/>
		</>
	);
};

export default KhaiBaoSuKhoePage;
