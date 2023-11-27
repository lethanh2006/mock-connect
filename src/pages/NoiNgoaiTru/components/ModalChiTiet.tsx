import { Col, Descriptions, Divider, Image, Modal, Row } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';

const ModalChiTiet = (props: { visibleForm: boolean; setVisibleForm: (val: boolean) => void }) => {
	const { visibleForm, setVisibleForm } = props;
	const { record } = useModel('noingoaitru.khaibao');

	return (
		<Modal
			visible={visibleForm}
			onCancel={() => setVisibleForm(false)}
			footer={null}
			width={1000}
			title='Thông tin khai báo nội trú, ngoại trú'
		>
			<Divider orientation='left' orientationMargin='0' style={{ marginTop: -10 }}>
				Thông tin sinh viên
			</Divider>
			<Row gutter={16}>
				<Col span={6}>
					<Image src={record?.urlAnhThe} height={200} />
				</Col>
				<Col span={18}>
					<Descriptions labelStyle={{ fontWeight: 'bold' }} column={2}>
						<Descriptions.Item label='Họ tên'>{record?.thongTinSinhVien?.hoTen ?? 'Chưa khai báo'}</Descriptions.Item>
						<Descriptions.Item label='Mã sinh viên'>
							{record?.thongTinSinhVien?.maSinhVien ?? 'Chưa khai báo'}
						</Descriptions.Item>
						<Descriptions.Item label='Ngày sinh'>
							{record?.thongTinSinhVien?.ngaySinh
								? moment(record?.thongTinSinhVien?.ngaySinh).format('DD/MM/YYYY')
								: 'Chưa khai báo'}
						</Descriptions.Item>
						<Descriptions.Item label='Giới tính'>
							{record?.thongTinSinhVien?.gioiTinh ?? 'Chưa khai báo'}
						</Descriptions.Item>
						<Descriptions.Item label='Số điện thoại'>
							{record?.thongTinSinhVien?.soDienThoai ?? 'Chưa khai báo'}
						</Descriptions.Item>
						<Descriptions.Item label='Căn cước công dân'>
							{record?.thongTinSinhVien?.cmtCccd ?? 'Chưa khai báo'}
						</Descriptions.Item>
						<Descriptions.Item label='Quê quán' span={24}>
							{record?.thongTinSinhVien?.queQuan ? (
								<>
									{record?.thongTinSinhVien?.queQuan?.soNhaTenDuong} - {record?.thongTinSinhVien?.queQuan?.tenPhuongXa}{' '}
									- {record?.thongTinSinhVien?.queQuan?.tenQuanHuyen} - {record?.thongTinSinhVien?.queQuan?.tenTinh}
								</>
							) : (
								'Chưa khai báo'
							)}
						</Descriptions.Item>
						<Descriptions.Item label='Hộ khẩu thường trú' span={24}>
							{record?.thongTinSinhVien?.hoKhauThuongTru ? (
								<>
									{record?.thongTinSinhVien?.hoKhauThuongTru?.soNhaTenDuong} -{' '}
									{record?.thongTinSinhVien?.hoKhauThuongTru?.tenPhuongXa} -{' '}
									{record?.thongTinSinhVien?.hoKhauThuongTru?.tenQuanHuyen} -{' '}
									{record?.thongTinSinhVien?.hoKhauThuongTru?.tenTinh}
								</>
							) : (
								'Chưa khai báo'
							)}
						</Descriptions.Item>
						{record?.dangONoiTru ? (
							<>
								<Descriptions.Item label='Nơi ở nội trú' span={24}>
									{record?.noiONoiTru ?? 'Chưa khai báo'}
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
										'Chưa khai báo'
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
				<Descriptions.Item label='Họ tên'>{record?.thongTinNguoiThan?.hoTen ?? 'Chưa khai báo'}</Descriptions.Item>
				<Descriptions.Item label='Ngày sinh'>
					{record?.thongTinNguoiThan?.namSinh
						? moment(record?.thongTinNguoiThan?.namSinh).format('DD/MM/YYYY')
						: 'Chưa khai báo'}
				</Descriptions.Item>
				<Descriptions.Item label='Số điện thoại'>
					{record?.thongTinNguoiThan?.soDienThoai ?? 'Chưa khai báo'}
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
						'Chưa khai báo'
					)}
				</Descriptions.Item>
				<Descriptions.Item label='Nghề nghiệp'>
					{record?.thongTinNguoiThan?.ngheNghiep ?? 'Chưa khai báo'}
				</Descriptions.Item>
				<Descriptions.Item label='Nơi làm việc'>
					{record?.thongTinNguoiThan?.noiLamViec ?? 'Chưa khai báo'}
				</Descriptions.Item>
			</Descriptions>
		</Modal>
	);
};
export default ModalChiTiet;
