import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { EOperatorType } from '@/components/Table/constant';
import { IColumn } from '@/components/Table/typing';
import { ELoaiDot, EThoiGianDot, mapNameLoaiDot, thoiGianDot } from '@/services/TienIch/KhaoSat/constants';
import { DotKhaoSat } from '@/services/TienIch/KhaoSat/DotKhaoSat/typing';
import { EditOutlined } from '@ant-design/icons';
import { Segmented, Switch, Tag } from 'antd';
import dayjs from 'dayjs';
import { useModel } from 'umi';
import Form from './components/Form';

const DanhGiaGiangVienPage = () => {
	const { record: recHocPhan } = useModel('lophocphan.lophocphan');
	const { getModel, page, limit, handleEdit, thoiGian, setThoiGian } = useModel('tienich.dotkhaosat');

	const getData = () => {
		if (recHocPhan?._id) {
			getModel(
				{
					maHocKy: recHocPhan?.maHocKy,
				},
				[
					{
						active: true,
						field: 'loai',
						values: [ELoaiDot.DANH_GIA_GIANG_VIEN, ELoaiDot.KHAO_SAT_LOP_HOC_PHAN],
						operator: EOperatorType.INCLUDE,
					},
				],
				{ updatedAt: -1 },
				undefined,
				undefined,
				'my/page',
				{ thoiGian },
			);
		}
	};

	const columns: IColumn<DotKhaoSat.IRecord>[] = [
		{
			title: 'Loại',
			dataIndex: 'loai',
			width: 120,
			render: (val, rec) => mapNameLoaiDot[val as ELoaiDot],
			filterType: 'select',
			filterData: Object.values([ELoaiDot.DANH_GIA_GIANG_VIEN, ELoaiDot.KHAO_SAT_LOP_HOC_PHAN]).map((item) => ({
				value: item,
				label: mapNameLoaiDot[item],
			})),
		},
		{
			title: 'Tên đợt',
			dataIndex: 'ten',
			width: 200,
			filterType: 'string',
		},
		{
			title: 'Mô tả',
			dataIndex: 'moTa',
			width: 250,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
			filterType: 'string',
		},
		{
			title: 'Thời gian bắt đầu',
			dataIndex: 'thoiGianBatDau',
			align: 'center',
			render: (val) => (val ? dayjs(val).format('HH:mm DD/MM/YYYY') : ''),
			sortable: true,
			filterType: 'datetime',
			width: 120,
		},
		{
			title: 'Thời gian kết thúc',
			dataIndex: 'thoiGianKetThuc',
			align: 'center',
			render: (val) => (val ? dayjs(val).format('HH:mm DD/MM/YYYY') : ''),
			sortable: true,
			filterType: 'datetime',
			width: 120,
		},
		{
			title: 'Thời gian khảo sát',
			dataIndex: 'updatedAt',
			align: 'center',
			render: (val) => (val ? dayjs(val).format('HH:mm DD/MM/YYYY') : ''),
			sortable: true,
			filterType: 'datetime',
			width: 120,
		},
		{
			title: 'Kích hoạt',
			dataIndex: 'kichHoat',
			width: 60,
			align: 'center',
			render: (val, record) => <Switch checked={record.kichHoat} size='small' />,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'daLam',
			align: 'center',
			width: 120,
			render: (val) => (val ? <Tag color='green'>Đã thực hiện</Tag> : <Tag color='red'>Chưa thực hiện</Tag>),
			fixed: 'right',
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 60,
			fixed: 'right',
			render: (val, rec) => (
				<ButtonExtend
					tooltip='Khảo sát'
					onClick={() => handleEdit(rec)}
					type='link'
					icon={<EditOutlined />}
					disabled={thoiGian !== EThoiGianDot.DANG_DIEN_RA || !rec?.kichHoat}
				/>
			),
		},
	];

	return (
		<TableBase
			getData={getData}
			columns={columns}
			dependencies={[page, limit, recHocPhan?._id, thoiGian]}
			modelName='tienich.dotkhaosat'
			hideCard
			buttons={{ create: false }}
			Form={Form}
			formProps={{ getData }}
			widthDrawer={1000}
			otherButtons={[
				<Segmented
					key='1'
					value={thoiGian}
					onChange={(val) => setThoiGian(val as EThoiGianDot)}
					options={Object.values(EThoiGianDot).map((item) => ({ value: item, label: thoiGianDot[item] }))}
				/>,
			]}
		/>
	);
};

export default DanhGiaGiangVienPage;
