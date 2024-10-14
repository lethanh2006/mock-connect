import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';

import { EyeOutlined } from '@ant-design/icons';
import { Button, Modal, Tooltip } from 'antd';
import moment from 'moment';
import { useCallback, useState } from 'react';
import { useModel } from 'umi';

import type { HoiDong } from '@/services/QuyTrinh/HoiDong/typings';
import TableDonHoiDong from './components/TableDonHoiDong';
import TableThanhVien from './components/TableThanhVien';

const HoiDongThamGia = (props: { viewTheoBuoc?: boolean }) => {
	const { getHoiDongThamGia, page, limit, condition, setRecord, setVisibleForm } = useModel('quytrinh.hoidong');

	const [visibleViewThanhVien, setVisibleViewThanhVien] = useState<boolean>(false);
	const onCancelViewThanhVien = useCallback(() => {
		setVisibleViewThanhVien(false);
	}, []);

	const getData = () => {
		if (!props.viewTheoBuoc) {
			getHoiDongThamGia();
		}
	};
	const columns: IColumn<HoiDong.IRecord>[] = [
		{
			title: 'Tên hội đồng',
			dataIndex: 'ten',
			width: 150,
			filterType: 'string',
		},
		{
			title: 'Văn bản kèm theo',
			dataIndex: 'danhSachVanBanLuuTru',
			width: 200,
			render: (val, rec) => {
				return (
					<div>
						{rec.danhSachVanBanLuuTru.map((item, index) => (
							<div key={item.url}>
								<a href={item.url} target='_blank' rel='noreferrer'>
									{index + 1}. {item.tenFile}
								</a>
							</div>
						))}
					</div>
				);
			},
		},
		{
			title: 'Thời gian',
			width: 150,
			render: (record: HoiDong.IRecord) => (
				<div>
					{moment(record.startDate).format('HH:mm DD/MM/YYYY')} - {moment(record.endDate).format('HH:mm DD/MM/YYYY')}
				</div>
			),
		},
		{
			title: 'Danh sách thành viên',
			width: 150,
			align: 'center',
			render: (record: HoiDong.IRecord) => (
				<Button
					onClick={() => {
						setRecord(record);
						setVisibleViewThanhVien(true);
					}}
					type='link'
				>
					{record.danhSachThanhVien.length} thành viên
				</Button>
			),
		},

		// {
		// 	title: 'Thao tác',
		// 	align: 'center',
		// 	width: 120,
		// 	fixed: 'right',
		// 	render: (rec: HoiDong.IRecord) => (
		// 		<>
		// 			<Tooltip title='Chi tiết'>
		// 				<Button
		// 					onClick={() => {
		// 						setVisibleForm(true);
		// 						setRecord(rec);
		// 					}}
		// 					type='link'
		// 					icon={<EyeOutlined />}
		// 				/>
		// 			</Tooltip>
		// 		</>
		// 	),
		// },
	];
	return (
		<>
			<TableBase
				addStt={!props.viewTheoBuoc}
				hideTotal={props.viewTheoBuoc}
				hideCard={props.viewTheoBuoc}
				buttons={{ create: false, reload: !props.viewTheoBuoc, filter: !props.viewTheoBuoc }}
				otherProps={{ pagination: !props.viewTheoBuoc, size: 'small' }}
				title={'Danh sách hội đồng'}
				modelName={'quytrinh.hoidong'}
				columns={columns}
				dependencies={[page, limit, condition]}
				Form={TableDonHoiDong}
				getData={getData}
				widthDrawer={1200}
				destroyModal
			/>
			<Modal
				width={900}
				title='Danh sách thành viên'
				footer={
					<Button type='primary' onClick={onCancelViewThanhVien}>
						Đóng
					</Button>
				}
				visible={visibleViewThanhVien}
				onCancel={onCancelViewThanhVien}
			>
				<TableThanhVien mode='view' />
			</Modal>
		</>
	);
};
export default HoiDongThamGia;
