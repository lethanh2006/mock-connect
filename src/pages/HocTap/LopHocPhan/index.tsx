import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import FilterHocKy from '@/pages/DaoTao/HocKy/FilterHocKy';
import { ELoaiLopHocPhan } from '@/services/HocTap/LopHocPhan/constant';
import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { history, useModel } from 'umi';

const LopHocPhanPage = () => {
	const { page, limit, sinhVienGetModel } = useModel('daotao.lophocphan');
	const { record: recHocKy } = useModel('daotao.hocky');

	const onCell = (loptinchi: LopHocPhan.IRecord) => ({
		onClick: () =>
			loptinchi.loai === ELoaiLopHocPhan.CHINH ? history.push(`/hoc-tap/lop-tin-chi/${loptinchi._id}`) : undefined,
		style: { cursor: loptinchi.loai === ELoaiLopHocPhan.CHINH ? 'pointer' : undefined },
	});

	const columns: IColumn<LopHocPhan.IRecord>[] = [
		{
			title: 'Tên lớp học',
			dataIndex: 'ten',
			width: 120,
			onCell,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Mã học phần',
			dataIndex: ['hocPhan', 'ma'],
			width: 100,
			onCell,
		},
		{
			title: 'Tên học phần',
			dataIndex: ['hocPhan', 'ten'],
			width: 180,
			onCell,
		},
		{
			title: 'Số tín chỉ',
			dataIndex: ['hocPhan', 'soTinChi'],
			align: 'center',
			width: 80,
			onCell,
		},
	];

	return (
		<TableBase
			columns={columns}
			dependencies={[page, limit, recHocKy?._id]}
			params={{ maHocKy: recHocKy?.ma, loai: ELoaiLopHocPhan.CHINH }}
			getData={sinhVienGetModel}
			modelName='daotao.lophocphan'
			title='Lớp tín chỉ'
			buttons={{ create: false }}
			otherButtons={[<FilterHocKy isSetHocKy key='1' />]}
			hideChildrenRows
		/>
	);
};

export default LopHocPhanPage;
