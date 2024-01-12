import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';

import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Modal, Popconfirm, Space } from 'antd';
import monent from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import FormMinhChungQuyDoiDiem from './Form';
import type { QuyDoiDiem } from '@/services/HocTap/QuyDoiDiem/typing';

const FormItemMinhChungQuyDoi = (props: {
	value?: QuyDoiDiem.IMinhChungQuyDoiDiem[];
	onChange?: (data: QuyDoiDiem.IMinhChungQuyDoiDiem[]) => void;
	getData?: () => void;
}) => {
	const { record } = useModel('daotao.quydoidiem.sinhvienquydoidiem');
	const { handleEdit, setVisibleForm, visibleForm, getModel, danhSach } = useModel(
		'daotao.quydoidiem.minhchungquydoidiem',
	);
	const { value = record?.danhSachMinhChungQuyDoi ?? [], onChange, getData: getDataExternal } = props;

	const getData = () => getModel({ quyDoiDiemSvId: record?._id });

	useEffect(() => {
		if (record?._id) getData();
	}, [record?._id]);

	const [recMinhChung, setRecMinhChung] = useState<any>();

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
			render: (val, rec) => (
				<>
					{/* Chứng chỉ đã đạt */}
					{rec.tenChungChi ? (
						<>
							- Tên chứng chỉ: <b>{rec?.tenChungChi}</b> <br />
						</>
					) : null}
					{rec.bacChungChi ? (
						<>
							- Điểm/bậc chứng chỉ: <b>{rec?.bacChungChi}</b> <br />
						</>
					) : null}
					{rec.donViCap ? (
						<>
							- Đơn vị cấp: <b>{rec?.donViCap}</b> <br />
						</>
					) : null}
					{rec.thoiGianHieuLuc ? (
						<>
							- Thời gian hiệu lực: <b>{monent(rec?.thoiGianHieuLuc).format('DD/MM/YYYY')}</b> <br />
						</>
					) : null}
					{rec.thoiGianHetHieuLuc ? (
						<>
							- Thời gian hết hiệu lực: <b>{monent(rec?.thoiGianHetHieuLuc).format('DD/MM/YYYY')}</b> <br />
						</>
					) : null}

					{/* Học phần đã học */}
					{rec?.tenHocPhan ? (
						<>
							- Tên học phần: <b>{rec?.tenHocPhan}</b> <br />
						</>
					) : null}
					{rec?.maHocPhan ? (
						<>
							- Mã học phần: <b>{rec?.maHocPhan}</b> <br />
						</>
					) : null}
					{rec?.soTinChi ? (
						<>
							- Số tín chỉ: <b>{rec?.soTinChi}</b> <br />
						</>
					) : null}
					{rec?.trinhDoDaoTao ? (
						<>
							- Trình độ: <b>{rec?.trinhDoDaoTao}</b> <br />
						</>
					) : null}
					{rec?.tenTruong ? (
						<>
							- Trường đã học: <b>{rec?.tenTruong}</b> <br />
						</>
					) : null}
					{rec?.diemHe10 ? (
						<>
							- Điểm hệ 10: <b>{rec?.diemHe10}</b> <br />
						</>
					) : null}
					{rec?.diemHe4 ? (
						<>
							- Điểm hệ 4: <b>{rec?.diemHe4}</b> <br />
						</>
					) : null}
					{rec?.diemChu ? (
						<>
							- Điểm chữ: <b>{rec?.diemChu}</b> <br />
						</>
					) : null}
					{rec.urlsChungChi ? (
						<>
							- Tệp đính kèm:{' '}
							<Space>
								{rec?.urlsChungChi?.map((item, index) => (
									<a target='_blank' href={item} key={item} rel='noreferrer'>
										Xem tệp tin {index + 1}
									</a>
								))}
							</Space>
						</>
					) : null}
					{rec.urlsHocPhan ? (
						<>
							- Tệp đính kèm:{' '}
							<Space>
								{rec?.urlsHocPhan?.map((item, index) => (
									<a target='_blank' href={item} key={item} rel='noreferrer'>
										Xem tệp tin {index + 1}
									</a>
								))}
							</Space>
						</>
					) : null}
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
				<ButtonExtend icon={<PlusCircleOutlined />} onClick={() => setVisibleForm(true)} size='small'>
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
