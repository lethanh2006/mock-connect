// import PDFViewerV2 from '@/components/PDFViewerV2';
import BoxFile from '@/pages/HocTap/LopHocPhan/DienDan/components/BoxFile';
import {
	colorTrangThaiNopBaiTap,
	ETrangThaiNopBaiTap,
	mapTrangThaiNopBaiTap,
} from '@/services/DaoTao/BaiTap/constants';
import { BaiTap } from '@/services/DaoTao/BaiTap/typing';
import dayjs from '@/utils/dayjs';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Button, Card, Carousel, Empty, Space, Tag, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { history, Link, useModel } from 'umi';
import SlideButtonIcon from '../../components/SlideButtonIcon';
import './style.less';

const { Text } = Typography;

const CardBaiTapDashboard = () => {
	const { danhSach } = useModel('daotao.baitap');
	const [currentPage, setCurrentPage] = useState(0);
	const [carouselRef, setCarouselRef] = useState<any>(null);
	const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
	const itemsPerPage = isMobile ? 1 : 2;
	const filteredData = danhSach.filter(
		(i) => i.assignment?.thoiGianKetThuc && dayjs().isSameOrBefore(dayjs(i.assignment.thoiGianKetThuc)),
	);
	const totalPages = Math.ceil(filteredData.length / itemsPerPage);
	// Tạo các trang dữ liệu
	const pageData = [];
	for (let i = 0; i < totalPages; i++) {
		pageData.push(filteredData.slice(i * itemsPerPage, (i + 1) * itemsPerPage));
	}

	// Reset current page when items per page changes
	useEffect(() => {
		setCurrentPage(0);
	}, [itemsPerPage]);

	const handlePrevious = () => {
		if (currentPage > 0) {
			carouselRef?.prev();
		}
	};

	const handleNext = () => {
		if (currentPage < totalPages - 1) {
			carouselRef?.next();
		}
	};

	const handleSlideChange = (current: number) => {
		setCurrentPage(current);
	};

	const renderAssignmentCard = (item: BaiTap.IDanhSachGiaoBaiTap, index: number) => {
		const files = item.assignment.urlTepDinhKem || [];

		return (
			<div key={item._id + index} className='assignment-card'>
				<div className='top-section'>
					<div
						className='subject-tag'
						onClick={() => history.push(`/hoc-tap/lop-tin-chi/${item.assignment.lopHocPhanId}#bai-tap`)}
					>
						<Link to={`/hoc-tap/lop-tin-chi/${item.assignment.lopHocPhanId}#bai-tap`}>
							#{item.assignment.tenLopHocPhan}
						</Link>
						<Link to={`/hoc-tap/lop-tin-chi/${item.assignment.lopHocPhanId}#bai-tap`}>
							<ArrowRightOutlined className='arrow-icon' />
						</Link>
					</div>

					{/* Assignment Content - Giới hạn 3 dòng */}
					<div className='assignment-content'>
						<Text className='content-text'>
							<div dangerouslySetInnerHTML={{ __html: item.assignment.noiDung ?? '' }} />
						</Text>
					</div>
				</div>

				{/* Bottom section: Files + Deadline */}
				<div className={`bottom-section ${isMobile ? 'mobile' : ''}`}>
					{/* Files Section */}
					{files.length > 0 && (
						<div className='files-section'>
							<BoxFile url={files} />

							{files.length > 2 && (
								<Text type='secondary' italic>
									...và {files.length - 2} file khác
								</Text>
							)}
						</div>
					)}

					{/* Deadline */}
					<div className={`deadline-section ${isMobile ? 'mobile' : ''}`}>
						<Text className={`deadline-label ${isMobile ? 'mobile' : ''}`}>Hạn nộp bài:</Text>
						<Text className={`deadline-time ${isMobile ? 'mobile' : ''}`}>
							{dayjs(item.assignment.thoiGianKetThuc).format('HH:mm DD/MM/YYYY')}
							<Tag color={colorTrangThaiNopBaiTap[item.trangThai as ETrangThaiNopBaiTap]} style={{ marginLeft: 4 }}>
								{mapTrangThaiNopBaiTap[item.trangThai as ETrangThaiNopBaiTap]}
							</Tag>
						</Text>
					</div>
				</div>
			</div>
		);
	};

	const renderPageCards = (pageItems: BaiTap.IDanhSachGiaoBaiTap[]) => {
		return (
			<div className={`page-cards ${isMobile ? 'mobile' : ''}`}>
				{pageItems.map((item, index) => renderAssignmentCard(item, index))}

				{pageItems.length === 1 && !isMobile && (
					<Empty style={{ margin: 'auto' }} image={Empty.PRESENTED_IMAGE_SIMPLE} description='Không còn bài tập khác' />
				)}
			</div>
		);
	};

	return (
		<Card
			variant='borderless'
			className='card-borderless card-big-title card-baitap-dashboard'
			title='Bài tập, bài kiểm tra'
			extra={
				<Space size={isMobile ? 'small' : 'middle'} className='navigation-buttons'>
					{!!filteredData.length && (
						<>
							<Button
								type='text'
								icon={<SlideButtonIcon direction='left' disabled={currentPage === 0} />}
								onClick={handlePrevious}
								disabled={currentPage === 0}
								className='nav-btn'
							/>
							<Button
								type='text'
								icon={<SlideButtonIcon direction='right' disabled={currentPage >= totalPages - 1} />}
								onClick={handleNext}
								disabled={currentPage >= totalPages - 1}
								className='nav-btn'
							/>
						</>
					)}
					<Link to='/hoc-tap/lop-tin-chi' className='xem-tat-ca-link'>
						Xem thêm
					</Link>
				</Space>
			}
		>
			<Card variant='borderless' className='content-wrapper' styles={{ body: { padding: 0 } }}>
				{!!filteredData.length ? (
					<Carousel
						ref={setCarouselRef}
						dots={false}
						infinite={false}
						speed={300}
						easing='ease-in-out'
						afterChange={handleSlideChange}
					>
						{pageData.map((pageItems, pageIndex) => (
							<div key={pageIndex}>{renderPageCards(pageItems)}</div>
						))}
					</Carousel>
				) : (
					<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Không có bài tập' className='empty' />
				)}
			</Card>
		</Card>
	);
};

export default CardBaiTapDashboard;
