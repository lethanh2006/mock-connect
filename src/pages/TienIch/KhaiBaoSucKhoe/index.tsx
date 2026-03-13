import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { colorETinhTrangSucKhoe, type ETinhTrangSucKhoe } from '@/services/TienIch/KhaiBaoSucKhoe/constant';
import type { KhaiBaoSucKhoe } from '@/services/TienIch/KhaiBaoSucKhoe/typing';
import { Tag } from 'antd';
import { useModel } from 'umi';

const KhaiBaoSuKhoePage = () => {
	const { getAllModel, page, limit } = useModel('tienich.khaibaosuckhoe');

	const getData = () => getAllModel(undefined, undefined, undefined, undefined, 'me');

	const columns: IColumn<KhaiBaoSucKhoe.IRecord>[] = [
		{
			title: 'Học kỳ',
			dataIndex: 'dotKhamSucKhoeId',
			width: 150,
			render: (val, rec) => rec.dotKhamSucKhoe.tenHocKy ?? val,
		},
		{
			title: 'Tên đợt',
			dataIndex: 'dotKhamSucKhoeId',
			width: 180,
			render: (val, rec) => rec.dotKhamSucKhoe.ten ?? val,
		},
		{
			title: 'Tình trạng sức khỏe',
			dataIndex: 'tinhTrangSucKhoe',
			align: 'center',
			width: 120,
			render: (val, rec) => <Tag color={colorETinhTrangSucKhoe[val as ETinhTrangSucKhoe]}>{val}</Tag>,
		},
	];

	return (
		<>
			<TableBase
				columns={columns}
				getData={getData}
				dependencies={[page, limit]}
				modelName='tienich.khaibaosuckhoe'
				title='Tình trạng sức khoẻ'
				buttons={{ create: false }}
			/>
		</>
	);
};

export default KhaiBaoSuKhoePage;
