import ModalExpandable from '@/components/Table/ModalExpandable';
import ViewThongBao from '@/pages/ThongBao/components/ViewThongBao';
import { ThongBao } from '@/services/ThongBao/typing';
import dayjs from '@/utils/dayjs';
import { Button, Card, Empty, Space, Tag, Typography } from 'antd';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import SlideButtonIcon from '../SlideButtonIcon';
import '../style.less';

const { Title } = Typography;

const CardThongBaoDashboard = () => {
	const {
		danhSach: danhSachThongBao,
		setRecord,
		record,
		loading,
		readNotificationModel,
	} = useModel('thongbao.noticeicon');
	const [visibleThongBao, setVisibleThongBao] = useState(false);
	const [currentIndex, setCurrentIndex] = useState(0);
	const intl = useIntl();

	const currentNotice = danhSachThongBao[currentIndex];

	const handlePrevious = () => {
		setCurrentIndex((prev) => (prev > 0 ? prev - 1 : danhSachThongBao.length - 1));
	};

	const handleNext = () => {
		setCurrentIndex((prev) => (prev < danhSachThongBao.length - 1 ? prev + 1 : 0));
	};

	const handleNoticeClick = (item: ThongBao.IRecord) => {
		setRecord(item);
		setVisibleThongBao(true);
		if (!item.read) readNotificationModel('ONE', item?._id);
	};

	return (
		<Card className='tb-sk-wrapper' variant='borderless' loading={loading} styles={{ body: { padding: 0 } }}>
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
								<div className='date'>{dayjs(currentNotice.createdAt).format('DD/MM/YYYY')}</div>
								<div className='tags'>
									{/* cân bằng với Card Sự kiện - Lịch sắp tới */}
									<Space size={4} wrap>
										<Tag color={currentNotice?.read ? 'default' : 'var(--color-primary)'} style={{ fontSize: 11 }}>
											{currentNotice?.read ? 'Đã đọc' : 'Mới'}
										</Tag>
									</Space>
								</div>
							</div>
						</div>
					</div>
				</div>
			) : (
				<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Không có dữ liệu' className='empty' />
			)}

			<ModalExpandable
				width={800}
				styles={{ body: { padding: 0 } }}
				destroyOnClose
				onCancel={() => setVisibleThongBao(false)}
				open={visibleThongBao}
				footer={null}
			>
				<ViewThongBao
					record={record}
					afterViewDetail={() => {
						setVisibleThongBao(false);
					}}
				/>

				<div className='form-footer'>
					<Button onClick={() => setVisibleThongBao(false)}>
						{intl.formatMessage({ id: 'global.button.dong', defaultMessage: 'Đóng' })}
					</Button>
				</div>
			</ModalExpandable>
		</Card>
	);
};

export default CardThongBaoDashboard;
