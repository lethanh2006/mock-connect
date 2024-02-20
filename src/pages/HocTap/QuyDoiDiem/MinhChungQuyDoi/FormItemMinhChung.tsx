import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import type { QuyDoiDiem } from '@/services/HocTap/QuyDoiDiem/typing';
import { EMinhChungQuyDoiDiem } from '@/services/HocTap/constant';
import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Modal, Popconfirm, Space } from 'antd';
import monent from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import FormMinhChungQuyDoiDiem from './Form';

const FormItemMinhChungQuyDoi = (props: {
	value?: QuyDoiDiem.IMinhChungQuyDoiDiem[];
	onChange?: (data: QuyDoiDiem.IMinhChungQuyDoiDiem[]) => void;
	getData?: () => void;
}) => {
	const { record, isView } = useModel('daotao.quydoidiem.sinhvienquydoidiem');
	const { handleEdit, setVisibleForm, visibleForm, getModel, danhSach } = useModel(
		'daotao.quydoidiem.minhchungquydoidiem',
	);
	const { value = record?.danhSachMinhChungQuyDoi ?? [], onChange, getData: getDataExternal } = props;
	const [recMinhChung, setRecMinhChung] = useState<any>();

	const getData = () => getModel({ quyDoiDiemSvId: record?._id });

	useEffect(() => {
		if (record?._id) getData();
	}, [record?._id]);

	const onDelete = (index: number) => {
		const data = [...value];
		data.splice(index, 1);
		if (onChange) onChange(data);
	};

	const onAdd = (rec: QuyDoiDiem.IMinhChungQuyDoiDiem) => {
		if (!recMinhChung?.index) {
			const data = [...value, rec];
			if (onChange) onChange(data);
			setVisibleForm(false);
		} else {
			const data = [...value];
			data.splice(recMinhChung?.index - 1, 1, rec);
			if (onChange) onChange(data);
			setVisibleForm(false);
		}
	};

	const columns: IColumn<QuyDoiDiem.IMinhChungQuyDoiDiem & { index: number }>[] = [
		{
			title: 'Loại minh chứng',
			dataIndex: 'loai',
			width: 100,
			align: 'center',
		},
		{
			title: 'Thông tin minh chứng',
			width: 350,
			render: (val, rec) =>
				rec.loai === EMinhChungQuyDoiDiem.CHUNG_CHI ? (
					<>
						- Tên chứng chỉ: <b>{rec?.tenChungChi ?? ''}</b>
						<br />- Điểm/bậc chứng chỉ: <b>{rec?.bacChungChi ?? ''}</b>
						<br />- Đơn vị cấp: <b>{rec?.donViCap ?? ''}</b>
						<br />- Thời gian hiệu lực:
						<b>{rec?.thoiGianHieuLuc && monent(rec?.thoiGianHieuLuc).format('DD/MM/YYYY')}</b>
						<br />- Thời gian hết hiệu lực:{' '}
						<b>{rec?.thoiGianHetHieuLuc && monent(rec?.thoiGianHetHieuLuc).format('DD/MM/YYYY')}</b>
						<br />- Tệp đính kèm:{' '}
						<Space>
							{rec?.urlsChungChi?.map((item, index) => (
								<a target='_blank' href={item} key={item} rel='noreferrer'>
									Xem tệp tin {index + 1}
								</a>
							))}
						</Space>
					</>
				) : (
					<>
						- Tên học phần: <b>{rec?.tenHocPhan ?? ''}</b>
						<br />- Mã học phần: <b>{rec?.maHocPhan ?? ''}</b>
						<br />- Sốtín chỉ: <b>{rec?.soTinChi ?? ''}</b>
						<br />- Trình độ: <b>{rec?.trinhDoDaoTao ?? ''}</b>
						<br />- Trường đã học: <b>{rec?.tenTruong ?? ''}</b>
						<br />- Điểm hệ 10: <b>{rec?.diemHe10 ?? ''}</b>
						<br />- Điểm hệ 4: <b>{rec?.diemHe4 ?? ''}</b>
						<br />- Điểm chữ: <b>{rec?.diemChu ?? ''}</b>
						<br />- Tệp đính kèm:{' '}
						<Space>
							{rec?.urlsHocPhan?.map((item, index) => (
								<a target='_blank' href={item} key={item} rel='noreferrer'>
									Xem tệp tin {index + 1}
								</a>
							))}
						</Space>
					</>
				),
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<ButtonExtend
						tooltip='Chỉnh sửa'
						type='link'
						onClick={() => (setRecMinhChung(rec), handleEdit(rec))}
						icon={<EditOutlined />}
					/>
					<Popconfirm
						onConfirm={() => onDelete(rec.index - 1)}
						title='Bạn có chắc chắn muốn xóa minh chứng này?'
						placement='topRight'
					>
						<ButtonExtend tooltip='Xóa' danger type='link' icon={<DeleteOutlined />} />
					</Popconfirm>
				</>
			),
			hide: isView,
		},
	];

	return (
		<>
			<div className='fw500' style={{ marginTop: 8, marginBottom: 8 }}>
				Danh sách minh chứng
			</div>

			<TableStaticData
				data={record?._id ? danhSach : value}
				columns={columns}
				size='small'
				addStt
				otherProps={{ pagination: false }}
			>
				<ButtonExtend icon={<PlusCircleOutlined />} hidden={isView} onClick={() => setVisibleForm(true)} size='small'>
					Thêm mới
				</ButtonExtend>
			</TableStaticData>

			<Modal
				title='Thêm mới minh chứng'
				visible={visibleForm}
				width={800}
				footer={null}
				onCancel={() => (setVisibleForm(false), setRecMinhChung(''))}
			>
				<FormMinhChungQuyDoiDiem
					onOk={onAdd}
					recMinhChung={recMinhChung}
					setRecMinhChung={setRecMinhChung}
					getData={() => {
						getData();
						if (getDataExternal) getDataExternal();
					}}
				/>
			</Modal>
		</>
	);
};

export default FormItemMinhChungQuyDoi;
