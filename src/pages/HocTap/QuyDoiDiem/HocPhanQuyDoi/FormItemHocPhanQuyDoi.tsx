import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import type { QuyDoiDiem } from '@/services/HocTap/QuyDoiDiem/typing';
import {
	EMinhChungQuyDoiDiem,
	colorTrangThaiHocPhanQuyDoi,
	type ETrangThaiHocPhanQuyDoi,
} from '@/services/HocTap/constant';
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
			width: 300,
			children: [
				{ title: 'Mã HP', width: 80, dataIndex: 'maHocPhan', align: 'center', onCell },
				{ title: 'Tên học phần', width: 160, render: (val, rec) => rec.hocPhan?.ten, onCell },
				{ title: 'STC', width: 60, align: 'center', render: (val, rec) => rec.hocPhan?.soTinChi, onCell },
			],
		},
		{
			title: 'Minh chứng',
			width: 220,
			render: (val, rec) => (
				<>
					{rec?.loai}:{' '}
					{(rec?.loai === EMinhChungQuyDoiDiem.CHUNG_CHI ? rec?.tenChungChi : rec?.tenHocPhan) ?? (
						<i>Không có thông tin</i>
					)}
				</>
			),
			onCell,
		},
		{
			title: 'Kết quả quy đổi',
			dataIndex: 'diemChu',
			align: 'center',
			width: 120,
			render: (val, rec) => (val ? `${rec.diemHe10 ?? ''} - ${rec.diemHe4 ?? ''} - ${val}` : <i>Chưa có điểm</i>),
			onCell,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			align: 'center',
			width: 130,
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
