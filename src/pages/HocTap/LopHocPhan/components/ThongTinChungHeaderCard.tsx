import { ToChucNhanSu } from '@/services/ToChucNhanSu/typing';
import dayjs from '@/utils/dayjs';
import { Col, Row, Spin, Tag, Tooltip, Typography } from 'antd';
import { useRef, useState } from 'react';
import { Link, useModel } from 'umi';
import ModalThongTinGiangVien from './ModalGiangVien';
import './style.less';
const { Title, Text } = Typography;

const ThongTinChungHeaderCard = (props: { onShowDeCuong: () => void }) => {
	const { loading, record } = useModel('lophocphan.lophocphan');
	const [selectedGiangVien, setSelectedGiangVien] = useState<ToChucNhanSu.INhanSu>();
	const [visibleGvDetailModal, setVisibleGvDetailModal] = useState(false);
	const backgroundRef = useRef(Math.floor(Math.random() * 6));
	const randomBackground = `/images/isolation-mode-${backgroundRef.current}.svg`;

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
						<Title level={4} style={{ margin: 0, color: '#333' }}>
							{record?.hocPhan?.ten ? (
								<Tooltip title='Xem đề cương chi tiết học phần'>
									<a onClick={() => props.onShowDeCuong?.()} style={{ color: '#333' }}>
										{record?.hocPhan?.ten ?? ''}
									</a>
								</Tooltip>
							) : (
								<i>Chưa cập nhật</i>
							)}
						</Title>

						<Tag color='red'>{record?.hocPhan?.soTinChi ?? '--'} tín chỉ</Tag>
						{isCompleted ? <Tag color='red'>Đã kết thúc</Tag> : <Tag color='green'>Đang học</Tag>}
					</div>

					{/* Info Row */}
					<Row gutter={[24, 0]} style={{ marginBottom: '36px' }}>
						<Col>
							<Text>Mã học phần:</Text>
							<Text strong style={{ marginLeft: '8px' }}>
								{record?.hocPhan?.ma ?? ''}
							</Text>
						</Col>
						<Col>
							<Text>Mã lớp (nhóm):</Text>
							<Text strong style={{ marginLeft: '8px' }} copyable>
								{record?.ten ?? ''}
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
				</div>
			</Spin>
		</div>
	);
};

export default ThongTinChungHeaderCard;
