import { DownloadOutlined, EyeOutlined, MoreOutlined } from '@ant-design/icons';
import { Button, Card, Empty, List, Modal, Popover, Segmented, Typography } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Link, useModel } from 'umi';

const { Text } = Typography;

interface IProps {
	lopHocPhanId: string;
}

const CardBaiTapLopHp = ({ lopHocPhanId }: IProps) => {
	const { getModel, danhSach, loading, setVisibleForm, setRecord } = useModel('daotao.baitap');
	const [segment, setSegment] = useState<string>('1');
	const [previewModal, setPreviewModal] = useState({
		visible: false,
		fileUrl: '',
		fileName: '',
		fileType: '',
	});

	const fetchData = () => {
		if (lopHocPhanId) {
			getModel(
				undefined,
				undefined,
				undefined,
				undefined,
				undefined,
				`lop-hoc-phan/${lopHocPhanId}/me/${segment === '1' ? 'dang-dien-ra' : 'da-ket-thuc'}`,
			);
		}
	};

	useEffect(() => {
		fetchData();
	}, [lopHocPhanId, segment]);

	const getFileNameFromUrl = (url: string): string => {
		try {
			const urlObj = new URL(url);
			const pathname = urlObj.pathname;
			return decodeURIComponent(pathname.split('/').pop() || 'file');
		} catch {
			return url.split('/').pop() || 'file';
		}
	};

	const handleDownloadFile = (url: string, fileName: string) => {
		const link = document.createElement('a');
		link.href = url;
		link.download = fileName;
		link.target = '_blank';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const handlePreviewFile = (url: string, fileName: string) => {
		const fileType = fileName.split('.').pop()?.toLowerCase() || '';
		setPreviewModal({
			visible: true,
			fileUrl: url,
			fileName,
			fileType,
		});
	};

	const FileActionPopover = ({ fileUrl, fileName }: { fileUrl: string; fileName: string }) => {
		const fileType = fileName.split('.').pop()?.toLowerCase() || '';
		const canPreview = ['pdf'].includes(fileType);

		const fileActions = [
			{ key: 'download', label: 'Tải xuống', icon: <DownloadOutlined /> },
			...(canPreview ? [{ key: 'preview', label: 'Xem trước', icon: <EyeOutlined /> }] : []),
		];

		const handleAction = (key: string) => {
			if (key === 'download') handleDownloadFile(fileUrl, fileName);
			else if (key === 'preview') handlePreviewFile(fileUrl, fileName);
		};

		return (
			<Popover
				content={
					<List
						size='small'
						dataSource={fileActions}
						renderItem={(item) => (
							<List.Item style={{ cursor: 'pointer' }} onClick={() => handleAction(item.key)}>
								{item.icon} {item.label}
							</List.Item>
						)}
					/>
				}
				trigger='click'
			>
				<Button type='text' icon={<MoreOutlined />} />
			</Popover>
		);
	};

	return (
		<Card
			title='Bài tập, bài kiểm tra'
			variant='borderless'
			headStyle={{ border: 'none' }}
			style={{ borderRadius: '8px', boxShadow: '0px 0px 12px 0px #0000000A' }}
			extra={
				<Segmented
					options={[
						{ label: 'Đang diễn ra', value: '1' },
						{ label: 'Đã kết thúc', value: '2' },
					]}
					value={segment}
					onChange={(value) => setSegment(value as string)}
					size='small'
				/>
			}
		>
			{loading ? (
				<div style={{ textAlign: 'center', padding: '40px 0' }}>
					<Text>Đang tải dữ liệu...</Text>
				</div>
			) : danhSach?.length === 0 ? (
				<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Không có bài tập' />
			) : (
				<div
					className='card-boderless'
					style={{
						maxHeight: 400,
						overflowY: 'auto',
						paddingRight: 8,
						msOverflowStyle: 'none', // IE, Edge
						scrollbarWidth: 'none', // Firefox
						margin: '-16px',
						boxShadow: '0px 0px 6px 0px #0000000A',
					}}
				>
					<div style={{ display: 'flex', flexDirection: 'column', gap: 16, borderRadius: '0px' }}>
						{danhSach.map((item) => {
							const files = item.assignment?.urlTepDinhKem || [];
							return (
								<Card
									key={item._id}
									size='small'
									style={{
										border: 'none',
										borderBottom: '1px solid #ddd',
										borderRadius: '0px',
									}}
								>
									<Text strong style={{ fontSize: 15 }}>
										{item.assignment?.noiDung}
									</Text>

									{files.length > 0 && (
										<div style={{ marginTop: 12 }}>
											{files.slice(0, 2).map((url, idx) => {
												const fileName = getFileNameFromUrl(url);
												return (
													<div
														key={idx}
														style={{
															display: 'flex',
															justifyContent: 'space-between',
															alignItems: 'center',
															backgroundColor: '#EFF1F9',
															padding: '6px 12px',
															borderRadius: 6,
															marginBottom: 8,
														}}
													>
														<Text>{fileName}</Text>
														<FileActionPopover fileUrl={url} fileName={fileName} />
													</div>
												);
											})}
											{files.length > 2 && (
												<Text type='secondary' italic style={{ display: 'block', marginTop: 4 }}>
													...và {files.length - 2} file khác
												</Text>
											)}
										</div>
									)}

									<div
										style={{ marginTop: 12, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
									>
										<Text type='secondary'>Hạn nộp bài: </Text>
										<Text strong>{moment(item.assignment?.thoiGianKetThuc).format('HH:mm DD/MM/YYYY')}</Text>
									</div>

									<div style={{ marginTop: 16 }}>
										<Link to={`/hoc-tap/lop-tin-chi/${lopHocPhanId}#bai-tap`}>Xem chi tiết</Link>
									</div>
								</Card>
							);
						})}
					</div>
				</div>
			)}

			{/* Modal xem trước */}
			<Modal
				title={`Xem trước: ${previewModal.fileName}`}
				open={previewModal.visible}
				onCancel={() => setPreviewModal({ ...previewModal, visible: false })}
				footer={null}
				width='80%'
			>
				{previewModal.fileType === 'pdf' ? (
					<iframe
						src={previewModal.fileUrl}
						style={{ width: '100%', height: '70vh', border: 'none' }}
						title='PDF Preview'
					/>
				) : (
					<Text>Không hỗ trợ xem trước loại file này.</Text>
				)}
			</Modal>
		</Card>
	);
};

export default CardBaiTapLopHp;
