import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import { type EThuTrongTuan, mapNameThuTrongTuan } from '@/services/QuanLyThuVien/constant';
import type { QuanLyThuVien } from '@/services/QuanLyThuVien/typing';
import { Modal } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const ThoiGianVaoRaThuVien = (props: { visible: boolean; setVisible: (val: boolean) => void }) => {
	const { visible, setVisible } = props;
	const { getAllModel, loading } = useModel('thuvien.vaorathuvien');
	const [danhSach, setDanhSach] = useState<any>();

	const getData = () => {
		getAllModel(undefined, undefined, undefined, undefined, 'setting', false)
			.then((res: any) => setDanhSach(res))
			.catch((err) => console.log(err));
	};

	useEffect(() => {
		getData();
	}, []);

	const columns: IColumn<QuanLyThuVien.ICauHinhVaoRaThuVien>[] = [
		{
			title: 'Thời gian',
			dataIndex: 'thu',
			align: 'center',
			width: 150,
			render: (val) => mapNameThuTrongTuan[val as EThuTrongTuan],
		},
		{
			title: 'Sáng',
			width: 240,
			children: [
				{
					title: 'Thời gian vào',
					dataIndex: 'thoiGianMoCuaBuoiSang',
					align: 'center',
					width: 120,
				},
				{
					title: 'Thời gian ra',
					dataIndex: 'thoiGianDongCuaBuoiSang',
					align: 'center',
					width: 120,
				},
			],
		},
		{
			title: 'Chiều',
			width: 240,
			children: [
				{
					title: 'Thời gian vào',
					dataIndex: 'thoiGianMoCuaBuoiChieu',
					align: 'center',
					width: 120,
				},
				{
					title: 'Thời gian ra',
					dataIndex: 'thoiGianDongCuaBuoiChieu',
					align: 'center',
					width: 120,
				},
			],
		},
		{
			title: 'Tối',
			width: 240,
			children: [
				{
					title: 'Thời gian vào',
					dataIndex: 'thoiGianMoCuaBuoiToi',
					align: 'center',
					width: 120,
				},
				{
					title: 'Thời gian ra',
					dataIndex: 'thoiGianDongCuaBuoiToi',
					align: 'center',
					width: 120,
				},
			],
		},
	];

	return (
		<Modal
			title='Thông tin thời gian vào ra thư viện'
			visible={visible}
			onCancel={() => setVisible(false)}
			footer={null}
			width={1000}
		>
			<TableStaticData
				loading={loading}
				columns={columns}
				data={_.orderBy(danhSach?.thoiGian, ['thu'], 'asc') ?? []}
				size='small'
				addStt
				hasTotal
				otherProps={{ pagination: true }}
			/>
		</Modal>
	);
};

export default ThoiGianVaoRaThuVien;
