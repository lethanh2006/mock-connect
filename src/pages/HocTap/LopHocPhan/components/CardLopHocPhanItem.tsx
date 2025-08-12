import { InfoCircleOutlined } from '@ant-design/icons';
import { Card, Progress, Tag, Typography } from 'antd';
import { createHash } from 'crypto';
import moment from 'moment';
import { history } from 'umi';
import './style.less';

const { Title, Text } = Typography;

interface CardLopHocPhanItemProps {
	lop: any;
	index: number;
	backgrounds: string[];
}

const CardLopHocPhanItem: React.FC<CardLopHocPhanItemProps> = ({ lop, index, backgrounds }) => {
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
	const past = allThoiKhoaBieu.filter((i: { ngay: moment.MomentInput }) => moment().isAfter(i?.ngay)).length;
	const progress = Math.round((past / allThoiKhoaBieu.length) * 100) || 0;

	const isCompleted = progress === 100 || lop?.diem?.diemHpSvHk?.diemKthp;

	return (
		<div className='card-lhp'>
			<Card
				variant='borderless'
				className='card-lhp-inner'
				style={{
					backgroundImage: `url(${getBackgroundForItem(lop._id, index)})`,
				}}
				onClick={() => history.push(`/hoc-tap/lop-tin-chi/${lop._id}`)}
			>
				<Tag className={`card-lhp-tag ${isCompleted ? 'card-lhp-tag-completed' : 'card-lhp-tag-progressing'}`}>
					{isCompleted ? 'Đã kết thúc' : 'Đang học'}
				</Tag>

				<InfoCircleOutlined style={{ color: '#007aff', marginLeft: 8 }} />

				<br />
				<Title level={4} className='card-lhp-title'>
					{lop.hocPhan?.ten}
				</Title>

				<div className='card-lhp-row'>
					<span>Mã lớp (nhóm):</span>
					<Text strong>{lop.maLop}</Text>
				</div>

				<div className='card-lhp-row'>
					<span>Tên lớp:</span>
					<Text strong>{lop.ten}</Text>
				</div>

				{lop?.diem?.diemHpSvHk?.diemKthp ? (
					<div className='card-lhp-row'>
						<span>Điểm thi:</span>
						<Text strong style={{ color: '#007aff' }}>
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

				<Progress percent={progress} size='small' strokeColor={progress === 100 ? '#52c41a' : '#007AFF'} />
			</Card>
		</div>
	);
};

export default CardLopHocPhanItem;
