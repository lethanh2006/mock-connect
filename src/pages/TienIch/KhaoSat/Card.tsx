import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { getCauTraLoiMe, getCauTraLoiMeTracNghiem } from '@/services/TienIch/KhaoSat/BieuMau';
import type { BieuMau } from '@/services/TienIch/KhaoSat/BieuMau/typing';
import { type DotKhaoSat } from '@/services/TienIch/KhaoSat/DotKhaoSat/typing';
import { ELoaiDot, EThoiGianDot, textThucHienKhaoSat, thoiGianDot } from '@/services/TienIch/KhaoSat/constants';
import { formatDateTime } from '@/utils/formatDate';
import { EditOutlined } from '@ant-design/icons';
import { Button, Segmented, Tag, Tooltip } from 'antd';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import Form from './components/Form';

const CardKhaoSat = (props: { loai: ELoaiDot }) => {
	const intl = useIntl();
	const { loai } = props;
	const { page, limit, getDotMeModel, handleEdit: handleDot, thoiGian, setThoiGian } = useModel('tienich.dotkhaosat');
	const { getByIdModel: getBieuMau, loading } = useModel('tienich.bieumau');
	const [cauTraLoi, setCauTraLoi] = useState<BieuMau.ICauTraLoiKhaoSat>();

	const getCauTraLoiMeModal = (rec: DotKhaoSat.IRecord) => {
		if (loai === ELoaiDot.CUOC_THI) {
			getCauTraLoiMeTracNghiem({
				idKhaoSat: rec?.idKhaoSat ?? '',
				idDot: rec?._id ?? '',
			})
				.then((res) => {
					setCauTraLoi(res.data?.data);
				})
				.catch((err) => console.log(err));
		} else {
			getCauTraLoiMe(rec?.idKhaoSat ?? '', rec?._id ?? '')
				.then((res) => {
					setCauTraLoi(res.data?.data?.find((item: BieuMau.ICauTraLoiKhaoSat) => item?.idDot === rec?._id) ?? {});
				})
				.catch((err) => console.log(err));
		}
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
			return intl.formatMessage({ id: 'khaosat.trangthai.chuakichhoat' });
		} else return textThucHienKhaoSat[thoiGian];
	};

	const onCell = (rec: DotKhaoSat.IRecord) => ({
		onClick: () => handleEdit(rec),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<DotKhaoSat.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'khaosat.column.ten' }),
			dataIndex: 'ten',
			width: 200,
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'khaosat.column.mota' }),
			dataIndex: 'moTa',
			width: 250,
			render: (val) => <ExpandText>{val}</ExpandText>,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'khaosat.column.batdau' }),
			dataIndex: 'thoiGianBatDau',
			width: 120,
			align: 'center',
			render: (val) => (val ? formatDateTime(val) : ''),
			filterType: 'datetime',
			sortable: true,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'khaosat.column.ketthuc' }),
			dataIndex: 'thoiGianKetThuc',
			width: 120,
			align: 'center',
			render: (val) => (val ? formatDateTime(val) : ''),
			filterType: 'datetime',
			sortable: true,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'khaosat.column.trangthai' }),
			dataIndex: 'daLam',
			align: 'center',
			width: 120,
			render: (val) =>
				val ? (
					<Tag color='green'>{intl.formatMessage({ id: 'khaosat.trangthai.dathuchien' })}</Tag>
				) : (
					<Tag color='red'>{intl.formatMessage({ id: 'khaosat.trangthai.chuathuchien' })}</Tag>
				),
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'khaosat.column.thaotac' }),
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
			getData={() => getDotMeModel(loai)}
			dependencies={[page, limit, thoiGian]}
			modelName='tienich.dotkhaosat'
			title={
				loai === ELoaiDot.BIEU_MAU
					? intl.formatMessage({ id: 'khaosat.title.dot' })
					: loai === ELoaiDot.CUOC_THI
						? intl.formatMessage({ id: 'khaosat.title.cuocthi' })
						: ''
			}
			Form={Form}
			formProps={{ khaoSat: cauTraLoi, cauTraLoi: cauTraLoi?.danhSachTraLoi, loai }}
			widthDrawer={1100}
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

export default CardKhaoSat;
