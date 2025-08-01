import { InfoCircleOutlined } from '@ant-design/icons';
import { Card, Progress, Tag, Typography } from 'antd';
import { createHash } from 'crypto';
import moment from 'moment';
import { history } from 'umi';

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
		<div style={{ padding: '0', margin: '0' }}>
			<Card
				hoverable
				style={{
					borderRadius: '8px',
					height: '100%',
					cursor: 'pointer',
					margin: '8px 8px',
					backgroundImage: `url(${getBackgroundForItem(lop._id, index)})`,
					backgroundSize: 'contain',
					backgroundRepeat: 'no-repeat',
					backgroundPosition: 'right center',
					backgroundColor: '#fceeee',
					boxShadow: '0px 0px 6px 0px #0000000a',
				}}
				onMouseEnter={(e) => {
					const target = e.currentTarget as HTMLDivElement;
					target.style.transition = 'all 0.3s ease';
					target.style.transform = 'scale(1.005) translateY(-3px)';
				}}
				onMouseLeave={(e) => {
					const target = e.currentTarget as HTMLDivElement;
					target.style.transition = 'all 0.3s ease';
					target.style.transform = 'scale(1) translateY(0)';
				}}
			>
				{isCompleted ? (
					<>
						<Tag
							style={{
								borderRadius: '4px',
								fontSize: 12,
								padding: '2px 10px',
								fontWeight: 500,
								backgroundColor: 'transparent',
								color: '#ff7677',
								border: '1px solid rgb(253, 197, 191)',
								marginBottom: 8,
							}}
						>
							Đã kết thúc
						</Tag>
						<InfoCircleOutlined
							style={{ color: '#007aff', marginLeft: 8 }}
							onClick={() => history.push(`/hoc-tap/lop-tin-chi/${lop._id}`)}
						/>
					</>
				) : (
					<>
						<Tag
							style={{
								borderRadius: '4px',
								fontSize: 12,
								padding: '2px 10px',
								fontWeight: 500,
								backgroundColor: 'transparent',
								border: '1px solid #B7EB8F',
								color: '#52c41a',
								marginBottom: 8,
							}}
						>
							Đang học
						</Tag>
						<InfoCircleOutlined
							style={{ color: '#007aff', marginLeft: 8 }}
							onClick={() => history.push(`/hoc-tap/lop-tin-chi/${lop._id}`)}
						/>
					</>
				)}
				<br />

				<Title
					level={4}
					style={{
						whiteSpace: 'nowrap',
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						maxWidth: '100%',
						marginBottom: 8,
					}}
				>
					{lop.hocPhan?.ten}
				</Title>

				<div style={{ display: 'flex', justifyContent: 'space-between' }}>
					<Text style={{ color: '#6F6F6F' }}>Mã lớp (nhóm): </Text>
					<Text style={{ color: '#6F6F6F' }} strong>
						{lop.maLop}
					</Text>
				</div>

				<div style={{ display: 'flex', justifyContent: 'space-between' }}>
					<Text style={{ color: '#6F6F6F' }}>Tên lớp: </Text>
					<Text style={{ color: '#6F6F6F' }} strong>
						{lop.ten}
					</Text>
				</div>

				{lop?.diem?.diemHpSvHk?.diemKthp ? (
					<Text
						style={{
							color: '#6F6F6F',
							fontWeight: '400',
							display: 'flex',
							justifyContent: 'space-between',
						}}
					>
						<span style={{ color: '#6F6F6F', fontWeight: '400' }}>Điểm thi: </span>
						<span style={{ fontWeight: 'bold', color: '#007AFF' }}>{lop?.diem?.diemHpSvHk?.diemKthp}</span>
					</Text>
				) : (
					<div style={{ display: 'flex', justifyContent: 'space-between' }}>
						<Text style={{ color: '#6F6F6F', fontWeight: '400' }}>Tiến trình: </Text>
						<Text style={{ fontWeight: 'bold' }} strong>
							{past} / {allThoiKhoaBieu.length}
						</Text>
					</div>
				)}

				<div>
					<Progress percent={progress} size='small' strokeColor={progress === 100 ? '#52c41a' : '#007AFF'} />
				</div>
			</Card>
		</div>
	);
};

export default CardLopHocPhanItem;
