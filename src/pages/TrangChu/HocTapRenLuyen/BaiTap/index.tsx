import PDFViewerV2 from '@/components/PDFViewerV2';
import { BaiTap } from '@/services/DaoTao/BaiTap/typing';
import {
	ArrowRightOutlined,
	DownloadOutlined,
	EyeOutlined,
	FilePdfOutlined,
	FilePptOutlined,
	FileTextOutlined,
	MoreOutlined,
} from '@ant-design/icons';
import { Button, Carousel, Empty, List, Modal, Popover, Space, Typography } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { history, Link, useModel } from 'umi';
import SlideButtonIcon from '../../components/SlideButtonIcon';
import './style.less';

const { Text } = Typography;

const CardBaiTapDashboard = () => {
	const { danhSach } = useModel('daotao.baitap');
	const [currentPage, setCurrentPage] = useState(0);
	const [carouselRef, setCarouselRef] = useState<any>(null);
	const [previewModal, setPreviewModal] = useState<{
		visible: boolean;
		fileUrl: string;
		fileName: string;
		fileType: string;
	}>({
		visible: false,
		fileUrl: '',
		fileName: '',
		fileType: '',
	});
	const [screenSize, setScreenSize] = useState({
		width: window.innerWidth,
		height: window.innerHeight,
	});

	const assignmentBg = 'images/assignment-background.svg';

	// Responsive logic
	const getItemsPerPage = () => {
		if (screenSize.width <= 768) return 1; // Mobile: 1 card per page
		return 2; // Desktop: 2 cards per page
	};

	const itemsPerPage = getItemsPerPage();

	// Handle window resize
	useEffect(() => {
		const handleResize = () => {
			setScreenSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	// Reset current page when items per page changes
	useEffect(() => {
		setCurrentPage(0);
	}, [itemsPerPage]);

	const filteredData = danhSach.filter(
		(i) => i.assignment?.thoiGianKetThuc && moment().isSameOrBefore(i.assignment.thoiGianKetThuc),
	);

	const totalPages = Math.ceil(filteredData.length / itemsPerPage);

	// Tạo các trang dữ liệu
	const pageData = [];
	for (let i = 0; i < totalPages; i++) {
		pageData.push(filteredData.slice(i * itemsPerPage, (i + 1) * itemsPerPage));
	}

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

	// Hàm lấy tên file từ URL
	const getFileNameFromUrl = (url: string): string => {
		try {
			const urlObj = new URL(url);
			const pathname = urlObj.pathname;
			const fileName = pathname.split('/').pop() || 'file';
			return decodeURIComponent(fileName);
		} catch {
			return url.split('/').pop() || 'file';
		}
	};

	// Thêm hàm helper để cắt tên file
	const truncateFileName = (fileName: string, maxLength: number = 25): string => {
		if (fileName.length <= maxLength) return fileName;

		const lastDotIndex = fileName.lastIndexOf('.');
		if (lastDotIndex === -1) {
			return fileName.substring(0, maxLength - 3) + '...';
		}

		const name = fileName.substring(0, lastDotIndex);
		const extension = fileName.substring(lastDotIndex);

		if (extension.length >= maxLength - 3) {
			// Extension quá dài
			return fileName.substring(0, maxLength - 3) + '...';
		}

		const availableLength = maxLength - extension.length - 3; // -3 cho "..."
		if (availableLength <= 0) {
			return '...' + extension;
		}

		return name.substring(0, availableLength) + '...' + extension;
	};

	// Hàm lấy icon file dựa trên extension
	const getFileIcon = (fileName: string) => {
		const ext = fileName.split('.').pop()?.toLowerCase();
		switch (ext) {
			case 'pdf':
				return <FilePdfOutlined className='file-icon pdf' />;
			case 'ppt':
			case 'pptx':
				return <FilePptOutlined className='file-icon ppt' />;
			case 'doc':
			case 'docx':
				return <FileTextOutlined className='file-icon doc' />;
			case 'xls':
			case 'xlsx':
				return <FileTextOutlined className='file-icon excel' />;
			case 'jpg':
			case 'jpeg':
			case 'png':
			case 'gif':
				return <FileTextOutlined className='file-icon image' />;
			default:
				return <FileTextOutlined className='file-icon default' />;
		}
	};

	// Hàm xử lý download file
	const handleDownloadFile = (url: string, fileName: string) => {
		const link = document.createElement('a');
		link.href = url;
		link.download = fileName;
		link.target = '_blank';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	// Hàm xử lý preview file
	const handlePreviewFile = (url: string, fileName: string) => {
		const fileType = fileName.split('.').pop()?.toLowerCase() || '';
		setPreviewModal({
			visible: true,
			fileUrl: url,
			fileName,
			fileType,
		});
	};

	// Component action popover cho file
	const FileActionPopover = ({ fileUrl, fileName }: { fileUrl: string; fileName: string }) => {
		const fileType = fileName.split('.').pop()?.toLowerCase() || '';
		const canPreview = ['pdf'].includes(fileType);

		const fileActions = [
			{ key: 'download', label: 'Tải xuống', icon: <DownloadOutlined /> },
			...(canPreview ? [{ key: 'preview', label: 'Xem trước', icon: <EyeOutlined /> }] : []),
		];

		const handleAction = (key: string) => {
			if (key === 'download') {
				handleDownloadFile(fileUrl, fileName);
			} else if (key === 'preview') {
				handlePreviewFile(fileUrl, fileName);
			}
		};

		const content = (
			<List
				size='small'
				dataSource={fileActions}
				renderItem={(item) => (
					<List.Item className='action-item' onClick={() => handleAction(item.key)}>
						{item.icon}
						{item.label}
					</List.Item>
				)}
			/>
		);

		return (
			<Popover content={content} trigger='click' placement='bottomRight' overlayClassName='file-action-popover'>
				<Button
					type='text'
					icon={<MoreOutlined />}
					className='file-action-button'
					onClick={(e) => e.stopPropagation()}
				/>
			</Popover>
		);
	};

	// Component hiển thị file
	const FileItem = ({ fileUrl, index }: { fileUrl: string; index: number }) => {
		const fileName = getFileNameFromUrl(fileUrl);
		const isMobile = screenSize.width <= 768;

		// Xác định độ dài tối đa dựa trên kích thước màn hình
		const maxFileNameLength = isMobile ? 20 : 30;
		const displayFileName = truncateFileName(fileName, maxFileNameLength);

		return (
			<div key={index} className={`file-item ${isMobile ? 'mobile' : ''}`}>
				{getFileIcon(fileName)}
				<div className='file-info'>
					<Text
						className={`file-name ${isMobile ? 'mobile' : ''}`}
						title={fileName} // Hiển thị tên file đầy đủ khi hover
					>
						{displayFileName}
					</Text>
					{/* <Text className={`file-size ${isMobile ? 'mobile' : ''}`}>{fileSize}</Text> */}
				</div>
				<FileActionPopover fileUrl={fileUrl} fileName={fileName} />
			</div>
		);
	};

	const renderAssignmentCard = (item: BaiTap.IDanhSachGiaoBaiTap, index: number) => {
		const files = item.assignment.urlTepDinhKem || [];
		const isMobile = screenSize.width <= 768;

		return (
			<div key={item._id + index} className={`assignment-card ${isMobile ? 'mobile' : ''}`}>
				{/* Top section: Subject Tag + Assignment Content */}
				<div className='top-section'>
					{/* Subject Tag */}
					<div
						className='subject-tag'
						onClick={() => history.push(`/hoc-tap/lop-tin-chi/${item.assignment.lopHocPhanId}#bai-tap`)}
					>
						<Text className={`subject-name ${isMobile ? 'mobile' : ''}`}>#{item.assignment.tenLopHocPhan}</Text>
						<ArrowRightOutlined className='arrow-icon' />
					</div>

					{/* Assignment Content - Giới hạn 3 dòng */}
					<div className={`assignment-content ${isMobile ? 'mobile' : ''}`}>
						<Text className={`content-text ${isMobile ? 'mobile' : ''}`}>{item.assignment.noiDung}</Text>
					</div>
				</div>

				{/* Bottom section: Files + Deadline */}
				<div className={`bottom-section ${isMobile ? 'mobile' : ''}`}>
					{/* Files Section */}
					{files.length > 0 && (
						<div className={`files-section ${isMobile ? 'mobile' : ''}`}>
							{files.slice(0, 2).map((fileUrl, fileIndex) => (
								<FileItem key={fileIndex} fileUrl={fileUrl} index={fileIndex} />
							))}
							{files.length > 2 && (
								<Text className={`more-files-text ${isMobile ? 'mobile' : ''}`}>
									...và {files.length - 2} file khác
								</Text>
							)}
						</div>
					)}

					{/* Deadline */}
					<div className={`deadline-section ${isMobile ? 'mobile' : ''}`}>
						<Text className={`deadline-label ${isMobile ? 'mobile' : ''}`}>Hạn nộp bài:</Text>
						<Text className={`deadline-time ${isMobile ? 'mobile' : ''}`}>
							{moment(item.assignment.thoiGianKetThuc).format('HH:mm DD/MM/YYYY')}
						</Text>
					</div>
				</div>
			</div>
		);
	};

	const renderPageCards = (pageItems: BaiTap.IDanhSachGiaoBaiTap[]) => {
		const isMobile = screenSize.width <= 768;

		return (
			<div className={`page-cards ${isMobile ? 'mobile' : ''}`}>
				{pageItems.map((item, index) => renderAssignmentCard(item, index))}

				{/* Fill empty space if only 1 card on desktop */}
				{pageItems.length === 1 && !isMobile && (
					<div className='empty-container'>
						<Empty
							style={{ margin: 'auto' }}
							image={Empty.PRESENTED_IMAGE_SIMPLE}
							description='Không còn bài tập khác'
						/>
					</div>
				)}
			</div>
		);
	};

	const isMobile = screenSize.width <= 768;

	if (!filteredData.length) {
		return (
			<div className={`card-baitap-dashboard ${isMobile ? 'mobile' : ''}`}>
				{/* Header */}
				<div className={`header ${isMobile ? 'mobile' : ''}`}>
					<Text className={`title ${isMobile ? 'mobile' : ''}`}>Bài tập, bài kiểm tra</Text>
					<Space size={isMobile ? 'small' : 'middle'} className='navigation-buttons'>
						<Button
							type='text'
							icon={<SlideButtonIcon direction='left' disabled={filteredData.length == 0} />}
							disabled
							className='nav-btn'
						/>
						<Button
							type='text'
							icon={<SlideButtonIcon direction='right' disabled={filteredData.length == 0} />}
							disabled
							className='nav-btn'
						/>
						<Link to='/hoc-tap/lop-tin-chi' className='xem-tat-ca-link'>
							Xem tất cả
						</Link>
					</Space>
				</div>

				{/* Content - Empty State */}
				<div
					className='content-wrapper'
					style={{
						backgroundImage: isMobile ? 'none' : `url(${assignmentBg})`,
						backgroundPosition: 'right',
						backgroundRepeat: 'no-repeat',
						backgroundSize: 'contain',
					}}
				>
					<div className={`empty-state-wrapper ${isMobile ? 'mobile' : ''}`}>
						<div className={`empty-container ${isMobile ? 'mobile' : ''}`}>
							<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Không có bài tập' />
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className={`card-baitap-dashboard ${isMobile ? 'mobile' : ''}`}>
			{/* Header */}
			<div className={`header ${isMobile ? 'mobile' : ''}`}>
				<Text className={`title ${isMobile ? 'mobile' : ''}`}>Bài tập, bài kiểm tra</Text>
				<Space size={isMobile ? 'small' : 'middle'} className='navigation-buttons'>
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
					<Link to='/hoc-tap/lop-tin-chi' className='xem-tat-ca-link'>
						Xem thêm
					</Link>
				</Space>
			</div>

			{/* Content - Carousel */}
			<div className='content-wrapper'>
				<Carousel
					ref={setCarouselRef}
					dots={false}
					infinite={false}
					speed={300}
					easing='ease-in-out'
					afterChange={handleSlideChange}
					className={`carousel-container ${isMobile ? 'mobile' : ''}`}
					style={{
						backgroundImage: isMobile ? 'none' : `url(${assignmentBg})`,
					}}
				>
					{pageData.map((pageItems, pageIndex) => (
						<div key={pageIndex}>{renderPageCards(pageItems)}</div>
					))}
				</Carousel>
			</div>

			{/* Modal xem trước file */}
			<Modal
				title={`Xem trước: ${previewModal.fileName}`}
				open={previewModal.visible}
				onCancel={() => setPreviewModal({ ...previewModal, visible: false })}
				width='90%'
				className='preview-modal'
				footer={[
					<Button
						key='download'
						type='primary'
						onClick={() => handleDownloadFile(previewModal.fileUrl, previewModal.fileName)}
					>
						Tải xuống
					</Button>,
					<Button key='close' onClick={() => setPreviewModal({ ...previewModal, visible: false })}>
						Đóng
					</Button>,
				]}
			>
				<div className='modal-content'>
					{previewModal.fileType === 'pdf' ? (
						<PDFViewerV2 url={previewModal.fileUrl} height='100%' />
					) : (
						<div className='unsupported-preview'>
							<Text>Không hỗ trợ xem trước loại file này</Text>
						</div>
					)}
				</div>
			</Modal>
		</div>
	);
};

export default CardBaiTapDashboard;
