import ViewThongBao from '@/pages/ThongBao/components/ViewThongBao';
import { Button, Card, Empty, Modal, Typography } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { useModel } from 'umi';
import SlideButtonIcon from '../SlideButtonIcon';
import '../style.less';

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
		<Card className='wrapper' variant='borderless' loading={loading} styles={{ body: { padding: 0 } }}>
			{/* Header */}
			<div className='header-tb-sk'>
				<Title level={5} className='title'>
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
				<div
					key={currentNotice?._id || currentIndex}
					className='card fade-in'
					onClick={() => handleNoticeClick(currentNotice)}
				>
					<div className='content'>
						<div className='details'>
							<div className='title'>{currentNotice.title}</div>
							<div className='footer'>
								<div className='date'>{moment(currentNotice.createdAt).format('DD/MM/YYYY')}</div>
							</div>
						</div>
					</div>
				</div>
			) : (
				<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Không có dữ liệu' className='empty' />
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
