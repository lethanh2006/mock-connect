import {
	colorTrangThaiNopBaiTap,
	mapTrangThaiNopBaiTap,
	type ETrangThaiNopBaiTap,
} from '@/services/DaoTao/BaiTap/constants';
import { type ThoiKhoaBieu } from '@/services/DaoTao/ThoiKhoaBieu/typing';
import { colorHinhThucGiangDay, type EHinhThucGiangDay } from '@/services/HocTap/constant';
import type { LichThi } from '@/services/KhaoThi/LichThi/typing';
import { colorTrangThaiThi } from '@/services/KhaoThi/constant';
import { ColorSuKien, ELoaiSuKien, ELoaiSuKienKhac } from '@/services/SuKien/constant';
import { type SuKien } from '@/services/SuKien/typings';
import dayjs from '@/utils/dayjs';
import { DeleteOutlined, DownOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Descriptions, Dropdown, Modal, Popconfirm, Space, Tag, message } from 'antd';
import { history, useModel } from 'umi';

const ModalViewDetailCalendar = (props: { visible: boolean; setVisible: any; event: any; getData: () => void }) => {
	const { visible, setVisible, event, getData } = props;
	const { deleteModel, handleEdit } = useModel('sukien.sukien');
	const { getMoodleLopHocPhanModel } = useModel('lophocphan.lophocphan');
	const { record: recSetting } = useModel('tienich.settinglich');
	const loaiSuKien = event?.loaiSuKien as ELoaiSuKien | ELoaiSuKienKhac;
	const isThoiKhoaBieu = loaiSuKien === ELoaiSuKien.LICH_HOC;
	const thoiKhoaBieu = isThoiKhoaBieu ? (event as ThoiKhoaBieu.IRecord) : undefined;
	const isLichThi = loaiSuKien === ELoaiSuKien.LICH_THI;
	const lichThi = isLichThi ? (event as LichThi.IRecord) : undefined;
	const isBaiTap = loaiSuKien === ELoaiSuKien.BAI_TAP;
	const suKien = !isThoiKhoaBieu && !isLichThi ? (event as SuKien.IRecord) : undefined;

	const handleMoodle = (lopHocPhanId?: string) => {
		if (lopHocPhanId)
			getMoodleLopHocPhanModel(lopHocPhanId).then((data) => {
				if (data?.url) window.open(`${data.url}`);
				else message.error('Có lỗi, vui lòng thử lại sau');
			});
	};

	const getColorSuKien = (loai: ELoaiSuKien | ELoaiSuKienKhac) => {
		return (
			recSetting?.danhSachSettingLich?.find((item) => item?.loaiLich === loai)?.maMau ?? ColorSuKien?.[loai] ?? '#ccc'
		);
	};

	const renderThoiKhoaBieu = () => (
		<>
			<Descriptions.Item label='Lớp tín chỉ'>{thoiKhoaBieu?.tenLopHocPhan}</Descriptions.Item>
			<Descriptions.Item label='Tên học phần'>{thoiKhoaBieu?.lopHocPhan?.hocPhan?.ten}</Descriptions.Item>
			<Descriptions.Item label='Thời gian bắt đầu'>
				{dayjs(thoiKhoaBieu?.thoiGianBatDau).format('HH:mm DD/MM/YYYY')}
			</Descriptions.Item>
			<Descriptions.Item label='Thời gian kết thúc'>
				{dayjs(thoiKhoaBieu?.thoiGianKetThuc).format('HH:mm DD/MM/YYYY')}
			</Descriptions.Item>
			<Descriptions.Item label='Phòng học'>{thoiKhoaBieu?.phongHoc ?? '--'}</Descriptions.Item>
			<Descriptions.Item label='Giảng viên'>
				{thoiKhoaBieu?.giangVien?.ten
					? [thoiKhoaBieu.giangVien?.hoDem, thoiKhoaBieu.giangVien?.ten].join(' ')
					: (thoiKhoaBieu?.tenNhanSu ?? '--')}
			</Descriptions.Item>
			<Descriptions.Item label='Tiêu đề bài học'>{thoiKhoaBieu?.tieuDeBaiHoc ?? '--'}</Descriptions.Item>
			{thoiKhoaBieu?.lopHocPhan?.moodleShortname ? (
				<Descriptions.Item label='Lớp học LMS'>
					<a onClick={() => handleMoodle(thoiKhoaBieu.lopHocPhan?._id)}>Đường dẫn</a>
				</Descriptions.Item>
			) : null}
			{thoiKhoaBieu?.lopHocPhan?.lmsUrl ? (
				<Descriptions.Item label='Học trực tuyến'>
					<a href={thoiKhoaBieu?.lopHocPhan?.lmsUrl} target='_blank' rel='noreferrer'>
						Đường dẫn
					</a>
				</Descriptions.Item>
			) : null}
			<Descriptions.Item label='Hình thức giảng dạy'>
				<Tag color={colorHinhThucGiangDay[thoiKhoaBieu?.hinhThucGiangDay as EHinhThucGiangDay]}>
					{thoiKhoaBieu?.hinhThucGiangDay}
				</Tag>
			</Descriptions.Item>
		</>
	);

	const renderLichThi = () => (
		<>
			<Descriptions.Item label='Môn thi'>
				{lichThi?.danhSachHocPhan?.map((item) => `${item.ma} - ${item.ten}`).join(', ')}
			</Descriptions.Item>
			<Descriptions.Item label='Thời gian bắt đầu'>
				{dayjs(lichThi?.thoiGianBatDau).format('HH:mm DD/MM/YYYY')}
			</Descriptions.Item>
			<Descriptions.Item label='Phòng thi'>{lichThi?.phong?.ma ?? '--'}</Descriptions.Item>
			<Descriptions.Item label='Điều kiện dự thi'>
				{lichThi?.trangThai ? <Tag color={colorTrangThaiThi[lichThi.trangThai]}>{lichThi.trangThai}</Tag> : '--'}
			</Descriptions.Item>
		</>
	);

	const renderBaiTap = () => (
		<>
			<Descriptions.Item label='Tên bài tập'>{event?.assignment?.noiDung ?? '--'}</Descriptions.Item>
			<Descriptions.Item label='Lớp học phần'>{event?.assignment?.tenLopHocPhan ?? '--'}</Descriptions.Item>
			<Descriptions.Item label='Giảng viên'>{event?.assignment?.hoTenNguoiGiao ?? '--'}</Descriptions.Item>
			<Descriptions.Item label='Thời gian giao bài tập'>
				{event?.assignment?.createdAt ? dayjs(event?.assignment?.createdAt).format('HH:mm DD/MM/YYYY') : '--'}
			</Descriptions.Item>
			<Descriptions.Item label='Thời hạn bài tập'>
				{event?.assignment?.thoiGianKetThuc
					? dayjs(event?.assignment?.thoiGianKetThuc).format('HH:mm DD/MM/YYYY')
					: '--'}
			</Descriptions.Item>
			<Descriptions.Item label='Trạng thái nộp bài'>
				<Tag color={colorTrangThaiNopBaiTap[event.trangThai as ETrangThaiNopBaiTap]}>
					{mapTrangThaiNopBaiTap[event.trangThai as ETrangThaiNopBaiTap]}
				</Tag>
			</Descriptions.Item>
		</>
	);

	const renderSuKien = () => (
		<>
			<Descriptions.Item label='Tên sự kiện'>{suKien?.tenSuKien}</Descriptions.Item>
			<Descriptions.Item label='Thời gian bắt đầu'>
				{dayjs(suKien?.thoiGianBatDau).format('HH:mm DD/MM/YYYY')}
			</Descriptions.Item>
			<Descriptions.Item label='Thời gian kết thúc'>
				{dayjs(suKien?.thoiGianKetThuc).format('HH:mm DD/MM/YYYY')}
			</Descriptions.Item>
			<Descriptions.Item label='Địa điểm'>{suKien?.diaDiem ?? '--'}</Descriptions.Item>
			<Descriptions.Item label='Ghi chú'>{suKien?.ghiChu ?? '--'}</Descriptions.Item>
		</>
	);

	return (
		<Modal
			open={visible}
			title='Chi tiết lịch'
			destroyOnClose
			width={600}
			onCancel={() => setVisible(false)}
			footer={
				<Space wrap>
					{/* --- Sự kiện cá nhân --- */}
					{suKien && suKien.loaiSuKien === ELoaiSuKien.CA_NHAN ? (
						<>
							<Button
								type='primary'
								onClick={() => {
									handleEdit(suKien);
									setVisible(false);
								}}
								icon={<EditOutlined />}
							>
								Chỉnh sửa
							</Button>
							<Popconfirm
								title='Bạn có chắc chắn muốn xóa sự kiện này không?'
								onConfirm={() => {
									deleteModel(suKien?._id ?? '', getData);
									setVisible(false);
								}}
							>
								<Button danger icon={<DeleteOutlined />}>
									Xóa
								</Button>
							</Popconfirm>
						</>
					) : null}

					{/* --- Lịch học --- */}
					{/* --- Lịch học (Dropdown giống Bài tập) --- */}
					{isThoiKhoaBieu ? (
						<Dropdown.Button
							type='primary'
							trigger={['click']}
							placement='topRight'
							menu={{
								items: [
									{
										key: 'thong-bao',
										label: (
											<span
												onClick={() => history.push(`/hoc-tap/lop-tin-chi/${thoiKhoaBieu?.lopHocPhan?._id}#thong-bao`)}
											>
												Thông báo
											</span>
										),
									},
									{
										key: 'dien-dan',
										label: (
											<span
												onClick={() => history.push(`/hoc-tap/lop-tin-chi/${thoiKhoaBieu?.lopHocPhan?._id}#dien-dan`)}
											>
												Diễn đàn thảo luận
											</span>
										),
									},
									{
										key: 'tai-lieu',
										label: (
											<span
												onClick={() => history.push(`/hoc-tap/lop-tin-chi/${thoiKhoaBieu?.lopHocPhan?._id}#tai-lieu`)}
											>
												Tài liệu học tập
											</span>
										),
									},
									{
										key: 'bai-tap',
										label: (
											<span
												onClick={() => history.push(`/hoc-tap/lop-tin-chi/${thoiKhoaBieu?.lopHocPhan?._id}#bai-tap`)}
											>
												Bài tập
											</span>
										),
									},
								],
							}}
							onClick={() => history.push(`/hoc-tap/lop-tin-chi/${thoiKhoaBieu?.lopHocPhan?._id}`)}
							icon={<DownOutlined />}
						>
							Xem chi tiết
						</Dropdown.Button>
					) : null}

					{/* --- Lịch thi --- */}
					{isLichThi ? (
						<Button type='primary' onClick={() => history.push('/hoc-tap/lich-thi')}>
							Xem lịch thi
						</Button>
					) : null}

					{/* --- Bài tập (Dropdown giống Lịch giảng dạy) --- */}
					{isBaiTap ? (
						<Space>
							<Dropdown.Button
								type='default'
								trigger={['click']}
								placement='topRight'
								menu={{
									items: [
										{
											key: 'thong-bao',
											label: (
												<span
													onClick={() =>
														history.push(`/hoc-tap/lop-tin-chi/${event?.assignment?.lopHocPhanId}#thong-bao`)
													}
												>
													Thông báo
												</span>
											),
										},
										{
											key: 'dien-dan',
											label: (
												<span
													onClick={() =>
														history.push(`/hoc-tap/lop-tin-chi/${event?.assignment?.lopHocPhanId}#dien-dan`)
													}
												>
													Diễn đàn thảo luận
												</span>
											),
										},
										{
											key: 'bai-tap',
											label: (
												<span
													onClick={() =>
														history.push(
															`/hoc-tap/lop-tin-chi/${event?.assignment?.lopHocPhanId}?idBaiTap=${event?.assignment?._id}#bai-tap`,
														)
													}
												>
													Bài tập
												</span>
											),
										},
									],
								}}
								onClick={() =>
									history.push(
										`/hoc-tap/lop-tin-chi/${event?.assignment?.lopHocPhanId}?idBaiTap=${event?.assignment?._id}#bai-tap`,
									)
								}
								icon={<DownOutlined />}
							>
								Xem chi tiết
							</Dropdown.Button>

							<Button
								type='primary'
								onClick={() =>
									history.push(
										`/hoc-tap/lop-tin-chi/${event?.assignment?.lopHocPhanId}?idBaiTap=${event?.assignment?._id}#nop-bai`,
									)
								}
							>
								Nộp bài
							</Button>
						</Space>
					) : null}

					<Button onClick={() => setVisible(false)}>Đóng</Button>
				</Space>
			}
		>
			<Descriptions column={1}>
				<Descriptions.Item label='Loại sự kiện'>
					{loaiSuKien ? <Tag color={getColorSuKien(loaiSuKien)}>{loaiSuKien}</Tag> : '--'}
				</Descriptions.Item>

				{isThoiKhoaBieu
					? renderThoiKhoaBieu()
					: isLichThi
						? renderLichThi()
						: isBaiTap
							? renderBaiTap()
							: renderSuKien()}
			</Descriptions>
		</Modal>
	);
};

export default ModalViewDetailCalendar;
