import FormKhaiBao from '@/pages/KhaiBaoQuyTrinh/components/FormKhaiBao';
import ViewThongTinChung from '@/pages/KhaiBaoQuyTrinh/components/ViewThongTinChung';
import { createDonKhaiBaoUser } from '@/services/QuyTrinh/KhaiBao/khaibaoquytrinh';
import { ENguonDot } from '@/services/QuyTrinh/constant';
import type { QuyTrinh } from '@/services/QuyTrinh/typings';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Button, Card, Modal, Pagination, Popconfirm, Tag, Typography, message } from 'antd';
import { useEffect, useState } from 'react';
import { history, useModel } from 'umi';
import './style.less';

const { Title, Text } = Typography;

const QuyTrinhPage = () => {
	const { visibleForm, setVisibleForm, setCurrent, setCurrentFormKhaiBao } = useModel('quytrinh.khaibaoquytrinh');
	const {
		getModel: getQuyTrinh,
		setLoading,
		record: recordQuyTrinh,
		setRecord: setRecordQuyTrinh,
		danhSach: danhSachQuyTrinh,
		loading,
		page,
		limit,
		total,
		setPage,
		setLimit,
	} = useModel('quytrinh.quytrinh');
	const { getAllMyDotModel } = useModel('quytrinh.dotkhaibao');
	const [quyTrinhIdSelect, setQuyTrinhIdSelect] = useState<string>('');
	const [visibleThongTinChung, setVisibleThongTinChung] = useState<boolean>(false);
	const [recordThongTinChung, setRecordThongTinChung] = useState<QuyTrinh.IDanhSachCauHinhThongTinChung[]>([]);

	useEffect(() => {
		setCurrentFormKhaiBao(undefined);
		setCurrent(undefined);
		getDataQuyTrinh();
	}, []);

	// Thêm useEffect để lắng nghe thay đổi page và limit
	useEffect(() => {
		getDataQuyTrinh();
	}, [page, limit]);

	const handleRedirect = async (quyTrinh: QuyTrinh.IRecord) => {
		try {
			setLoading(true);
			if (quyTrinh.cauHinhDotQuyTrinh.nguonDot === ENguonDot.KHONG_CO_DOT) {
				const res2 = await createDonKhaiBaoUser(quyTrinh._id, 'SINH_VIEN');
				if (res2) {
					history.push(`/khai-bao-quy-trinh/${res2?.data?.data?._id}?quyTrinh=${quyTrinh._id}`);
				}
				return;
			}
			const res = await getAllMyDotModel(quyTrinh._id);
			if (res) {
				if (res.length === 1) {
					const res2 = await createDonKhaiBaoUser(quyTrinh._id, 'SINH_VIEN', res?.[0]?._id);
					if (res2) {
						history.push(`/khai-bao-quy-trinh/${res2?.data?.data?._id}?quyTrinh=${quyTrinh._id}`);
					}
				} else {
					if (res.length > 1) {
						setQuyTrinhIdSelect(quyTrinh._id);
						setVisibleForm(true);
					} else {
						message.warn('Chưa có đợt');
					}
				}
			}
		} catch (e) {
			console.log(e);
		} finally {
			setLoading(false);
		}
	};

	const getDataQuyTrinh = () => {
		getQuyTrinh(
			{ linhVuc: 'Dịch vụ hành chính', active: true },
			undefined,
			{ order: -1 },
			undefined,
			undefined,
			'page/SINH_VIEN',
			{ page, limit: limit || 10 }, // Mặc định là 10 nếu limit chưa được set
		);
	};

	const getStatusColor = (order: number) => {
		if (order >= 2 && order < 5) return 'green'; // Top 2 - Phổ biến nhất
		if (order >= 5 && order < 10) return 'orange'; // Top 3-5 - Đang tăng cao
		if (order >= 10) return 'blue'; // Top 6-10 - Quan trọng
		return 'red'; // Còn lại - Thông thường
	};

	const getStatusText = (order: number) => {
		if (order >= 2 && order < 5) return 'Quan trọng';
		if (order >= 5 && order < 10) return 'Đang tăng cao';
		if (order >= 10) return 'Phổ biến nhất';
		return 'Thông thường';
	};

	const handlePaginationChange = (newPage: number, newPageSize: number) => {
		// Nếu pageSize thay đổi, reset về trang 1
		if (newPageSize !== limit) {
			setPage(1);
			setLimit(newPageSize);
		} else {
			setPage(newPage);
		}
	};

	// Thêm function xử lý khi thay đổi page size
	const handlePageSizeChange = (current: number, size: number) => {
		setPage(1); // Reset về trang 1 khi thay đổi page size
		setLimit(size);
	};

	return (
		<>
			<div className='quy-trinh-page'>
				<Title level={4} className='page-title'>
					Biểu mẫu dịch vụ
				</Title>

				{/* Hiển thị loading state */}
				{loading ? (
					<div className='loading-container'>
						<Text>Đang tải dữ liệu...</Text>
					</div>
				) : (
					<>
						{/* Danh sách quy trình */}
						{danhSachQuyTrinh && danhSachQuyTrinh.length > 0 ? (
							<div className='quy-trinh-grid'>
								{danhSachQuyTrinh.map((quyTrinh: QuyTrinh.IRecord, index: number) => (
									<Card key={quyTrinh._id} className='quy-trinh-card' bodyStyle={{ padding: '16px' }}>
										<div className='card-content'>
											<div className='card-main'>
												<div className='card-icon'>
													<img src='/images/folder-icon.png' alt='' width={24} />
												</div>

												<div className='card-info'>
													<div className='card-tags'>
														<Tag color={getStatusColor(quyTrinh.order)} className='status-tag'>
															● {getStatusText(quyTrinh.order)}
														</Tag>
													</div>
													<Text className='card-title'>{quyTrinh.ten}</Text>
												</div>
											</div>

											<div>
												{quyTrinh?.danhSachCauHinhThongTinChung &&
												quyTrinh?.danhSachCauHinhThongTinChung?.length > 0 ? (
													<Button
														type='primary'
														onClick={() => {
															setRecordThongTinChung(quyTrinh?.danhSachCauHinhThongTinChung);
															setRecordQuyTrinh(quyTrinh);
															setVisibleThongTinChung(true);
														}}
														className='use-button'
													>
														Sử dụng
													</Button>
												) : (
													<Popconfirm
														title='Bạn có muốn sử dụng dịch vụ này?'
														onConfirm={() => handleRedirect(quyTrinh)}
														okText='Sử dụng'
														cancelText='Đóng'
													>
														<Button type='primary' className='use-button'>
															Sử dụng
														</Button>
													</Popconfirm>
												)}
											</div>
										</div>
									</Card>
								))}
							</div>
						) : (
							<div className='empty-state'>
								<Text type='secondary'>Không tìm thấy biểu mẫu nào</Text>
							</div>
						)}
					</>
				)}

				{/* Phân trang - chỉ hiển thị khi có dữ liệu */}
				{total > 0 && (
					<div className='pagination-container'>
						<Pagination
							current={page}
							pageSize={limit || 10}
							total={total}
							onChange={handlePaginationChange}
							onShowSizeChange={handlePageSizeChange}
							// showSizeChanger
							// showQuickJumper
							// showTotal={(total, range) => (
							// 	<span style={{ marginRight: '16px' }}>
							// 		{range[0]}-{range[1]} của {total} mục
							// 	</span>
							// )}
							pageSizeOptions={['5', '10', '20', '50']}
							disabled={loading} // Disable phân trang khi đang loading
							size='default'
							className='pagination'
						/>
					</div>
				)}
			</div>

			<Modal
				title={'Chọn đợt khai báo'}
				width={500}
				open={visibleForm}
				onCancel={() => setVisibleForm(false)}
				footer={null}
				destroyOnClose
			>
				<FormKhaiBao quyTrinhId={quyTrinhIdSelect} />
			</Modal>

			<Modal
				title={'Thông tin chung'}
				width={1000}
				open={visibleThongTinChung}
				onCancel={() => setVisibleThongTinChung(false)}
				footer={
					<Button
						icon={<ArrowRightOutlined />}
						type={'primary'}
						onClick={() => {
							if (recordQuyTrinh) handleRedirect(recordQuyTrinh);
						}}
					>
						Tiếp theo
					</Button>
				}
				destroyOnClose
			>
				<ViewThongTinChung dataThongTinChung={recordThongTinChung} />
			</Modal>
		</>
	);
};

export default QuyTrinhPage;
