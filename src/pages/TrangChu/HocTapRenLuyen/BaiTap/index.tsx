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
import { Button, Card, Carousel, Empty, Segmented, Space, Tag, Typography } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { history, Link, useModel } from 'umi';
import SlideButtonIcon from '../../components/SlideButtonIcon';
import './style.less';

const { Text } = Typography;

const CardBaiTapDashboard = (props: { isDashBoard?: boolean }) => {
	const { record: recHocKy } = useModel('daotao.hocky');
	const { danhSach, getBaiTapSinhVienModel } = useModel('daotao.baitap');
	const [currentPage, setCurrentPage] = useState(0);
	const [carouselRef, setCarouselRef] = useState<any>(null);
	const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
	const [itemsPerPage, setItemsPerPage] = useState(2);
	const [segment, setSegment] = useState<string>('1');
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		getBaiTapSinhVienModel(1, 20, recHocKy?.ma);
		if (filteredData.length == 0) {
			setSegment('2');
		}
	}, [recHocKy?.ma]);

	// Theo dõi độ rộng container và tự động điều chỉnh số lượng items hiển thị
	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const resizeObserver = new ResizeObserver(() => {
			const width = container.offsetWidth;
			if (width < 600) {
				setItemsPerPage(1);
			} else if (width < 1200) {
				setItemsPerPage(2);
			} else {
				setItemsPerPage(3);
			}
		});

		resizeObserver.observe(container);
		return () => resizeObserver.disconnect();
	}, []);

	const filteredData = danhSach.filter(
		(i) => i.assignment?.thoiGianKetThuc && dayjs().isSameOrBefore(dayjs(i.assignment.thoiGianKetThuc)),
	);

	const dataToUse = segment === '1' ? filteredData : danhSach;

	const { isDashBoard } = props;
	const totalPages = Math.ceil(dataToUse.length / itemsPerPage);
	// Tạo các trang dữ liệu
	const pageData = [];
	for (let i = 0; i < totalPages; i++) {
		pageData.push(dataToUse.slice(i * itemsPerPage, (i + 1) * itemsPerPage));
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
		const files = item.assignment?.urlTepDinhKem || [];

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
							{/* Luôn cắt lấy tối đa 2 file đầu tiên */}
							<BoxFile url={files.slice(0, 2)} />

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
			<div
				className='page-cards'
				style={{
					gridTemplateColumns: `repeat(${itemsPerPage}, 1fr)`,
				}}
			>
				{pageItems.map((item, index) => renderAssignmentCard(item, index))}

				{/* Nếu chỉ có 1 item và có chỗ trống => thêm Empty filler */}
				{pageItems.length < itemsPerPage &&
					Array.from({ length: itemsPerPage - pageItems.length }).map((_, i) => (
						<div key={`empty-${i}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
							<Empty
								style={{ margin: 'auto' }}
								image={Empty.PRESENTED_IMAGE_SIMPLE}
								description='Không còn bài tập khác'
							/>
						</div>
					))}
			</div>
		);
	};

	return (
		<Card
			variant='borderless'
			className='card-borderless card-big-title card-baitap-dashboard'
			title={
				<>
					Bài tập, bài kiểm tra{' '}
					<Tag color={danhSach.length > 0 ? 'green' : ''}>{segment == '1' ? filteredData.length : danhSach.length}</Tag>
				</>
			}
			styles={danhSach.length ? {} : { body: { height: '100%' } }}
			extra={
				<Space size={isMobile ? 'small' : 'middle'} className='navigation-buttons'>
					{isDashBoard && !isMobile && (
						<>
							{/* Mong muốn: có một cái để xem lại bài tập ngay trang chủ (không cần vào trang của lớp) && giao diện không bị trống  => tạm thời để đây */}
							<Segmented
								options={[
									{
										label: (
											<span>
												Đang diễn ra <span style={{ color: '#999' }}>({filteredData.length})</span>
											</span>
										),
										value: '1',
									},
									{
										label: (
											<span>
												Tất cả <span style={{ color: '#999' }}>({danhSach.length})</span>
											</span>
										),
										value: '2',
									},
								]}
								value={segment}
								onChange={(value) => {
									setSegment(value as string);
									setCurrentPage(0);
									carouselRef?.goTo(0);
								}}
								size='small'
							/>
						</>
					)}

					{/* {!!dataToUse.length && ( */}
					<>
						<Button
							type='text'
							icon={<SlideButtonIcon direction='left' disabled={currentPage === 0} />}
							onClick={handlePrevious}
							disabled={currentPage === 0}
							className='nav-btn'
						/>
						{isDashBoard && !isMobile && (
							<Text type='secondary' style={{ minWidth: 40, textAlign: 'center' }}>
								{currentPage + 1}/{totalPages}
							</Text>
						)}
						<Button
							type='text'
							icon={<SlideButtonIcon direction='right' disabled={currentPage >= totalPages - 1} />}
							onClick={handleNext}
							disabled={currentPage >= totalPages - 1}
							className='nav-btn'
						/>
					</>
					{/* )} */}

					{isDashBoard && (
						<Link to='/hoc-tap/lop-tin-chi' className='xem-tat-ca-link'>
							Xem thêm
						</Link>
					)}
				</Space>
			}
		>
			<Card variant='borderless' className={`${isDashBoard && 'content-wrapper'} `} styles={{ body: { padding: 0 } }}>
				<div ref={containerRef}>
					{!!dataToUse.length ? (
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
				</div>
			</Card>
		</Card>
	);
};

export default CardBaiTapDashboard;
