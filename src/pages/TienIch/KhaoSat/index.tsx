import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { getCauTraLoiMe } from '@/services/TienIch/KhaoSat/BieuMau';
import type { BieuMau } from '@/services/TienIch/KhaoSat/BieuMau/typing';
import { type DotKhaoSat } from '@/services/TienIch/KhaoSat/DotKhaoSat/typing';
import { EThoiGianDot, textThucHienKhaoSat, thoiGianDot } from '@/services/TienIch/KhaoSat/constants';
import { EditOutlined } from '@ant-design/icons';
import { Button, Segmented, Tag, Tooltip } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import Form from './components/Form';

const DotKhaoSatPage = () => {
	const {
		page,
		limit,
		getDotMeModel,
		handleEdit: handleDot,
		thoiGian,
		setThoiGian,
		record: recDotKhaoSat,
		visibleForm,
	} = useModel('tienich.dotkhaosat');
	const { getByIdModel: getBieuMau, setLoading } = useModel('tienich.bieumau');
	const [cauTraLoi, setCauTraLoi] = useState<BieuMau.TraLoiRecord[]>([]);

	const handleEdit = async (record: DotKhaoSat.IRecord) => {
		await getBieuMau(record?.idKhaoSat).then((bm) => handleDot(record));
		// if (bieuMau.loai === ELoaiBieuMau.TRAC_NGHIEM) {
		//   await initBieuMauTracNghiemModel(record._id, record?.idBieuMau ?? '');
		// }
	};

	useEffect(() => {
		if (recDotKhaoSat?._id && visibleForm) {
			setLoading(true);
			getCauTraLoiMe(recDotKhaoSat?.idKhaoSat ?? '', recDotKhaoSat?._id ?? '')
				.then((res) => {
					setCauTraLoi(res.data?.data[0]?.danhSachTraLoi);
					setLoading(false);
				})
				.catch((err) => console.log(err));
		}
	}, [recDotKhaoSat?._id, visibleForm]);

	const renderTrangThaiDot = (recordVal: DotKhaoSat.IRecord) => {
		if (!recordVal?.kichHoat) {
			return 'Đợt chưa kích hoạt';
		} else return textThucHienKhaoSat[thoiGian];
	};

	const columns: IColumn<DotKhaoSat.IRecord>[] = [
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
			filterType: 'string',
			render: (val) => <ExpandText>{val}</ExpandText>,
		},
		{
			title: 'Thời gian bắt đầu',
			dataIndex: 'thoiGianBatDau',
			width: 120,
			align: 'center',
			render: (val) => (val ? moment(val).format('HH:mm DD/MM/YYYY') : ''),
			filterType: 'datetime',
			sortable: true,
		},
		{
			title: 'Thời gian kết thúc',
			dataIndex: 'thoiGianKetThuc',
			width: 120,
			align: 'center',
			render: (val) => (val ? moment(val).format('HH:mm DD/MM/YYYY') : ''),
			filterType: 'datetime',
			sortable: true,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'daLam',
			align: 'center',
			width: 120,
			render: (val) => (val ? <Tag color='green'>Đã thực hiện</Tag> : <Tag color='red'>Chưa thực hiện</Tag>),
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 60,
			fixed: 'right',
			render: (record: DotKhaoSat.IRecord) => (
				<Tooltip title={renderTrangThaiDot(record)} placement='topLeft'>
					<Button
						disabled={thoiGian !== EThoiGianDot.DANG_DIEN_RA || record?.kichHoat === false}
						onClick={() => handleEdit(record)}
						type='link'
						icon={<EditOutlined />}
					/>
				</Tooltip>
			),
		},
	];

	return (
		<TableBase
			columns={columns}
			getData={getDotMeModel}
			dependencies={[page, limit, thoiGian]}
			modelName='tienich.dotkhaosat'
			title='Đợt khảo sát'
			Form={Form}
			formProps={{ cauTraLoi }}
			widthDrawer={800}
			buttons={{ create: false }}
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

export default DotKhaoSatPage;
