import PreviewFile from '@/components/PreviewFile';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { type ThoiKhoaBieu } from '@/services/DaoTao/ThoiKhoaBieu/typing';
import {
	colorTrangThaiUserDiemDanh,
	trangThaiUserDiemDanh,
	type ETrangThaiUserDiemDanh,
} from '@/services/DaoTao/constant';
import { colorHinhThucGiangDay, type EHinhThucGiangDay } from '@/services/HocTap/LopHocPhan/constant';
import { THU_TRONG_TUAN } from '@/services/SuKien/constant';
import { Button, Carousel, Modal, Tag } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { useModel } from 'umi';

const TableLichHocLopHP = (props: {
	items: ThoiKhoaBieu.IRecord[];
	onClickItem: (val: ThoiKhoaBieu.IRecord) => void;
}) => {
	const { loading } = useModel('daotao.thoikhoabieu');
	const { items, onClickItem } = props;
	const [url, setUrl] = useState<any[]>([]);
	const [visibleFormFile, setVisibleFormFile] = useState<boolean>(false);

	const onCell = (rec: ThoiKhoaBieu.IRecord) => ({
		onClick: () => onClickItem(rec),
		style: {
			cursor: 'pointer',
			backgroundColor: moment().isSame(rec.ngay, 'D') ? '#005fcc1f' : undefined,
		},
	});

	const columns: IColumn<ThoiKhoaBieu.IRecord>[] = [
		{
			title: 'TT',
			dataIndex: 'index',
			width: 60,
			align: 'center',
			onCell,
		},
		{
			title: 'Ngày học',
			dataIndex: 'ngay',
			align: 'center',
			width: 150,
			render: (val) => (val ? `${THU_TRONG_TUAN[moment(val).day()]}, ${moment(val).format('DD/MM/YYYY')}` : null),
			onCell,
		},
		{
			title: 'Tiết học',
			width: 60,
			align: 'center',
			render: (val, rec) => `${rec.tietBatDau} - ${rec.tietKetThuc}`,
			onCell,
		},
		{
			title: 'Phòng học',
			dataIndex: 'phongHoc',
			align: 'center',
			width: 100,
			render: (val) => (val ? val : <i>Chưa cập nhật</i>),
			onCell,
		},
		{
			title: 'Hình thức',
			dataIndex: 'hinhThucGiangDay',
			align: 'center',
			width: 100,
			render: (val: EHinhThucGiangDay) => val && <Tag color={colorHinhThucGiangDay[val]}>{val}</Tag>,
			onCell,
		},
		{
			title: 'Điểm danh',
			dataIndex: 'trangThaiDiemDanhCaNhan',
			align: 'center',
			width: 120,
			render: (val: ETrangThaiUserDiemDanh) =>
				val ? <Tag color={colorTrangThaiUserDiemDanh[val]}>{trangThaiUserDiemDanh[val]}</Tag> : null,
			onCell,
		},
		{
			title: 'Giảng viên',
			dataIndex: 'nhanSuSsoId',
			width: 140,
			render: (val, rec) =>
				rec.nhanSu?.ten ? [rec.nhanSu?.hoDem, rec.nhanSu?.ten].join(' ') : rec.tenNhanSu ?? <i>Chưa cập nhật</i>,
			onCell,
		},
		{
			title: 'Tiêu đề',
			dataIndex: 'tieuDeBaiHoc',
			width: 180,
			// render: (val, rec) => rec.noiDungHp?.tieuDe ?? '',
			onCell,
		},
		{
			title: 'Học liệu',
			width: 140,
			render: (val, rec) =>
				rec.hocLieuList?.filter((item) => item?.url)?.length ? (
					<a
						onClick={() => {
							setUrl(rec?.hocLieuList ?? []);
							setVisibleFormFile(true);
						}}
					>
						Xem chi tiết
					</a>
				) : null,
		},
		// {
		// 	title: 'Loại hình',
		// 	dataIndex: 'loaiHinhHocTap',
		// 	width: 80,
		// 	render: (val) => (val ? val : ''),
		// 	onCell,
		// },
		// {
		// 	title: 'Nhóm lớp',
		// 	align: 'center',
		// 	width: 80,
		// 	render: (val, rec) => !!rec.lopHocPhan?.tenCha && `Nhóm ${rec.lopHocPhan?.loai} ${rec.lopHocPhan?.soThuTuNhom}`,
		// 	onCell,
		// },
	];

	return (
		<>
			<TableStaticData
				hasTotal
				data={items}
				columns={columns}
				otherProps={{ pagination: false, loading, scroll: { y: 600 } }}
			/>

			<Modal
				title='Chi tiết học liệu'
				width={800}
				visible={visibleFormFile}
				footer={
					<div className='form-footer'>
						<Button onClick={() => setVisibleFormFile(false)}>Đóng</Button>
					</div>
				}
				onCancel={() => setVisibleFormFile(false)}
			>
				<Carousel autoplay pauseOnDotsHover>
					{url?.map((item) => (
						// eslint-disable-next-line react/jsx-key
						<PreviewFile file={item.url ?? ''} tenFile={item?.ten} />
					))}
				</Carousel>
			</Modal>
		</>
	);
};

export default TableLichHocLopHP;
