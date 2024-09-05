import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import { colorTrangThaiNopBaiTap, ETrangThaiNopBaiTap, mapTrangThaiNopBaiTap } from '@/services/BaiTap/constants';
import type { BaiTap } from '@/services/BaiTap/typing';
import { EditOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';
import FormBaiTap from './components/Form';

const BaiTapPage = (props: { lopHocPhanId: string }) => {
	const { lopHocPhanId } = props;
	const { getModel, page, limit, handleEdit } = useModel('daotao.baitap');

	const getData = () => {
		if (lopHocPhanId)
			getModel(undefined, undefined, undefined, undefined, undefined, `lop-hoc-phan/${lopHocPhanId}/me`);
	};

	const columns: IColumn<BaiTap.IDanhSachGiaoBaiTap>[] = [
		{
			title: 'Tiêu đề',
			width: 200,
			render: (val, rec) => rec?.assignment?.noiDung,
		},
		{
			title: 'Thời hạn',
			align: 'center',
			render: (val, rec) =>
				rec?.assignment?.thoiGianKetThuc ? moment(rec?.assignment?.thoiGianKetThuc).format('HH:mm DD/MM/YYYY') : '',
			width: 120,
		},
		{
			title: 'Tệp đính kèm',
			width: 180,
			render: (val, rec) =>
				rec?.assignment?.urlTepDinhKem?.length &&
				rec?.assignment?.urlTepDinhKem?.map((item, index) => (
					<>
						<a key={item} href={item} target='_blank' rel='noreferrer'>
							Tệp {index + 1}
						</a>
						{index < (rec?.assignment?.urlTepDinhKem?.length ?? 0) - 1 && ', '}
					</>
				)),
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			align: 'center',
			width: 120,
			render: (val) => (
				<Tag color={colorTrangThaiNopBaiTap[val as ETrangThaiNopBaiTap]}>
					{mapTrangThaiNopBaiTap[val as ETrangThaiNopBaiTap]}
				</Tag>
			),
			filterType: 'select',
			filterData: Object.values(ETrangThaiNopBaiTap).map((item) => ({
				value: item,
				label: mapTrangThaiNopBaiTap[item],
			})),
		},
		{
			title: 'Thời gian cập nhật',
			dataIndex: 'thoiGianTraLoi',
			align: 'center',
			render: (val, rec) => (val ? moment(val).format('HH:mm DD/MM/YYYY') : ''),
			width: 120,
			filterType: 'date',
			sortable: true,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<ButtonExtend tooltip='Chỉnh sửa' type='link' icon={<EditOutlined />} onClick={() => handleEdit(rec)} />
				</>
			),
		},
	];

	return (
		<TableBase
			getData={getData}
			columns={columns}
			dependencies={[page, limit, lopHocPhanId]}
			modelName='daotao.baitap'
			formProps={{ getData }}
			Form={FormBaiTap}
			hideCard
			widthDrawer={800}
			buttons={{ create: false }}
			destroyModal
		/>
	);
};

export default BaiTapPage;
