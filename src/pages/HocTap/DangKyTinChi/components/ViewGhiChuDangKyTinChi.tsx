import { EColorLopDangKy } from '@/services/DaoTao/DangKyTinChi/constant';
import { formatDate } from '@/utils/formatDate';
import { Col, Divider, Modal, Row, Space, Tag } from 'antd';
import { useIntl, useModel } from 'umi';

const ViewGhiChuDangKyTinChi = (props: { visible: boolean; setVisible: (val: boolean) => void }) => {
	const { visible, setVisible } = props;
	const intl = useIntl();
	const { record: recHocKy } = useModel('daotao.hocky');
	const { dotDangKyHienTai } = useModel('daotao.dotdangkytinchi');

	return (
		<Modal title={'Thông tin Đăng ký'} open={visible} footer={null} onCancel={() => setVisible(false)} width={800}>
			<Row gutter={[12, 12]}>
				<Col span={24}>
					<Divider className='divider-big-title' orientation='left' style={{ marginTop: 0, marginBottom: 8 }}>
						Chi tiết kỳ
					</Divider>
				</Col>
				<Col span={24}>
					<div>
						<strong>Tên học kỳ</strong>: {recHocKy?.ten}
					</div>
					<div style={{ marginTop: 8 }}>
						<strong>Số tuần học</strong>: {recHocKy?.soTuan}
					</div>
					<div style={{ marginTop: 8 }}>
						<strong>Thời gian bắt đầu học kỳ</strong>:{' '}
						{recHocKy?.thoiGianBatDau ? formatDate(recHocKy.thoiGianBatDau) : null}
					</div>
					{dotDangKyHienTai && (
						<div style={{ marginTop: 8 }}>
							<strong>Tên đợt đăng ký tín chỉ</strong>: {dotDangKyHienTai.ten}
						</div>
					)}
				</Col>

				<Col span={24}>
					<Divider className='divider-big-title' orientation='left' style={{ marginTop: 8, marginBottom: 8 }}>
						Thông tin bổ sung
					</Divider>
				</Col>
				<Col span={24}>
					<div>
						<strong>Lớp theo kế hoạch giảng dạy</strong>: chỉ hiển thị các học phần theo chương trình khung của sinh
						viên, do thiết kế chương trình hoặc chương trình sv tự thiết kế. Xem chi tiết{' '}
						<a href='#' style={{ color: '#d32f2f', textDecoration: 'underline' }}>
							tại đây
						</a>
						.
					</div>
					<div style={{ marginTop: 8 }}>
						<strong>Toàn bộ học phần</strong>: toàn bộ học phần mà trường có tổ chức mở lớp trong học kỳ.
					</div>
				</Col>

				<Col span={24}>
					<Divider className='divider-big-title' orientation='left' style={{ marginTop: 8, marginBottom: 8 }}>
						Hướng dẫn đăng ký
					</Divider>
				</Col>
				<Col span={24}>
					<div>
						<strong>Bước 1:</strong> Chọn Loại học phần
					</div>
					<div>
						<strong>Bước 2:</strong> Tương ứng với loại đã chọn, chọn Học phần cần đăng ký
					</div>
					<div>
						<strong>Bước 3:</strong> Kiểm tra và chọn Lớp tín chỉ mong muốn (chỉ có thể chọn những lớp thuộc học phần
						chưa được đăng ký, không trùng lịch học và còn trống)
					</div>
					<div>
						<strong>Bước 4:</strong> Bấm nút <span style={{ color: '#1890ff', fontWeight: 'bold' }}>ĐĂNG KÝ</span> để
						đối với từng học phần.
					</div>

					<div style={{ marginTop: 16, color: '#666' }}>Lưu ý:</div>
					<div style={{ display: 'flex', flexDirection: 'column' }}>
						<Space style={{ marginTop: 5 }}>
							<span className='dang-ky-ghi-chu selected' />
							{intl.formatMessage({ id: 'dangkytinchi.ghichudangkytinchi.description.lopdadangky' })}
						</Space>
						<Space style={{ marginTop: 5 }}>
							<span className='dang-ky-ghi-chu' style={{ backgroundColor: EColorLopDangKy.TRUNG_LICH }} />
							{intl.formatMessage({ id: 'dangkytinchi.ghichudangkytinchi.description.lopbitrunglichhoc' })}
						</Space>
						<Space style={{ marginTop: 5 }}>
							<span className='dang-ky-ghi-chu' style={{ backgroundColor: EColorLopDangKy.FULL_LOP }} />
							{intl.formatMessage({ id: 'dangkytinchi.ghichudangkytinchi.description.lopkhongconchotrong' })}
						</Space>
					</div>

					<div style={{ display: 'flex', alignItems: 'flex-start', marginTop: 12 }}>
						<Tag color={'orange'}>Trong danh sách chờ</Tag>
						<div style={{ flex: 1, paddingLeft: 12, lineHeight: '1.5' }}>
							Lớp học phần vẫn tính vào số tín chỉ, lịch học dự kiến của bạn tuy nhiên bạn chưa chính thức ở trong lớp,
							bạn chỉ là chính thức khi có sinh viên khác rút khỏi lớp hoặc giảng viên chủ động thêm bạn vào lớp.
						</div>
					</div>
				</Col>
			</Row>
		</Modal>
	);
};

export default ViewGhiChuDangKyTinChi;
