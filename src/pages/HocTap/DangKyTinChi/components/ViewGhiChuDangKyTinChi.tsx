import { EColorLopDangKy } from '@/services/DaoTao/DangKyTinChi/constant';
import { Space } from 'antd';

const ViewGhiChuDangKyTinChi = () => {
	return (
		<div style={{ maxWidth: 500 }}>
			Bước 1: Chọn Loại học phần
			<br />
			Bước 2: Tương ứng với loại đã chọn, chọn Học phần cần đăng ký
			<br />
			Bước 3: Tích chọn Lớp tín chỉ mong muốn (
			<i>chỉ có thể chọn những lớp thuộc học phần chưa được đăng ký, không trùng lịch học và còn trống</i>
			)
			<br />
			Bước 4: Xem lại danh sách và ấn nút <b>Đăng ký</b>
			<br />
			Xem video hướng dẫn{' '}
			<a href='https://www.youtube.com/watch?v=2xghlws7tAk' target='_blank' rel='noreferrer'>
				tại đây
			</a>
			<br />
			<br />
			<u>Ghi chú:</u>
			<br />
			<div style={{ display: 'flex', flexDirection: 'column' }}>
				<Space style={{ marginTop: 5 }}>
					<span className='dang-ky-ghi-chu selected' />
					Lớp đã đăng ký / đã chọn
				</Space>
				<Space style={{ marginTop: 5 }}>
					<span className='dang-ky-ghi-chu' style={{ backgroundColor: EColorLopDangKy.TRUNG_LICH }} />
					Lớp bị trùng lịch học
				</Space>
				<Space style={{ marginTop: 5 }}>
					<span className='dang-ky-ghi-chu' style={{ backgroundColor: EColorLopDangKy.FULL_LOP }} />
					Lớp không còn chỗ trống
				</Space>
				<Space style={{ marginTop: 5 }}>
					<span className='fw500'>Chữ đậm</span>
					Lớp gợi ý theo kế hoạch giảng dạy
				</Space>
			</div>
		</div>
	);
};

export default ViewGhiChuDangKyTinChi;
