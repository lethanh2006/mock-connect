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
			title: 'Học phần xin công nhận',
			dataIndex: 'maHocPhan',
			width: 250,
			render: (val, rec) => (
				<>
					{rec?.hocPhan?.ten} ({val} - {rec?.hocPhan?.soTinChi} tín chỉ)
				</>
			),
			onCell,
		},
		{
			title: 'Minh chứng',
			width: 200,
			render: (val, rec) => (
				<>
					- {rec?.loai}
					{rec?.tenChungChi ? <>: {rec?.tenChungChi} </> : null}
					{rec?.tenHocPhan ? <>: {rec?.tenHocPhan}</> : null}
				</>
			),
			onCell,
		},
		{
			title: 'Kết quả quy đổi',
			width: 240,
			children: [
				{
					title: 'Điểm hệ 10',
					dataIndex: 'diemHe10',
					align: 'center',
					width: 80,
					onCell: (rec) => ({
						colSpan: !rec?.diemHe10 && !rec?.diemChu ? 0 : 1,
						onClick: () => handleView(rec),
						style: { cursor: 'pointer' },
					}),
				},
				{
					title: 'Điểm hệ 4',
					dataIndex: 'diemHe4',
					align: 'center',
					width: 80,
					onCell: (rec) => ({
						colSpan: !rec?.diemHe4 && 0,
						onClick: () => handleView(rec),
						style: { cursor: 'pointer' },
					}),
				},
				{
					title: 'Điểm chữ',
					dataIndex: 'diemChu',
					align: 'center',
					width: 80,
					render: (val) => val ?? <i>Chưa có điểm</i>,
					onCell: (rec) => ({
						colSpan: !rec?.diemChu && 3,
						onClick: () => handleView(rec),
						style: { cursor: 'pointer' },
					}),
				},
			],
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			align: 'center',
			width: 120,
			render: (val, rec) => <Tag color={colorTrangThaiHocPhanQuyDoi[val as ETrangThaiHocPhanQuyDoi]}>{val}</Tag>,
			onCell,
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
				width={600}
				footer={null}
				onCancel={() => setVisibleForm(false)}
			>
				<FormHocPhanQuyDoiDiem />
			</Modal>
		</>
	);
};

export default FormItemHocPhanQuyDoi;
