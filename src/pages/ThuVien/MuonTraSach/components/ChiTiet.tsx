import {
	colorTrangThaiDuyeMuonSach,
	colorTrangThaiMuonSach,
	type ETrangThaiDuyetMuonSach,
	type ETrangThaiMuonSach,
} from '@/services/QuanLyThuVien/constant';
import { formatDate } from '@/utils/formatDate';
import { Button, Card, Col, Descriptions, Row, Tag } from 'antd';
import { useModel } from 'umi';

const ChiTietMuonTraSach = () => {
	const { record, setVisibleForm } = useModel('thuvien.muonsach');

	return (
		<Card title='Chi tiết sinh viên mượn sách'>
			<Row gutter={[12, 0]}>
				<Col xs={24}>
					<Descriptions column={1}>
						<Descriptions.Item label='Mã sinh viên'>
							{record?.phieuMuonTra?.maDinhDanhNguoiMuon ?? '--'}
						</Descriptions.Item>
						<Descriptions.Item label='Họ tên'>{record?.phieuMuonTra?.hoTenNguoiMuon ?? '--'}</Descriptions.Item>

						<Descriptions.Item label='Nhan đề'>{record?.anPham?.nhanDe ?? '--'}</Descriptions.Item>
						<Descriptions.Item label='Tác giả'>{record?.anPham?.tacGia ?? '--'}</Descriptions.Item>

						{/* {trangThai !== ETrangThaiMuonSach.CHO_XU_LY && (
							<> */}
						<Descriptions.Item label='Đăng ký cá biệt'>{record?.soDangKyCaBiet ?? '--'}</Descriptions.Item>
						<Descriptions.Item label='Thời gian mượn'>
							{record?.thoiGianMuon ? formatDate(record?.thoiGianMuon) : '--'}
						</Descriptions.Item>
						<Descriptions.Item label='Hạn trả'>
							{record?.expired ? formatDate(record?.expired) : '--'}
						</Descriptions.Item>

						{/* <Descriptions.Item label='Trạng thái'>
							{record?.daLaySach ? <Tag color='green'>Đã lấy</Tag> : <Tag color='red'>Chưa lấy</Tag>}
						</Descriptions.Item>

						<Descriptions.Item label='Gia hạn'>
							{record?.giaHan ? <Tag color='green'>Có gian hạn</Tag> : <Tag color='red'>Không gia hạn</Tag>}
						</Descriptions.Item> */}

						<Descriptions.Item label='Thời gian gia hạn'>
							{record?.thoiGianGiaHan ? formatDate(record?.thoiGianGiaHan) : '--'}
						</Descriptions.Item>

						<Descriptions.Item label='Thời gian trả'>
							{record?.thoiGianTra ? formatDate(record?.thoiGianTra) : '--'}
						</Descriptions.Item>
						{/* </>
						)} */}
						<Descriptions.Item label='Thời gian đăng ký'>
							{record?.phieuMuonTra?.thoiGianDangKy
								? formatDate(record?.phieuMuonTra?.thoiGianDangKy)
								: '--'}
						</Descriptions.Item>
						{/* <Descriptions.Item label='Thời gian dự kiến mượn'>
							{record?.thoiGianMuonDuKien ? formatDate(record?.thoiGianMuonDuKien) : '--'}
						</Descriptions.Item>
						<Descriptions.Item label='Thời gian dự kiến trả'>
							{record?.thoiGianTraDuKien ? formatDate(record?.thoiGianTraDuKien) : '--'}
						</Descriptions.Item> */}

						<Descriptions.Item label='Ghi chú đăng ký'>{record?.ghiChuDangKy ?? '--'}</Descriptions.Item>

						{/* {trangThai !== ETrangThaiMuonSach.CHO_XU_LY && (
							<> */}
						<Descriptions.Item label='Ghi chú'>{record?.ghiChu ?? '--'}</Descriptions.Item>
						<Descriptions.Item label='Ghi chú trả'>{record?.ghiChuTra ?? '--'}</Descriptions.Item>
						{/* </>
						)} */}

						<Descriptions.Item label='Trạng thái'>
							<Tag color={colorTrangThaiMuonSach[record?.trangThai as ETrangThaiMuonSach]}>{record?.trangThai}</Tag>
						</Descriptions.Item>

						<Descriptions.Item label='Trạng thái duyệt'>
							<Tag color={colorTrangThaiDuyeMuonSach[record?.phieuMuonTra?.trangThaiDuyet as ETrangThaiDuyetMuonSach]}>
								{record?.phieuMuonTra?.trangThaiDuyet}
							</Tag>
						</Descriptions.Item>
					</Descriptions>
				</Col>
			</Row>

			<div className='form-footer'>
				<Button onClick={() => setVisibleForm(false)}>Đóng</Button>
			</div>
		</Card>
	);
};

export default ChiTietMuonTraSach;
