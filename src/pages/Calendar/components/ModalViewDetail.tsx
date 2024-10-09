import {
	colorTrangThaiNopBaiTap,
	type ETrangThaiNopBaiTap,
	mapTrangThaiNopBaiTap,
} from '@/services/DaoTao/BaiTap/constants';
import { type ThoiKhoaBieu } from '@/services/DaoTao/ThoiKhoaBieu/typing';
import type { LichThi } from '@/services/KhaoThi/LichThi/typing';
import { colorTrangThaiThi } from '@/services/KhaoThi/constant';
import { ColorSuKien, ELoaiSuKien } from '@/services/SuKien/constant';
import { type SuKien } from '@/services/SuKien/typings';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Descriptions, Modal, Popconfirm, Space, Tag, message } from 'antd';
import moment from 'moment';
import { history, useModel } from 'umi';

const ModalViewDetailCalendar = (props: { visible: boolean; setVisible: any; event: any; getData: () => void }) => {
	const { visible, setVisible, event, getData } = props;
	const { deleteModel, handleEdit } = useModel('sukien');
	const { getMoodleLopHocPhanModel } = useModel('lophocphan.lophocphan');
	const { record: recSetting } = useModel('settinglich');
	const loaiSuKien = event.loaiSuKien as ELoaiSuKien;
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

	const renderThoiKhoaBieu = () => (
		<>
			<Descriptions.Item label='Lớp tín chỉ'>{thoiKhoaBieu?.tenLopHocPhan}</Descriptions.Item>
			<Descriptions.Item label='Tên học phần'>{thoiKhoaBieu?.lopHocPhan?.hocPhan?.ten}</Descriptions.Item>
			<Descriptions.Item label='Thời gian bắt đầu'>
				{moment(thoiKhoaBieu?.thoiGianBatDau).format('HH:mm DD/MM/YYYY')}
			</Descriptions.Item>
			<Descriptions.Item label='Thời gian kết thúc'>
				{moment(thoiKhoaBieu?.thoiGianKetThuc).format('HH:mm DD/MM/YYYY')}
			</Descriptions.Item>
			{/* <Descriptions.Item label='Loại hình học tập'>{thoiKhoaBieu?.loaiHinhHocTap ?? '--'}</Descriptions.Item> */}
			<Descriptions.Item label='Phòng học'>{thoiKhoaBieu?.phongHoc ?? '--'}</Descriptions.Item>
			<Descriptions.Item label='Giảng viên'>
				{thoiKhoaBieu?.giangVien?.ten
					? [thoiKhoaBieu.giangVien?.hoDem, thoiKhoaBieu.giangVien?.ten].join(' ')
					: thoiKhoaBieu?.tenNhanSu ?? '--'}
			</Descriptions.Item>
			<Descriptions.Item label='Tiêu đề bài học'>{thoiKhoaBieu?.tieuDeBaiHoc ?? '--'}</Descriptions.Item>
			{thoiKhoaBieu?.lopHocPhan?.moodleShortname ? (
				<Descriptions.Item label='Lớp học LMS'>
					<a href='#!' onClick={() => handleMoodle(thoiKhoaBieu.lopHocPhan?._id)}>
						Đường dẫn
					</a>
				</Descriptions.Item>
			) : null}
			{thoiKhoaBieu?.lopHocPhan?.lmsUrl ? (
				<Descriptions.Item label='Học trực tuyến'>
					<a href={thoiKhoaBieu?.lopHocPhan?.lmsUrl} target='_blank' rel='noreferrer'>
						Đường dẫn
					</a>
				</Descriptions.Item>
			) : null}
		</>
	);

	const renderLichThi = () => (
		<>
			<Descriptions.Item label='Môn thi'>
				{lichThi?.danhSachHocPhan?.map((item) => `${item.ma} - ${item.ten}`).join(', ')}
			</Descriptions.Item>
			<Descriptions.Item label='Thời gian bắt đầu'>
				{moment(lichThi?.thoiGianBatDau).format('HH:mm DD/MM/YYYY')}
			</Descriptions.Item>
			<Descriptions.Item label='Thời gian kết thúc'>
				{moment(lichThi?.thoiGianKetThuc).format('HH:mm DD/MM/YYYY')}
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
				{event?.assignment?.createdAt ? moment(event?.assignment?.createdAt).format('HH:mm DD/MM/YYYY') : '--'}
			</Descriptions.Item>
			<Descriptions.Item label='Thời hạn bài tập'>
				{event?.assignment?.thoiGianKetThuc
					? moment(event?.assignment?.thoiGianKetThuc).format('HH:mm DD/MM/YYYY')
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
				{moment(suKien?.thoiGianBatDau).format('HH:mm DD/MM/YYYY')}
			</Descriptions.Item>
			<Descriptions.Item label='Thời gian kết thúc'>
				{moment(suKien?.thoiGianKetThuc).format('HH:mm DD/MM/YYYY')}
			</Descriptions.Item>
			<Descriptions.Item label='Địa điểm'>{suKien?.diaDiem ?? '--'}</Descriptions.Item>
			<Descriptions.Item label='Ghi chú'>{suKien?.ghiChu ?? '--'}</Descriptions.Item>
		</>
	);

	return (
		<Modal
			visible={visible}
			title='Chi tiết lịch'
			destroyOnClose
			width={600}
			onCancel={() => setVisible(false)}
			footer={
				<Space wrap>
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
					{isThoiKhoaBieu ? (
						<Button
							type='primary'
							onClick={() => history.push(`/hoc-tap/lop-tin-chi/${thoiKhoaBieu?.lopHocPhan?._id}`)}
						>
							Xem chi tiết
						</Button>
					) : isLichThi ? (
						<Button type='primary' onClick={() => history.push('/hoc-tap/lich-thi')}>
							Xem lịch thi
						</Button>
					) : isBaiTap ? (
						<Button
							type='primary'
							onClick={() => history.push(`/hoc-tap/lop-tin-chi/${event?.assignment?.lopHocPhanId}#bai-tap`)}
						>
							Xem chi tiết
						</Button>
					) : null}
					<Button onClick={() => setVisible(false)}>Đóng</Button>
				</Space>
			}
		>
			<Descriptions column={1}>
				<Descriptions.Item label='Loại sự kiện'>
					{loaiSuKien ? (
						<Tag
							color={
								recSetting?.danhSachSettingLich?.find((item) => item?.loaiLich === event?.loaiSuKien)?.maMau ??
								ColorSuKien?.[event?.loaiSuKien as ELoaiSuKien]
							}
						>
							{loaiSuKien}
						</Tag>
					) : (
						'--'
					)}
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
