import { formatDate } from '@/utils/formatDate';
import { Button, Col, Descriptions, Divider, Image, Row } from 'antd';
import { useModel } from 'umi';

const ModalChiTiet = () => {
	const { record, setVisibleForm } = useModel('noingoaitru.khaibao');

	return (
		<>
			<Divider orientation='left' orientationMargin='0' style={{ marginTop: -10 }}>
				Thông tin sinh viên
			</Divider>
			<Row gutter={16}>
				<Col span={6}>
					<Image src={record?.urlAnhThe} height={200} />
				</Col>
				<Col span={18}>
					<Descriptions labelStyle={{ fontWeight: 'bold' }} column={2}>
						<Descriptions.Item label='Họ tên'>
							{record?.thongTinSinhVien?.hoTen ?? <i style={{ color: '#858704' }}>Chưa khai báo</i>}
						</Descriptions.Item>
						<Descriptions.Item label='Mã sinh viên'>
							{record?.thongTinSinhVien?.maSinhVien ?? <i style={{ color: '#858704' }}>Chưa khai báo</i>}
						</Descriptions.Item>
						<Descriptions.Item label='Ngày sinh'>
							{record?.thongTinSinhVien?.ngaySinh ? formatDate(record?.thongTinSinhVien?.ngaySinh) : '--'}
						</Descriptions.Item>
						<Descriptions.Item label='Giới tính'>
							{record?.thongTinSinhVien?.gioiTinh ?? <i style={{ color: '#858704' }}>Chưa khai báo</i>}
						</Descriptions.Item>
						<Descriptions.Item label='Số điện thoại'>
							{record?.thongTinSinhVien?.soDienThoai ?? <i style={{ color: '#858704' }}>Chưa khai báo</i>}
						</Descriptions.Item>
						<Descriptions.Item label='Căn cước công dân'>
							{record?.thongTinSinhVien?.cmtCccd ?? <i style={{ color: '#858704' }}>Chưa khai báo</i>}
						</Descriptions.Item>
						<Descriptions.Item label='Khoa/Viện'>
							{record?.thongTinSinhVien?.khoaVien ?? <i style={{ color: '#858704' }}>Chưa khai báo</i>}
						</Descriptions.Item>
						<Descriptions.Item label='Khóa sinh viên'>
							{record?.thongTinSinhVien?.tenKhoaSinhVien ?? <i style={{ color: '#858704' }}>Chưa khai báo</i>}
						</Descriptions.Item>
						<Descriptions.Item label='Lớp hành chính' span={24}>
							{record?.thongTinSinhVien?.tenLopHanhChinh ?? <i style={{ color: '#858704' }}>Chưa khai báo</i>}
						</Descriptions.Item>
						{/* <Descriptions.Item label='Quê quán' span={24}>
							{record?.thongTinSinhVien?.queQuan ? (
								<>
									{record?.thongTinSinhVien?.queQuan?.soNhaTenDuong} - {record?.thongTinSinhVien?.queQuan?.tenPhuongXa}{' '}
									- {record?.thongTinSinhVien?.queQuan?.tenQuanHuyen} - {record?.thongTinSinhVien?.queQuan?.tenTinh}
								</>
							) : (
								<i style={{ color: '#858704' }}>Chưa khai báo</i>
							)}
						</Descriptions.Item> */}
						<Descriptions.Item label='Hộ khẩu thường trú' span={24}>
							{record?.thongTinSinhVien?.hoKhauThuongTru ? (
								<>
									{record?.thongTinSinhVien?.hoKhauThuongTru?.soNhaTenDuong} -{' '}
									{record?.thongTinSinhVien?.hoKhauThuongTru?.tenPhuongXa} -{' '}
									{record?.thongTinSinhVien?.hoKhauThuongTru?.tenQuanHuyen} -{' '}
									{record?.thongTinSinhVien?.hoKhauThuongTru?.tenTinh}
								</>
							) : (
								<i style={{ color: '#858704' }}>Chưa khai báo</i>
							)}
						</Descriptions.Item>
						{record?.dangONoiTru ? (
							<>
								<Descriptions.Item label='Nơi ở nội trú' span={24}>
									{record?.noiONoiTru ?? <i style={{ color: '#858704' }}>Chưa khai báo</i>}
								</Descriptions.Item>
							</>
						) : (
							<>
								<Descriptions.Item label='Nơi ở ngoại trú' span={24}>
									{record?.noiONgoaiTru ? (
										<>
											{record?.noiONgoaiTru?.soNhaTenDuong} - {record?.noiONgoaiTru?.tenPhuongXa} -{' '}
											{record?.noiONgoaiTru?.tenQuanHuyen} - {record?.noiONgoaiTru?.tenTinh}
										</>
									) : (
										<i style={{ color: '#858704' }}>Chưa khai báo</i>
									)}
								</Descriptions.Item>
							</>
						)}
					</Descriptions>
				</Col>
			</Row>

			<Divider orientation='left' orientationMargin='0'>
				Thông tin người thân
			</Divider>
			<Descriptions labelStyle={{ fontWeight: 'bold' }} column={2}>
				<Descriptions.Item label='Họ tên'>
					{record?.thongTinNguoiThan?.hoTen ?? <i style={{ color: '#858704' }}>Chưa khai báo</i>}
				</Descriptions.Item>
				<Descriptions.Item label='Ngày sinh'>{formatDate(record?.thongTinNguoiThan?.namSinh)}</Descriptions.Item>
				<Descriptions.Item label='Số điện thoại'>
					{record?.thongTinNguoiThan?.soDienThoai ?? <i style={{ color: '#858704' }}>Chưa khai báo</i>}
				</Descriptions.Item>
				<Descriptions.Item label='Địa chỉ'>
					{record?.thongTinNguoiThan?.diaChiThuongTru ? (
						<>
							{record?.thongTinNguoiThan?.diaChiThuongTru?.soNhaTenDuong} -{' '}
							{record?.thongTinNguoiThan?.diaChiThuongTru?.tenPhuongXa} -{' '}
							{record?.thongTinNguoiThan?.diaChiThuongTru?.tenQuanHuyen} -{' '}
							{record?.thongTinNguoiThan?.diaChiThuongTru?.tenTinh}
						</>
					) : (
						<i style={{ color: '#858704' }}>Chưa khai báo</i>
					)}
				</Descriptions.Item>
				<Descriptions.Item label='Nghề nghiệp'>
					{record?.thongTinNguoiThan?.ngheNghiep ?? <i style={{ color: '#858704' }}>Chưa khai báo</i>}
				</Descriptions.Item>
				<Descriptions.Item label='Nơi làm việc'>
					{record?.thongTinNguoiThan?.noiLamViec ?? <i style={{ color: '#858704' }}>Chưa khai báo</i>}
				</Descriptions.Item>
			</Descriptions>

			<div className='form-footer'>
				<Button onClick={() => setVisibleForm(false)}>Đóng</Button>
			</div>
		</>
	);
};

export default ModalChiTiet;
