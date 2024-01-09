import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import type { LopHanhChinh } from '@/services/HocTap/LopHanhChinh/typing';
import { history, useModel } from 'umi';

const LopHanhChinhPage = () => {
	const { page, limit, sinhVienGetModel } = useModel('daotao.lophanhchinh');

	const onCell = (lophanhchinh: LopHanhChinh.IRecord) => ({
		onClick: () => history.push(`/lop-hanh-chinh/${lophanhchinh._id}`),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<LopHanhChinh.IRecord>[] = [
		{
			title: 'Tên lớp học',
			dataIndex: 'ten',
			width: 120,
			onCell,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Cố vấn học tập',
			width: 150,
			onCell,
			render: (val, rec) => [rec.giangVien?.hoDem, rec.giangVien?.ten].join(' '),
		},
		{
			title: 'Sĩ số',
			dataIndex: 'siSo',
			align: 'center',
			width: 80,
			onCell,
			filterType: 'number',
			sortable: true,
		},
		{
			title: 'Khóa sinh viên',
			align: 'center',
			width: 80,
			render: (val, rec) => rec.khoaSinhVien?.ten,
			onCell,
		},
		{
			title: 'Ngành đào tạo',
			width: 180,
			render: (val, rec) => rec.nganh?.ten,
			onCell,
		},
	];

	return (
		<TableBase
			columns={columns}
			dependencies={[page, limit]}
			getData={sinhVienGetModel}
			modelName='daotao.lophanhchinh'
			title='Lớp hành chính'
			buttons={{ create: false }}
		/>
	);
};

export default LopHanhChinhPage;
