import ViewThongBao from '@/pages/ThongBao/components/ViewThongBao';
import { Button, Card, Empty, Modal, Typography } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { useModel } from 'umi';
import SlideButtonIcon from '../SlideButtonIcon';
import './style.less'; // CSS file for custom styling
const { Title } = Typography;

const CardThongBaoDashboard = () => {
	const { danhSach: danhSachThongBao, setRecord, record, loading } = useModel('thongbao.noticeicon');
	const [visibleThongBao, setVisibleThongBao] = useState(false);
	const [currentIndex, setCurrentIndex] = useState(0);
	const currentNotice = danhSachThongBao[currentIndex];

	const handlePrevious = () => {
		setCurrentIndex((prev) => (prev > 0 ? prev - 1 : danhSachThongBao.length - 1));
	};

	const handleNext = () => {
		setCurrentIndex((prev) => (prev < danhSachThongBao.length - 1 ? prev + 1 : 0));
	};

	const handleNoticeClick = (item: any) => {
		setRecord(item);
		setVisibleThongBao(true);
	};

	return (
		<Card className='thongbao-wrapper' variant='borderless' loading={loading} styles={{ body: { padding: 0 } }}>
			{/* Header */}
			<div className='thongbao-header'>
				<Title level={4} className='thongbao-title'>
					Thông báo
				</Title>
				<div className='navigation-buttons'>
					<Button
						type='text'
						icon={<SlideButtonIcon direction='left' disabled={danhSachThongBao.length <= 1} />}
						onClick={handlePrevious}
						disabled={danhSachThongBao.length <= 1}
						className='nav-btn'
					/>
					<Button
						type='text'
						icon={<SlideButtonIcon direction='right' disabled={danhSachThongBao.length <= 1} />}
						onClick={handleNext}
						disabled={danhSachThongBao.length <= 1}
						className='nav-btn'
					/>
				</div>
			</div>

			{/* Nội dung chính */}
			{danhSachThongBao.length > 0 ? (
				<>
					{/* Current Notice Card */}
					<div
						key={currentNotice?._id || currentIndex}
						className='notice-card fade-in'
						onClick={() => handleNoticeClick(currentNotice)}
					>
						<div className='notice-content'>
							<div className='notice-title'>{currentNotice.title}</div>
							<div className='notice-date'>{moment(currentNotice.createdAt).format('DD/MM/YYYY')}</div>
						</div>
					</div>
				</>
			) : (
				<div className='notice-empty'>
					<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Không có dữ liệu' />
				</div>
			)}

			{/* Modal */}
			<Modal
				width={800}
				bodyStyle={{ padding: 0 }}
				destroyOnClose
				onCancel={() => setVisibleThongBao(false)}
				open={visibleThongBao}
				footer={null}
			>
				<ViewThongBao record={record} />
			</Modal>
		</Card>
	);
};

export default CardThongBaoDashboard;
