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
import { history, useModel } from 'umi';
import SlideButtonIcon from '../components/SlideButtonIcon';
import XemTatCaLink from '../components/ViewMore';

const { Text } = Typography;

const CardBaiTapDashboard = () => {
	const { danhSach, loading } = useModel('daotao.baitap');
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

	const assignmentBg = 'images/assignment-background.png';

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

	// Hàm lấy kích thước file (nếu có thể)
	const getFileSize = async (url: string): Promise<string> => {
		try {
			const response = await fetch(url, { method: 'HEAD' });
			const contentLength = response.headers.get('content-length');
			if (contentLength) {
				const bytes = parseInt(contentLength);
				if (bytes < 1024) return `${bytes} B`;
				if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
				return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
			}
		} catch (error) {
			console.error('Error getting file size:', error);
		}
		return 'Unknown';
	};

	// Thêm hàm helper để cắt tên file
	const truncateFileName = (fileName: string, maxLength: number = 25): string => {
		if (fileName.length <= maxLength) return fileName;

		const lastDotIndex = fileName.lastIndexOf('.');
		if (lastDotIndex === -1) {
			// Không có extension
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
				return <FilePdfOutlined style={{ color: '#ff4d4f', fontSize: '18px' }} />;
			case 'ppt':
			case 'pptx':
				return <FilePptOutlined style={{ color: '#ff7a45', fontSize: '18px' }} />;
			case 'doc':
			case 'docx':
				return <FileTextOutlined style={{ color: '#1890ff', fontSize: '18px' }} />;
			case 'xls':
			case 'xlsx':
				return <FileTextOutlined style={{ color: '#52c41a', fontSize: '18px' }} />;
			case 'jpg':
			case 'jpeg':
			case 'png':
			case 'gif':
				return <FileTextOutlined style={{ color: '#722ed1', fontSize: '18px' }} />;
			default:
				return <FileTextOutlined style={{ color: '#1890ff', fontSize: '18px' }} />;
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
					<List.Item
						style={{
							cursor: 'pointer',
							padding: '8px 16px',
							borderRadius: '4px',
							transition: 'background-color 0.2s',
							border: 'none',
							display: 'flex',
							alignItems: 'center',
							gap: '8px',
						}}
						onClick={() => handleAction(item.key)}
						onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
						onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
					>
						{item.icon}
						{item.label}
					</List.Item>
				)}
			/>
		);

		return (
			<Popover content={content} trigger='click' placement='bottomRight' overlayStyle={{ minWidth: '140px' }}>
				<Button
					type='text'
					icon={<MoreOutlined />}
					style={{ color: '#8c8c8c', marginRight: '-6px' }}
					onClick={(e) => e.stopPropagation()}
				/>
			</Popover>
		);
	};

	// Component hiển thị file
	const FileItem = ({ fileUrl, index }: { fileUrl: string; index: number }) => {
		const fileName = getFileNameFromUrl(fileUrl);
		const [fileSize, setFileSize] = useState<string>('...');
		const isMobile = screenSize.width <= 768;

		// Xác định độ dài tối đa dựa trên kích thước màn hình
		const maxFileNameLength = isMobile ? 20 : 30;
		const displayFileName = truncateFileName(fileName, maxFileNameLength);

		useEffect(() => {
			getFileSize(fileUrl).then(setFileSize);
		}, [fileUrl]);

		return (
			<div
				key={index}
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: isMobile ? '8px' : '12px',
					padding: isMobile ? '8px 10px' : '4px 12px',
					borderRadius: '6px',
					border: '1px solid rgba(240, 240, 240, 0.3)',
					marginBottom: '8px',
					backgroundColor: '#EFF1F9',
				}}
			>
				{getFileIcon(fileName)}
				<div style={{ flex: 1, minWidth: 0 }}>
					<Text
						style={{
							fontSize: isMobile ? '13px' : '14px',
							fontWeight: 500,
							color: '#262626',
							display: 'block',
							wordBreak: 'break-all',
						}}
						title={fileName} // Hiển thị tên file đầy đủ khi hover
					>
						{displayFileName}
					</Text>
					<Text
						style={{
							fontSize: isMobile ? '11px' : '12px',
							color: '#8c8c8c',
							display: 'block',
						}}
					>
						{fileSize}
					</Text>
				</div>
				<FileActionPopover fileUrl={fileUrl} fileName={fileName} />
			</div>
		);
	};

	const renderAssignmentCard = (item: BaiTap.IDanhSachGiaoBaiTap, index: number) => {
		const files = item.assignment.urlTepDinhKem || [];
		const isMobile = screenSize.width <= 768;

		return (
			<div
				key={item._id + index}
				style={{
					backgroundColor: 'transparent',
					borderRadius: '8px',
					padding: isMobile ? '16px' : '20px',
					border: '1px solid #ebebeb',
					transition: 'all 0.2s ease',
					height: isMobile ? 'auto' : '350px',
					minHeight: isMobile ? '300px' : '350px',
					display: 'flex',
					flexDirection: 'column',
					margin: isMobile ? '0' : '0 0.5px',
					width: '100%',
					boxSizing: 'border-box',
				}}
			>
				{/* Top section: Subject Tag + Assignment Content */}
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						flex: 1,
						backgroundColor: 'transparent',
					}}
				>
					{/* Subject Tag */}
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: '8px',
							marginBottom: '16px',
							justifyContent: 'space-between',
							cursor: 'pointer',
							backgroundColor: 'transparent',
						}}
						onClick={() => history.push(`/hoc-tap/lop-tin-chi/${item.assignment.lopHocPhanId}#bai-tap`)}
					>
						<Text
							style={{
								color: '#1890ff',
								fontSize: isMobile ? '13px' : '14px',
								fontWeight: 500,
								backgroundColor: 'transparent',
								overflow: 'hidden',
								textOverflow: 'ellipsis',
								whiteSpace: 'nowrap',
								maxWidth: '80%',
							}}
						>
							#{item.assignment.tenLopHocPhan}
						</Text>
						<ArrowRightOutlined style={{ fontSize: '12px', color: '#1890ff', flexShrink: 0 }} />
					</div>

					{/* Assignment Content - Giới hạn 3 dòng */}
					<div style={{ flex: 1, minHeight: isMobile ? '60px' : '63px' }}>
						<Text
							style={{
								fontSize: isMobile ? '13px' : '14px',
								color: '#121212',
								lineHeight: '1.5',
								display: '-webkit-box',
								WebkitLineClamp: 2,
								WebkitBoxOrient: 'vertical',
								overflow: 'hidden',
								textOverflow: 'ellipsis',
								fontWeight: 600,
								maxHeight: isMobile ? '58px' : '63px',
							}}
						>
							{item.assignment.noiDung}
						</Text>
					</div>
				</div>

				{/* Bottom section: Files + Deadline */}
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						marginTop: isMobile ? '16px' : '20px',
					}}
				>
					{/* Files Section */}
					{files.length > 0 && (
						<div style={{ marginBottom: isMobile ? '16px' : '20px' }}>
							{files.slice(0, 2).map((fileUrl, fileIndex) => (
								<FileItem key={fileIndex} fileUrl={fileUrl} index={fileIndex} />
							))}
							{files.length > 2 && (
								<Text
									style={{
										fontSize: isMobile ? '12px' : '13px',
										color: '#8c8c8c',
										fontStyle: 'italic',
										marginTop: '4px',
									}}
								>
									...và {files.length - 2} file khác
								</Text>
							)}
						</div>
					)}

					{/* Deadline */}
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							paddingTop: isMobile ? '12px' : '16px',
							borderTop: '1px solid rgba(240, 240, 240, 0.3)',
							gap: '8px',
						}}
					>
						<Text
							style={{
								fontSize: isMobile ? '13px' : '14px',
								color: '#8c8c8c',
								flexShrink: 0,
							}}
						>
							Hạn nộp bài:
						</Text>
						<Text
							style={{
								fontSize: isMobile ? '13px' : '14px',
								fontWeight: 500,
								color: '#262626',
								textAlign: 'right',
							}}
						>
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
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
					gap: isMobile ? '16px' : '1px',
					minHeight: isMobile ? 'auto' : '350px',
					height: isMobile ? 'auto' : '350px',
					borderRadius: 8,
					padding: '0',
					backgroundColor: 'transparent',
					border: isMobile ? 'none' : '1px solid #f0f0f0',
				}}
			>
				{pageItems.map((item, index) => renderAssignmentCard(item, index))}

				{/* Fill empty space if only 1 card on desktop */}
				{pageItems.length === 1 && !isMobile && (
					<div
						style={{
							background: 'transparent',
							borderRadius: '8px',
							border: '1px solid #f0f0f0',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							height: '350px',
							minHeight: 350,
							margin: '0 0.5px',
						}}
					>
						<Empty
							style={{
								margin: 'auto',
							}}
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
			<div
				style={{
					borderRadius: '8px',
					overflow: 'hidden',
					border: 'none',
					backgroundColor: 'transparent',
					padding: isMobile ? '0 8px' : '0',
				}}
			>
				{/* Header */}
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						backgroundColor: 'transparent',
						flexWrap: isMobile ? 'wrap' : 'nowrap',
						gap: isMobile ? '12px' : '0',
					}}
				>
					<Text
						className='card-baitap-title'
						style={{
							fontSize: isMobile ? '16px' : '18px',
							fontWeight: 600,
							color: '#000',
							padding: '16px 0',
							backgroundColor: 'transparent',
							flexShrink: 0,
						}}
					>
						Bài tập, bài kiểm tra
					</Text>
					<Space size={isMobile ? 'small' : 'middle'} style={{ gap: 8 }}>
						<Button
							type='text'
							icon={<SlideButtonIcon direction='left' disabled={filteredData.length == 0} />}
							disabled
							style={{
								color: '#bfbfbf',
								backdropFilter: 'blur(2px)',
								WebkitBackdropFilter: 'blur(2px)',
							}}
						/>
						<Button
							type='text'
							icon={<SlideButtonIcon direction='right' disabled={filteredData.length == 0} />}
							disabled
							style={{
								color: '#bfbfbf',
								backdropFilter: 'blur(2px)',
								WebkitBackdropFilter: 'blur(2px)',
							}}
						/>
						<XemTatCaLink to='/hoc-tap/lop-tin-chi' />
					</Space>
				</div>

				{/* Content - Empty State */}
				<div
					style={{
						overflow: 'hidden',
						backgroundColor: '#fff',
						borderRadius: 8,
						backgroundImage: isMobile ? 'none' : `url(${assignmentBg})`,
						backgroundPosition: 'right',
						backgroundRepeat: 'no-repeat',
						backgroundSize: 'contain',
						boxShadow: '0px 0px 6px 0px #0000000A',
					}}
				>
					<div
						style={{
							gap: '1px',
							minHeight: isMobile ? '200px' : '350px',
							borderRadius: 8,
							padding: '0',
							backgroundColor: 'transparent',
						}}
					>
						<div
							style={{
								background: 'transparent',
								borderRadius: '8px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								height: isMobile ? '200px' : '350px',
								margin: '0 0.5px',
							}}
						>
							<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Không có bài tập' />
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div
			style={{
				borderRadius: '8px',
				overflow: 'hidden',
				border: 'none',
				backgroundColor: 'transparent',
				padding: isMobile ? '6px' : '0',
			}}
		>
			{/* Header */}
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					backgroundColor: 'transparent',
					flexWrap: isMobile ? 'wrap' : 'nowrap',
					gap: isMobile ? '12px' : '0',
				}}
			>
				<Text
					style={{
						fontSize: isMobile ? '16px' : '18px',
						fontWeight: 600,
						color: '#000',
						padding: '16px 0',
						backgroundColor: 'transparent',
						flexShrink: 0,
					}}
				>
					Bài tập, bài kiểm tra
				</Text>
				<Space size={isMobile ? 'small' : 'middle'} style={{ gap: 8 }}>
					<Button
						type='text'
						icon={<SlideButtonIcon direction='left' disabled={currentPage === 0} />}
						onClick={handlePrevious}
						disabled={currentPage === 0}
						style={{
							color: currentPage === 0 ? '#bfbfbf' : '#666',
							backgroundColor: 'rgba(255, 255, 255, 0.7)',
							backdropFilter: 'blur(2px)',
							WebkitBackdropFilter: 'blur(2px)',
						}}
					/>
					<Button
						type='text'
						icon={<SlideButtonIcon direction='right' disabled={currentPage >= totalPages - 1} />}
						onClick={handleNext}
						disabled={currentPage >= totalPages - 1}
						style={{
							color: currentPage >= totalPages - 1 ? '#bfbfbf' : '#666',
							backgroundColor: 'rgba(255, 255, 255, 0.7)',
							backdropFilter: 'blur(2px)',
							WebkitBackdropFilter: 'blur(2px)',
						}}
					/>
					<XemTatCaLink to='/hoc-tap/lop-tin-chi' />
				</Space>
			</div>

			{/* Content - Carousel */}
			<div
				style={{
					overflow: 'hidden',
					backgroundColor: '#fff',
					borderRadius: 8,
					boxShadow: '0px 0px 6px 0px #0000000A',
				}}
			>
				<Carousel
					ref={setCarouselRef}
					dots={false}
					infinite={false}
					speed={300}
					easing='ease-in-out'
					afterChange={handleSlideChange}
					style={{
						backgroundImage: isMobile ? 'none' : `url(${assignmentBg})`,
						borderRadius: 8,
						backgroundPosition: 'right',
						backgroundRepeat: 'no-repeat',
						backgroundSize: 'contain',
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
				visible={previewModal.visible}
				onCancel={() => setPreviewModal({ ...previewModal, visible: false })}
				width='90%'
				style={{ top: 20 }}
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
				<div style={{ height: '70vh' }}>
					{previewModal.fileType === 'pdf' ? (
						<PDFViewerV2 url={previewModal.fileUrl} height='100%' />
					) : (
						<div style={{ textAlign: 'center', padding: '50px' }}>
							<Text>Không hỗ trợ xem trước loại file này</Text>
						</div>
					)}
				</div>
			</Modal>
		</div>
	);
};

export default CardBaiTapDashboard;
