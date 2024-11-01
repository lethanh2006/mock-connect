import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { getCauTraLoiMe } from '@/services/TienIch/KhaoSat/BieuMau';
import type { BieuMau } from '@/services/TienIch/KhaoSat/BieuMau/typing';
import { type DotKhaoSat } from '@/services/TienIch/KhaoSat/DotKhaoSat/typing';
import { EThoiGianDot, textThucHienKhaoSat, thoiGianDot } from '@/services/TienIch/KhaoSat/constants';
import { EditOutlined } from '@ant-design/icons';
import { Button, Segmented, Tag, Tooltip } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { useState } from 'react';
import { useModel } from 'umi';
import Form from './components/Form';

const DotKhaoSatPage = () => {
	const { page, limit, getDotMeModel, handleEdit: handleDot, thoiGian, setThoiGian } = useModel('tienich.dotkhaosat');
	const { getByIdModel: getBieuMau, loading } = useModel('tienich.bieumau');
	const [cauTraLoi, setCauTraLoi] = useState<BieuMau.TraLoiRecord[]>([]);

	const getCauTraLoiMeModal = (rec: DotKhaoSat.IRecord) => {
		getCauTraLoiMe(rec?.idKhaoSat ?? '', rec?._id ?? '')
			.then((res) => {
				const sortedData = _.orderBy(res.data?.data, ['updatedAt'], ['desc']);
				setCauTraLoi(sortedData[0]?.danhSachTraLoi);
			})
			.catch((err) => console.log(err));
	};

	const getBieuMauModel = (rec: DotKhaoSat.IRecord) => {
		getBieuMau(rec?.idKhaoSat ?? '');
	};

	const handleEdit = (rec: DotKhaoSat.IRecord) => {
		const promises = [getCauTraLoiMeModal(rec), getBieuMauModel(rec)];

		Promise.allSettled(promises)
			.then(() => handleDot(rec))
			.catch((er) => console.log(er));
	};

	const renderTrangThaiDot = (recordVal: DotKhaoSat.IRecord) => {
		if (!recordVal?.kichHoat) {
			return 'Đợt chưa kích hoạt';
		} else return textThucHienKhaoSat[thoiGian];
	};

	const onCell = (rec: DotKhaoSat.IRecord) => ({
		onClick: () => handleEdit(rec),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<DotKhaoSat.IRecord>[] = [
		{
			title: 'Tên đợt',
			dataIndex: 'ten',
			width: 200,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Mô tả',
			dataIndex: 'moTa',
			width: 250,
			render: (val) => <ExpandText>{val}</ExpandText>,
			onCell,
		},
		{
			title: 'Bắt đầu',
			dataIndex: 'thoiGianBatDau',
			width: 120,
			align: 'center',
			render: (val) => (val ? moment(val).format('HH:mm DD/MM/YYYY') : ''),
			filterType: 'datetime',
			sortable: true,
			onCell,
		},
		{
			title: 'Kết thúc',
			dataIndex: 'thoiGianKetThuc',
			width: 120,
			align: 'center',
			render: (val) => (val ? moment(val).format('HH:mm DD/MM/YYYY') : ''),
			filterType: 'datetime',
			sortable: true,
			onCell,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'daLam',
			align: 'center',
			width: 120,
			render: (val) => (val ? <Tag color='green'>Đã thực hiện</Tag> : <Tag color='red'>Chưa thực hiện</Tag>),
			onCell,
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
			loading={loading}
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
