import FilterHocKy from '@/pages/DaoTao/HocKy/FilterHocKy';
import FilterLopHocPhan from '@/pages/DaoTao/LopHocPhan/FilterLopHocPhan';
import { primaryColor } from '@/services/base/constant';
import { ToChucNhanSu } from '@/services/ToChucNhanSu/typing';
import dayjs from '@/utils/dayjs';
import { ArrowLeftOutlined, InfoCircleOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, Row, Space, Spin, Tag, Tooltip, Typography } from 'antd';
import { useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Link, useModel, useNavigate } from 'umi';
import ModalThongTinGiangVien from './ModalGiangVien';
import './style.less';
const { Title, Text } = Typography;

const ThongTinChungHeaderCard = (props: { onShowDeCuong: () => void }) => {
	const { loading, record } = useModel('lophocphan.lophocphan');
	const [selectedGiangVien, setSelectedGiangVien] = useState<ToChucNhanSu.INhanSu>();
	const [visibleGvDetailModal, setVisibleGvDetailModal] = useState(false);
	const backgroundRef = useRef(Math.floor(Math.random() * 6));
	const randomBackground = `/images/isolation-mode-${backgroundRef.current}.svg`;
	const navigate = useNavigate();
	const visibleFilter = useMediaQuery({ query: '(max-width: 1200px)' });
	const [showFilterHocKy, setShowFilterHocKy] = useState(false);

	let allThoiKhoaBieu = record?.thoiKhoaBieuList ?? [];
	allThoiKhoaBieu = allThoiKhoaBieu.concat(record?.children?.flatMap((child) => child.thoiKhoaBieuList ?? []) ?? []);
	const past = allThoiKhoaBieu.filter((i) => dayjs().isAfter(dayjs(i?.ngay))).length;
	const progress = Math.round((past / allThoiKhoaBieu.length) * 100) || 0;

	const isCompleted = progress === 100 || record?.diem?.diemHpSvHk?.diemKthp;

	return (
		<div>
			<Spin spinning={loading}>
				<div
					style={{
						padding: '20px 20px',
						backgroundColor: 'var(--color-primary-bg)',
						margin: '-24px -12px 0', // để phần Header này theo đúng thiết kế (sát vào lề)
						backgroundImage: `url(${randomBackground})`,
						backgroundSize: 'contain',
						backgroundRepeat: 'no-repeat',
						backgroundPosition: 'right center',
					}}
				>
					<Card
						className='card-big-title card-borderless'
						variant='borderless'
						title={
							<>
								{/* Header Title */}
								<div
									style={{
										marginBottom: '16px',
										display: 'flex',
										flexDirection: 'row',
										alignItems: 'baseline',
										gap: '16px',
									}}
								>
									<div
										style={{
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											cursor: 'pointer',
										}}
										onClick={() => navigate('/hoc-tap/lop-tin-chi')}
									>
										<Tooltip title='Quay lại'>
											<ArrowLeftOutlined style={{ color: '#333', fontSize: 14 }} />
										</Tooltip>
									</div>

									<Title level={4} style={{ margin: 0 }}>
										{record?.hocPhan?.ten ? (
											<Tooltip title='Xem đề cương chi tiết học phần'>
												<a onClick={() => props.onShowDeCuong?.()} style={{ color: '#333' }}>
													{record?.hocPhan?.ten ?? ''} <InfoCircleOutlined style={{ color: primaryColor }} />
												</a>
											</Tooltip>
										) : (
											<i>Chưa cập nhật</i>
										)}
									</Title>

									<Tag color='red'>{record?.hocPhan?.soTinChi ?? '--'} tín chỉ</Tag>
									{isCompleted ? <Tag color='red'>Đã kết thúc</Tag> : <Tag color='green'>Đang học</Tag>}
								</div>
							</>
						}
						extra={
							!visibleFilter ? (
								<Space>
									{/* Nút toggle */}
									<Tooltip title={showFilterHocKy ? 'Ẩn bộ lọc học kỳ' : 'Hiện bộ lọc học kỳ'}>
										<Button
											type='dashed'
											icon={showFilterHocKy ? <MinusOutlined /> : <PlusOutlined />}
											onClick={() => setShowFilterHocKy(!showFilterHocKy)}
										/>
									</Tooltip>

									{/* FilterHocKy chỉ hiện khi mở */}
									{showFilterHocKy && <FilterHocKy isSetHocKy />}

									{/* Filter mặc định */}
									<FilterLopHocPhan
										width={200}
										label='ten'
										onChange={(id) => {
											if (id) navigate(`/hoc-tap/lop-tin-chi/${id}${window.location.hash}`);
										}}
									/>
								</Space>
							) : null
						}
					>
						{/* Info Row */}
						<Row gutter={[24, 0]} style={{ marginBottom: '36px' }}>
							<Col>
								<Text>Mã học phần:</Text>
								<Text strong style={{ marginLeft: '8px' }}>
									{record?.hocPhan?.ma ?? ''}
								</Text>
							</Col>
							<Col>
								<Text>Nhóm lớp:</Text>
								<Text
									strong
									style={{ marginLeft: '8px' }}
									copyable={{ text: record?.ten, tooltips: ['Sao chép mã (nhóm) lớp ', 'Đã sao chép mã (nhóm) lớp '] }}
								>
									{record?.soThuTuLop ?? ''}
								</Text>
							</Col>
							<Col>
								<Text>Kỳ học:</Text>
								<Text strong style={{ marginLeft: '8px' }}>
									{record?.hocKy?.ten ?? ''}
								</Text>
							</Col>
							<Col>
								<Text>Giảng viên:</Text>
								{(record?.nhanSuList ?? []).length > 0 ? (
									<Text strong style={{ marginLeft: 8 }}>
										{(record?.nhanSuList ?? []).map((item, index) => (
											<span key={index}>
												<Link
													to='#!'
													onClick={(e) => {
														e.preventDefault();
														setSelectedGiangVien(item?.nhanSu);
														setVisibleGvDetailModal(true);
													}}
												>
													{item?.nhanSu?.hoTen}
												</Link>
												{index < (record?.nhanSuList?.length ?? 0) - 1 && <span>, </span>}
											</span>
										))}
									</Text>
								) : (
									<Text style={{ marginLeft: 8, color: '#999' }}>Không có</Text>
								)}
							</Col>
						</Row>

						<ModalThongTinGiangVien
							visible={visibleGvDetailModal}
							onCancel={() => setVisibleGvDetailModal(false)}
							giangVien={selectedGiangVien}
						/>
					</Card>
				</div>
			</Spin>
		</div>
	);
};

export default ThongTinChungHeaderCard;
