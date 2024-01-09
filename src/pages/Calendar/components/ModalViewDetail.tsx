import { type ThoiKhoaBieu } from '@/services/DaoTao/ThoiKhoaBieu/typing';
import { ColorSuKien, ELoaiSuKien } from '@/services/SuKien/constant';
import { type SuKien } from '@/services/SuKien/typings';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Descriptions, Modal, Popconfirm, Space, Tag, message } from 'antd';
import moment from 'moment';
import { history, useModel } from 'umi';

const ModalViewDetailCalendar = (props: { visible: boolean; setVisible: any; event: any; getData: () => void }) => {
	const { visible, setVisible, event, getData } = props;
	const { deleteModel, handleEdit } = useModel('sukien');
	const { getMoodleLopHocPhanModel } = useModel('daotao.lophocphan');
	const loaiSuKien = event.loaiSuKien as ELoaiSuKien;
	const isThoiKhoaBieu = loaiSuKien === ELoaiSuKien.LICH_HOC;
	const thoiKhoaBieu = isThoiKhoaBieu ? (event as ThoiKhoaBieu.IRecord) : undefined;
	const suKien = !isThoiKhoaBieu ? (event as SuKien.IRecord) : undefined;

	const handleMoodle = (lopHocPhanId?: string) => {
		if (lopHocPhanId)
			getMoodleLopHocPhanModel(lopHocPhanId).then((data) => {
				if (data?.url) window.open(`${data.url}`);
				else message.error('Có lỗi, vui lòng thử lại sau');
			});
	};

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
					) : null}
					<Button onClick={() => setVisible(false)}>Đóng</Button>
				</Space>
			}
		>
			<Descriptions column={1}>
				<Descriptions.Item label='Loại sự kiện'>
					{loaiSuKien ? <Tag color={ColorSuKien[loaiSuKien]}>{loaiSuKien}</Tag> : '--'}
				</Descriptions.Item>
				{isThoiKhoaBieu ? (
					<>
						<Descriptions.Item label='Lớp tín chỉ'>{thoiKhoaBieu?.tenLopHocPhan}</Descriptions.Item>
						<Descriptions.Item label='Tên học phần'>{thoiKhoaBieu?.lopHocPhan?.hocPhan?.ten}</Descriptions.Item>
						<Descriptions.Item label='Thời gian bắt đầu'>
							{moment(thoiKhoaBieu?.thoiGianBatDau).format('HH:mm DD/MM/YYYY')}
						</Descriptions.Item>
						<Descriptions.Item label='Thời gian kết thúc'>
							{moment(thoiKhoaBieu?.thoiGianKetThuc).format('HH:mm DD/MM/YYYY')}
						</Descriptions.Item>
						<Descriptions.Item label='Loại hình học tập'>{thoiKhoaBieu?.loaiHinhHocTap ?? '--'}</Descriptions.Item>
						<Descriptions.Item label='Phòng học'>{thoiKhoaBieu?.phongHoc ?? '--'}</Descriptions.Item>
						<Descriptions.Item label='Giảng viên'>
							{thoiKhoaBieu?.nhanSu?.ten
								? [thoiKhoaBieu.nhanSu?.hoDem, thoiKhoaBieu.nhanSu?.ten].join(' ')
								: thoiKhoaBieu?.tenNhanSu ?? '--'}
						</Descriptions.Item>
						<Descriptions.Item label='Tiêu đề bài học'>{thoiKhoaBieu?.tieuDeBaiHoc ?? '--'}</Descriptions.Item>
						{thoiKhoaBieu?.lopHocPhan?.moodleShortname ? (
							<Descriptions.Item label='Lớp học trực tuyến'>
								<a href='#!' onClick={() => handleMoodle(thoiKhoaBieu.lopHocPhan?._id)}>
									Đường dẫn
								</a>
							</Descriptions.Item>
						) : null}
					</>
				) : (
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
				)}
			</Descriptions>
		</Modal>
	);
};

export default ModalViewDetailCalendar;
