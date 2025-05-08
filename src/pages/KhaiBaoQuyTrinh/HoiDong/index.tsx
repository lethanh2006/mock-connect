import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import { Button, Carousel } from 'antd';
import moment from 'moment';
import { useCallback, useState } from 'react';
import { useModel } from 'umi';

import PreviewFile from '@/components/PreviewFile';
import ModalExpandable from '@/components/Table/ModalExpandable';
import type { HoiDong } from '@/services/QuyTrinh/HoiDong/typings';
import TableDonHoiDong from './components/TableDonHoiDong';
import TableThanhVien from './components/TableThanhVien';

const HoiDongThamGia = (props: { viewTheoBuoc?: boolean }) => {
	const { getHoiDongThamGia, page, limit, condition, record, setRecord, setVisibleForm } = useModel('quytrinh.hoidong');

	const [visibleViewThanhVien, setVisibleViewThanhVien] = useState<boolean>(false);
	const [visibleFormFile, setVisibleFormFile] = useState<boolean>(false);
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
			render: (val, rec) =>
				rec?.danhSachVanBanLuuTru?.filter((item) => item?.url)?.length ? (
					<a
						onClick={() => {
							setRecord(rec);
							setVisibleFormFile(true);
						}}
					>
						Xem chi tiết
					</a>
				) : null,
		},
		{
			title: 'Thời gian',
			width: 150,
			render: (rec: HoiDong.IRecord) => (
				<div>
					{moment(rec.startDate).format('HH:mm DD/MM/YYYY')} - {moment(rec.endDate).format('HH:mm DD/MM/YYYY')}
				</div>
			),
		},
		{
			title: 'Danh sách thành viên',
			width: 150,
			align: 'center',
			render: (rec: HoiDong.IRecord) => (
				<Button
					onClick={() => {
						setRecord(rec);
						setVisibleViewThanhVien(true);
					}}
					type='link'
				>
					{rec.danhSachThanhVien.length} thành viên
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

			<ModalExpandable
				width={1000}
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
			</ModalExpandable>

			<ModalExpandable
				title='Chi tiết văn bản kèm theo'
				width={1000}
				visible={visibleFormFile}
				footer={
					<div className='form-footer'>
						<Button onClick={() => setVisibleFormFile(false)}>Đóng</Button>
					</div>
				}
				onCancel={() => setVisibleFormFile(false)}
			>
				<Carousel autoplay pauseOnDotsHover>
					{record?.danhSachVanBanLuuTru?.map((item) => (
						// eslint-disable-next-line react/jsx-key
						<PreviewFile file={item?.url ?? ''} tenFile={item?.tenFile} />
					))}
				</Carousel>
			</ModalExpandable>
		</>
	);
};
export default HoiDongThamGia;
