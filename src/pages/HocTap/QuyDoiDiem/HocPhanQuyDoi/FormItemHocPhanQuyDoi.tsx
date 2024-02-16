import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { colorTrangThaiHocPhanQuyDoi, type ETrangThaiHocPhanQuyDoi } from '@/services/HocTap/constant';
import type { QuyDoiDiem } from '@/services/HocTap/QuyDoiDiem/typing';
import { Modal, Tag } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import FormHocPhanQuyDoiDiem from './Form';

const FormItemHocPhanQuyDoi = () => {
	const { setVisibleForm, visibleForm, getModel, danhSach, loading, handleView } = useModel(
		'daotao.quydoidiem.sinhvienquydoidiem',
	);

	const { record: recPhieu } = useModel('daotao.quydoidiem.phieuquydoidiem');

	const getData = () => getModel({ phieuDangKyQuyDoiDiemId: recPhieu?._id });

	useEffect(() => {
		if (recPhieu?._id) getData();
	}, [recPhieu?._id]);

	const onCell = (rec: QuyDoiDiem.IQuyDoiDiemSinhVien) => ({
		onClick: () => handleView(rec),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<QuyDoiDiem.IQuyDoiDiemSinhVien>[] = [
		{
			title: 'Học phần',
			width: 200,
			render: (val, rec) =>
				rec?.danhSachMinhChungQuyDoi?.map((item: any) => (
					<div key={item._id}>
						- {item?.loai}
						{item?.tenChungChi ? <>: {item?.tenChungChi} </> : null}
						{item?.tenHocPhan ? <>: {item?.tenHocPhan}</> : null}
					</div>
				)),
			onCell,
		},
		{
			title: 'HP xin công nhận',
			width: 250,
			children: [
				{
					title: 'Tên học phần',
					width: 170,
					render: (val, rec) => rec?.hocPhan?.ten,
					onCell,
				},
				{
					title: 'Số tín chỉ',
					align: 'center',
					width: 80,
					render: (val, rec) => rec?.hocPhan?.soTinChi,
					onCell,
				},
			],
		},
		{
			title: 'Kết quả quy đổi',
			width: 240,
			children: [
				{
					title: 'Điểm thang 10',
					dataIndex: 'diemHe10',
					align: 'center',
					width: 80,
					onCell,
				},
				{
					title: 'Điểm thang 4',
					dataIndex: 'diemHe4',
					align: 'center',
					width: 80,
					onCell,
				},
				{
					title: 'Điểm chữ',
					dataIndex: 'diemChu',
					align: 'center',
					width: 80,
					onCell,
				},
			],
		},
		{
			title: 'Trạng thái',
			width: 100,
			align: 'center',
			render: (val, rec) =>
				rec?.diemHe10 || rec?.diemHe4 || rec?.diemChu ? (
					<Tag color='green'>Đã có KQ</Tag>
				) : (
					<Tag color='blue'>Chưa có KQ</Tag>
				),
		},
		{
			title: 'Công nhận',
			dataIndex: 'trangThai',
			width: 150,
			align: 'center',
			render: (val, rec) => <Tag color={colorTrangThaiHocPhanQuyDoi[val as ETrangThaiHocPhanQuyDoi]}>{val}</Tag>,
		},
	];

	return (
		<>
			<div className='fw500' style={{ marginTop: 8, marginBottom: 8 }}>
				Danh sách học phần xin công nhận
			</div>

			<TableStaticData
				loading={loading}
				data={danhSach}
				columns={columns}
				size='small'
				addStt
				otherProps={{ pagination: false }}
			/>

			<Modal
				title='Chi tiết học phần'
				visible={visibleForm}
				width={800}
				footer={null}
				onCancel={() => setVisibleForm(false)}
			>
				<FormHocPhanQuyDoiDiem />
			</Modal>
		</>
	);
};

export default FormItemHocPhanQuyDoi;
