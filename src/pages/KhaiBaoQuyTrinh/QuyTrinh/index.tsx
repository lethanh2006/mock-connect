import FormKhaiBao from '@/pages/KhaiBaoQuyTrinh/components/FormKhaiBao';
import ViewThongTinChung from '@/pages/KhaiBaoQuyTrinh/components/ViewThongTinChung';
import { createDonKhaiBaoUser } from '@/services/QuyTrinh/KhaiBao/khaibaoquytrinh';
import { ENguonDot } from '@/services/QuyTrinh/constant';
import type { QuyTrinh } from '@/services/QuyTrinh/typings';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Button, Card, Modal, Pagination, Popconfirm, Tag, Typography, message } from 'antd';
import { useEffect, useState } from 'react';
import { history, useModel } from 'umi';

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
			<div style={{ padding: '16px' }}>
				<Title level={4} style={{ marginBottom: '24px' }}>
					Biểu mẫu dịch vụ
				</Title>

				{/* Hiển thị loading state */}
				{loading ? (
					<div style={{ textAlign: 'center', padding: '40px' }}>
						<Text>Đang tải dữ liệu...</Text>
					</div>
				) : (
					<>
						{/* Danh sách quy trình */}
						{danhSachQuyTrinh && danhSachQuyTrinh.length > 0 ? (
							<div style={{ display: 'grid', gap: '16px' }}>
								{danhSachQuyTrinh.map((quyTrinh: QuyTrinh.IRecord, index: number) => (
									<Card
										key={quyTrinh._id}
										style={{
											borderRadius: '8px',
											border: '1px solid #f0f0f0',
											boxShadow: '0px 0px 12px 0px #0000000A',
										}}
										bodyStyle={{ padding: '16px' }}
									>
										<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
											<div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
												<div
													style={{
														width: '40px',
														height: '40px',
														backgroundColor: '#FFF2F2',
														borderRadius: '4px',
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
														color: 'white',
														fontSize: '16px',
													}}
												>
													<img src='/images/folder-icon.png' alt='' width={24} />
												</div>

												<div style={{ flex: 1 }}>
													<div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
														<Tag
															color={getStatusColor(quyTrinh.order)}
															style={{
																borderRadius: '12px',
																fontSize: '12px',
																fontWeight: 500,
																border: 'none',
															}}
														>
															● {getStatusText(quyTrinh.order)}
														</Tag>
													</div>
													<Text
														style={{
															fontSize: '14px',
															fontWeight: 600,
															color: '#1f1f1f',
															textTransform: 'uppercase',
															letterSpacing: '0.5px',
														}}
													>
														{quyTrinh.ten}
													</Text>
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
														style={{
															backgroundColor: '#FDE6E6',
															color: '#DA2128',
															borderRadius: '6px',
															fontWeight: 500,
															height: '36px',
															paddingLeft: '16px',
															paddingRight: '16px',
														}}
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
														<Button
															type='primary'
															style={{
																backgroundColor: '#FDE6E6',
																color: '#DA2128',
																borderRadius: '6px',
																fontWeight: 500,
																height: '36px',
																paddingLeft: '16px',
																paddingRight: '16px',
															}}
														>
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
							<div style={{ textAlign: 'center', padding: '40px' }}>
								<Text type='secondary'>Không tìm thấy biểu mẫu nào</Text>
							</div>
						)}
					</>
				)}

				{/* Phân trang - chỉ hiển thị khi có dữ liệu */}
				{total > 0 && (
					<div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center' }}>
						<Pagination
							current={page}
							pageSize={limit || 10}
							total={total}
							onChange={handlePaginationChange}
							onShowSizeChange={handlePageSizeChange}
							showSizeChanger
							showQuickJumper
							showTotal={(total, range) => (
								<span style={{ marginRight: '16px' }}>
									{range[0]}-{range[1]} của {total} mục
								</span>
							)}
							pageSizeOptions={['5', '10', '20', '50']}
							disabled={loading} // Disable phân trang khi đang loading
							size='default'
							style={{ marginTop: '16px' }}
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
