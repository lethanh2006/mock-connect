import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { type HocPhan } from '@/services/DaoTao/HocPhan/typings';
import { EyeOutlined } from '@ant-design/icons';
import { Checkbox } from 'antd';
import { useModel } from 'umi';

const HocLieuDeCuongPage = () => {
	const { page, limit } = useModel('hocphan.hoclieudecuong');
	const { record: recDeCuong } = useModel('hocphan.decuonghocphan');

	const columns: IColumn<HocPhan.IHocLieuDeCuong>[] = [
		{
			title: 'Tiêu đề',
			dataIndex: 'tieuDe',
			width: 200,
			filterType: 'string',
			render: (val) => val && <ExpandText>{val}</ExpandText>,
		},
		{
			title: 'Tác giả',
			dataIndex: 'tacGia',
			width: 120,
			filterType: 'string',
		},
		{
			title: 'Nhà xuất bản',
			dataIndex: 'tenNhaXuatBan',
			width: 120,
			filterType: 'string',
		},
		{
			title: 'Năm xuất bản',
			dataIndex: 'namXuatBan',
			align: 'center',
			width: 100,
			filterType: 'number',
			sortable: true,
		},
		{
			title: 'Mô tả',
			dataIndex: 'moTa',
			width: 250,
			render: (val) => val && <ExpandText>{val}</ExpandText>,
		},
		{
			title: 'Bắt buộc',
			width: 100,
			dataIndex: 'batBuoc',
			align: 'center',
			render: (val) => <Checkbox checked={val} disabled />,
		},
		{
			title: 'Thao tác',
			dataIndex: 'url',
			width: 60,
			align: 'center',
			fixed: 'right',
			render: (val, rec) =>
				val ? (
					<a href={val} target='_blank' rel='noreferrer' title='Xem chi tiết'>
						<EyeOutlined />
					</a>
				) : null,
		},
	];

	return (
		<>
			<TableBase
				columns={columns}
				dependencies={[page, limit]}
				params={{ deCuongId: recDeCuong?._id }}
				modelName='hocphan.hoclieudecuong'
				title='Đề cương học liệu'
				hideCard
				buttons={{ create: false }}
			/>
		</>
	);
};

export default HocLieuDeCuongPage;
