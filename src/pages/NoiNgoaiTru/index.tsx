import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import { ETrangThaiKhaiBaoNoiNgoaiTru, colorETrangThaiKhaiBaoNoiNgoaiTru } from '@/services/NoiNgoaiTru/constant';
import type { NoiNgoaiTru } from '@/services/NoiNgoaiTru/typing';
import { Card, Tag } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { useModel } from 'umi';
import Form from './components/Form';
import ModalChiTiet from './components/ModalChiTiet';

const NoiNgoaiTruPage = () => {
	const { getAllModel, handleEdit, setRecord } = useModel('noingoaitru.khaibao');
	const [viewChiTiet, setViewChiTiet] = useState<boolean>(false);

	const getData = () => getAllModel(undefined, undefined, undefined, undefined, 'me');

	const onCell = (rec: NoiNgoaiTru.IKhaiBao) => ({
		onClick: () => (setViewChiTiet(true), setRecord(rec)),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<NoiNgoaiTru.IKhaiBao>[] = [
		{
			title: 'Kỳ học',
			dataIndex: 'dotKhaiBaoId',
			width: 150,
			render: (val, rec) => rec.dotKhaiBao?.hocKy?.ten ?? rec.dotKhaiBao?.maHocKy,
			onCell,
		},
		{
			title: 'Tên đợt',
			dataIndex: 'dotKhaiBaoId',
			width: 150,
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
					{moment(rec.dotKhaiBao?.thoiGianBatDau).format('HH:mm DD/MM/YYYY')} -{' '}
					{moment(rec.dotKhaiBao?.thoiGianKetThuc).format('HH:mm DD/MM/YYYY')}
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
				if (moment().isBefore(rec.dotKhaiBao?.thoiGianBatDau)) {
					return <Tag color={'blue'}>Chưa diễn ra</Tag>;
				} else {
					if (moment().isAfter(rec.dotKhaiBao?.thoiGianBatDau) && moment().isBefore(rec.dotKhaiBao?.thoiGianKetThuc)) {
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
									moment().isAfter(rec?.dotKhaiBao?.thoiGianBatDau) &&
									moment().isBefore(rec?.dotKhaiBao?.thoiGianKetThuc)
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
									moment().isAfter(rec?.dotKhaiBao?.thoiGianBatDau) &&
									moment().isBefore(rec?.dotKhaiBao?.thoiGianKetThuc)
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
			<TableBase
				title='Nội trú, ngoại trú'
				columns={columns}
				getData={getData}
				modelName='noingoaitru.khaibao'
				hideCard
				Form={Form}
				formType='Drawer'
				buttons={{ create: false, export: true }}
				widthDrawer={1000}
			/>

			<ModalChiTiet visibleForm={viewChiTiet} setVisibleForm={setViewChiTiet} />
		</Card>
	);
};

export default NoiNgoaiTruPage;
