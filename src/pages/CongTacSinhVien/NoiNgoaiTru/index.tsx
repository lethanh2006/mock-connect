import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import {
	ETrangThaiKhaiBaoNoiNgoaiTru,
	colorETrangThaiKhaiBaoNoiNgoaiTru,
} from '@/services/CongTacSinhVien/NoiNgoaiTru/constant';
import type { NoiNgoaiTru } from '@/services/CongTacSinhVien/NoiNgoaiTru/typing';
import dayjs from '@/utils/dayjs';
import { formatDateTime } from '@/utils/formatDate';
import { Card, Modal, Tag } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import FormKhaiBao from './components/Form';
import ModalChiTiet from './components/ModalChiTiet';

const NoiNgoaiTruPage = () => {
	const { getAllModel, handleEdit, handleView, isView, danhSach, loading, visibleForm, setVisibleForm, record } =
		useModel('noingoaitru.khaibao');

	const getData = () => getAllModel(undefined, undefined, undefined, undefined, 'me');

	useEffect(() => {
		getData();
	}, []);

	const onCell = (rec: NoiNgoaiTru.IKhaiBao) => ({
		onClick: () => handleView(rec),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<NoiNgoaiTru.IKhaiBao>[] = [
		{
			title: 'Kỳ học',
			dataIndex: 'dotKhaiBaoId',
			width: 150,
			align: 'center',
			render: (val, rec) => rec.dotKhaiBao?.hocKy?.ten ?? rec.dotKhaiBao?.maHocKy,
			onCell,
		},
		{
			title: 'Tên đợt',
			dataIndex: 'dotKhaiBaoId',
			width: 180,
			render: (val, rec) => rec.dotKhaiBao?.tenDot,
			onCell,
		},
		{
			title: 'Thời gian',
			dataIndex: 'dotKhaiBaoId',
			align: 'center',
			width: 250,
			render: (val, rec) => (
				<>
					{formatDateTime(rec.dotKhaiBao?.thoiGianBatDau)} - {formatDateTime(rec.dotKhaiBao?.thoiGianKetThuc)}
				</>
			),
			onCell,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'dotKhaiBaoId',
			align: 'center',
			width: 130,
			render: (val, rec) => {
				if (dayjs().isBefore(rec.dotKhaiBao?.thoiGianBatDau)) {
					return <Tag color={'blue'}>Chưa diễn ra</Tag>;
				} else {
					if (dayjs().isAfter(rec.dotKhaiBao?.thoiGianBatDau) && dayjs().isBefore(rec.dotKhaiBao?.thoiGianKetThuc)) {
						return <Tag color={'green'}>Đang diễn ra</Tag>;
					} else {
						return <Tag color={'red'}>Đã diễn ra</Tag>;
					}
				}
			},
			onCell,
		},
		{
			title: 'Khai báo',
			dataIndex: 'trangThai',
			align: 'center',
			width: 130,
			render: (val, rec) => (
				<Tag color={colorETrangThaiKhaiBaoNoiNgoaiTru[val as ETrangThaiKhaiBaoNoiNgoaiTru]}>{val}</Tag>
			),
			onCell,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 120,
			fixed: 'right',
			render: (val, rec) => (
				<>
					{rec.trangThai === ETrangThaiKhaiBaoNoiNgoaiTru.CHUA_KHAI_BAO ? (
						<ButtonExtend
							disabled={
								!(
									dayjs().isAfter(rec?.dotKhaiBao?.thoiGianBatDau) && dayjs().isBefore(rec?.dotKhaiBao?.thoiGianKetThuc)
								)
							}
							tooltip='Khai báo'
							type='primary'
							className='btn-success'
							onClick={() => handleEdit(rec)}
						>
							Khai báo
						</ButtonExtend>
					) : (
						<ButtonExtend
							disabled={
								!(
									dayjs().isAfter(rec?.dotKhaiBao?.thoiGianBatDau) && dayjs().isBefore(rec?.dotKhaiBao?.thoiGianKetThuc)
								)
							}
							tooltip='Cập nhật'
							type='primary'
							onClick={() => handleEdit(rec)}
						>
							Cập nhật
						</ButtonExtend>
					)}
				</>
			),
		},
	];

	return (
		<Card title='Lịch sử khai báo nội - ngoại trú'>
			<TableStaticData columns={columns} data={danhSach ?? []} loading={loading} addStt hasTotal onReload={getData} />

			<Modal
				open={visibleForm}
				onCancel={() => setVisibleForm(false)}
				footer={null}
				width={1000}
				title={
					isView
						? 'Thông tin khai báo nội trú, ngoại trú'
						: `${
								record?.trangThai === ETrangThaiKhaiBaoNoiNgoaiTru.DA_KHAI_BAO ? 'Chỉnh sửa' : 'Khai báo'
							} thông tin nội - ngoại trú`
				}
			>
				{isView ? <ModalChiTiet /> : <FormKhaiBao getData={getData} />}
			</Modal>
		</Card>
	);
};

export default NoiNgoaiTruPage;
