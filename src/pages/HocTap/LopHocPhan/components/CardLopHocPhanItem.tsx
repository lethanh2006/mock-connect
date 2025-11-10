import { MessageOutlined, ReadOutlined, ScheduleOutlined } from '@ant-design/icons';
import { Badge, Card, Progress, Tag, Tooltip, Typography } from 'antd';
import { createHash } from 'crypto';
import dayjs from 'dayjs';
import React from 'react';
import { history } from 'umi';
import './style.less';

const { Title, Text } = Typography;

interface CardLopHocPhanItemProps {
	lop: any;
	index: number;
	backgrounds: string[];
	isHienTai?: boolean;
	isKeTiep?: boolean;
	diemDanh?: { coMat?: number; chuaDiemDanh?: number };
	soBaiTap?: number;
	soBaiDang?: number;
}

const CardLopHocPhanItem: React.FC<CardLopHocPhanItemProps> = ({
	lop,
	index,
	backgrounds,
	isHienTai,
	isKeTiep,
	diemDanh,
	soBaiTap,
	soBaiDang,
}) => {
	// Tạo mảng background cố định cho mỗi item để tránh bị giật hình
	const getBackgroundForItem = (itemId: string, index: number) => {
		const hash = createHash('md5').update(itemId).digest('hex');
		// Lấy 2 ký tự đầu tiên chuyển thành số, sau đó % với số hình nền
		const hashNum = parseInt(hash.slice(0, 4), 16);
		const backgroundIndex = hashNum % backgrounds.length;
		return backgrounds[backgroundIndex];
	};

	let allThoiKhoaBieu = lop.thoiKhoaBieuList ?? [];
	allThoiKhoaBieu = allThoiKhoaBieu.concat(
		lop.children?.flatMap((child: { thoiKhoaBieuList: any }) => child.thoiKhoaBieuList ?? []) ?? [],
	);
	const past = allThoiKhoaBieu.filter((i: { ngay: string | Date }) => dayjs().isAfter(dayjs(i?.ngay))).length;
	const progress = Math.round((past / allThoiKhoaBieu.length) * 100) || 0;

	const isCompleted = progress === 100 || lop?.diem?.diemHpSvHk?.diemKthp;

	return (
		<div className='card-lhp'>
			{isHienTai && <Badge.Ribbon text='Hiện tại' color='green' className='ribbon' />}
			{isKeTiep && !isHienTai && <Badge.Ribbon text='Sắp tới' color='red' className='ribbon' />}
			<Card
				variant='borderless'
				className='card-lhp-inner'
				style={{
					backgroundImage: `url(${getBackgroundForItem(lop._id, index)})`,
				}}
				onClick={() => history.push(`/hoc-tap/lop-tin-chi/${lop._id}`)}
			>
				{/* <Tag className={`card-lhp-tag ${isCompleted ? 'card-lhp-tag-completed' : 'card-lhp-tag-progressing'}`}>
					{isCompleted ? 'Đã kết thúc' : 'Đang học'}
				</Tag> */}
				{/* <InfoCircleOutlined style={{ color: 'var(--color-primary)', marginLeft: 8 }} /> */}

				<Tag className={`card-lhp-tag card-lhp-tag-completed`}>
					<Text
						className='card-lhp-malop_copyable'
						copyable={{ text: lop.ten, tooltips: ['Sao chép mã (nhóm) lớp ', 'Đã sao chép mã (nhóm) lớp '] }}
					>
						{lop.maLop}
					</Text>
				</Tag>

				<br />
				<Title level={4} className='card-lhp-title'>
					{lop.hocPhan?.ten}
				</Title>

				{/* <div className='card-lhp-row'> */}
				{/* <span>Mã lớp (nhóm):</span> */}
				{/* <Text strong>{lop.ten}</Text> */}
				{/* </div> */}

				{/* <div className='card-lhp-row'>
					<span>Điểm danh:</span>
					<Text strong>
						{diemDanh?.coMat !== undefined ? diemDanh.coMat : '-'} /{' '}
						{diemDanh?.chuaDiemDanh ? allThoiKhoaBieu.length - (diemDanh?.chuaDiemDanh ?? 0) : '-'}
					</Text>
				</div> */}

				{/* 3 ô thống kê */}
				<div className='card-lhp-row' style={{ marginBottom: 4 }}>
					<Tooltip title='Có mặt / buổi điểm danh'>
						<div className='stat'>
							<ScheduleOutlined className='anticon' />
							<Text strong>
								{diemDanh?.coMat !== undefined ? diemDanh.coMat : '-'} /{' '}
								{diemDanh?.chuaDiemDanh ? allThoiKhoaBieu.length - (diemDanh?.chuaDiemDanh ?? 0) : '-'}
							</Text>
						</div>
					</Tooltip>

					<Tooltip title='Bài tập & bài kiểm tra'>
						<div className='stat'>
							<ReadOutlined className='anticon' />
							<Text strong>{soBaiTap ?? 0}</Text>
						</div>
					</Tooltip>

					<Tooltip title='Bài đăng / thảo luận trên diễn đàn'>
						<div className='stat'>
							<MessageOutlined className='anticon' />
							<Text strong>{soBaiDang ?? 0}</Text>
						</div>
					</Tooltip>
				</div>

				{lop?.diem?.diemHpSvHk?.diemKthp ? (
					<div className='card-lhp-row'>
						<span>Điểm thi:</span>
						<Text strong className='text-primary'>
							{lop?.diem?.diemHpSvHk?.diemKthp}
						</Text>
					</div>
				) : (
					<div className='card-lhp-row'>
						<span>Tiến trình: </span>
						<Text strong>
							{past} / {allThoiKhoaBieu.length}
						</Text>
					</div>
				)}

				<Progress percent={progress} size='small' strokeColor={isCompleted ? '#52c41a' : '#007AFF'} />
			</Card>
		</div>
	);
};

export default CardLopHocPhanItem;
