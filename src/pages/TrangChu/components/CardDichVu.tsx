import FormKhaiBao from '@/pages/KhaiBaoQuyTrinh/components/FormKhaiBao';
import ViewThongTinChung from '@/pages/KhaiBaoQuyTrinh/components/ViewThongTinChung';
import XemTatCaLink from '@/pages/TrangChu/components/ViewMore';
import { createDonKhaiBaoUser } from '@/services/QuyTrinh/KhaiBao/khaibaoquytrinh';
import { ENguonDot } from '@/services/QuyTrinh/constant';
import type { QuyTrinh } from '@/services/QuyTrinh/typings';
import { ArrowRightOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Card, Col, message, Modal, Popconfirm, Row, Skeleton, Space, Tooltip } from 'antd';

import { useEffect, useState } from 'react';
import { history, useModel } from 'umi';

const CardDichVuSinhVien = () => {
	const {
		getModel: getQuyTrinh,
		loading,
		danhSach: danhSachQuyTrinh,
		setLoading,
		record: recordQuyTrinh,
		setRecord: setRecordQuyTrinh,
	} = useModel('quytrinh.quytrinh');

	const { visibleForm, setVisibleForm, setCurrent, setCurrentFormKhaiBao, setDataQuyTrinh } =
		useModel('quytrinh.khaibaoquytrinh');
	const { getAllMyDotModel } = useModel('quytrinh.dotkhaibao');

	const [quyTrinhIdSelect, setQuyTrinhIdSelect] = useState<string>('');
	const [visibleThongTinChung, setVisibleThongTinChung] = useState<boolean>(false);
	const [recordThongTinChung, setRecordThongTinChung] = useState<QuyTrinh.IDanhSachCauHinhThongTinChung[]>([]);

	const documentIc = 'images/document-background.png';
	const playIc = 'images/play-icon.png';

	useEffect(() => {
		// Reset states khi component mount
		setCurrentFormKhaiBao(undefined);
		setCurrent(undefined);
		setDataQuyTrinh(undefined);

		// Fetch dữ liệu khi component mount
		console.log('Fetching quy trinh data for CardDichVuSinhVien');
		getQuyTrinh(
			{ linhVuc: 'Dịch vụ hành chính', active: true },
			undefined,
			{ order: -1 },
			undefined,
			undefined,
			'page/SINH_VIEN',
		);
	}, []);

	const handleRedirect = async (quyTrinh: QuyTrinh.IRecord) => {
		try {
			setLoading(true);

			// Kiểm tra xem quyTrinh có tồn tại và có _id không
			if (!quyTrinh || !quyTrinh._id) {
				message.error('Thông tin quy trình không hợp lệ');
				return;
			}

			if (quyTrinh.cauHinhDotQuyTrinh?.nguonDot === ENguonDot.KHONG_CO_DOT) {
				console.log('Creating don khai bao without dot for quyTrinh:', quyTrinh._id);
				const res2 = await createDonKhaiBaoUser(quyTrinh._id, 'SINH_VIEN');

				if (res2?.data?.data?._id) {
					console.log('Created don khai bao:', res2.data.data._id);
					history.push(`/khai-bao-quy-trinh/${res2.data.data._id}?quyTrinh=${quyTrinh._id}`);
				} else {
					console.error('Failed to create don khai bao:', res2);
					message.error('Không thể tạo đơn khai báo. Vui lòng thử lại.');
				}
				return;
			}

			console.log('Getting dots for quyTrinh:', quyTrinh._id);
			const res = await getAllMyDotModel(quyTrinh._id);

			if (res && Array.isArray(res)) {
				if (res.length === 1) {
					console.log('Creating don khai bao with dot:', res[0]._id);
					const res2 = await createDonKhaiBaoUser(quyTrinh._id, 'SINH_VIEN', res[0]._id);

					if (res2?.data?.data?._id) {
						console.log('Created don khai bao:', res2.data.data._id);
						history.push(`/khai-bao-quy-trinh/${res2.data.data._id}?quyTrinh=${quyTrinh._id}`);
					} else {
						console.error('Failed to create don khai bao:', res2);
						message.error('Không thể tạo đơn khai báo. Vui lòng thử lại.');
					}
				} else if (res.length > 1) {
					console.log('Multiple dots found, showing selection modal');
					setQuyTrinhIdSelect(quyTrinh._id);
					setVisibleForm(true);
				} else {
					console.log('No dots found');
					message.error('Chưa có đợt khai báo nào khả dụng');
				}
			} else {
				console.error('Invalid response from getAllMyDotModel:', res);
				message.error('Không thể lấy thông tin đợt khai báo');
			}
		} catch (e) {
			console.error('Error in handleRedirect:', e);
			message.error('Có lỗi xảy ra khi xử lý yêu cầu. Vui lòng thử lại.');
		} finally {
			setLoading(false);
		}
	};

	const handleServiceClick = (quyTrinh: QuyTrinh.IRecord) => {
		console.log('Clicked service:', quyTrinh.ten, 'ID:', quyTrinh._id);

		// Kiểm tra quyTrinh có hợp lệ không
		if (!quyTrinh || !quyTrinh._id) {
			message.error('Thông tin dịch vụ không hợp lệ');
			return;
		}

		// Logic xử lý với thông tin chung và Popconfirm
		if (quyTrinh?.danhSachCauHinhThongTinChung && quyTrinh?.danhSachCauHinhThongTinChung?.length > 0) {
			// Nếu có thông tin chung, hiển thị modal thông tin chung trước
			console.log('Showing thong tin chung modal');
			setRecordThongTinChung(quyTrinh.danhSachCauHinhThongTinChung);
			setRecordQuyTrinh(quyTrinh);
			setVisibleThongTinChung(true);
		} else {
			// Nếu không có thông tin chung, hiển thị Popconfirm trước khi redirect
			console.log('No thong tin chung, will show Popconfirm');
			// Popconfirm sẽ được xử lý trong JSX
		}
	};

	const handleConfirmUse = (quyTrinh: QuyTrinh.IRecord) => {
		console.log('Confirmed use of service:', quyTrinh.ten);
		handleRedirect(quyTrinh);
	};

	// Chỉ hiển thị 5 dịch vụ đầu tiên trong card
	const displayServices = danhSachQuyTrinh?.slice(0, 5) || [];

	return (
		<>
			<Card
				className='card-dichvu'
				title={
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							alignContent: 'baseline',
						}}
					>
						<div
							className='title'
							style={{
								display: 'flex',
								alignItems: 'center',
								fontSize: 18,
							}}
						>
							Dịch vụ sinh viên
						</div>

						<XemTatCaLink to='/khai-bao-quy-trinh/dang-ky' />
					</div>
				}
				style={{
					background: 'transparent',
					border: 'none',
					marginBottom: 0,
					boxShadow: 'none',
					height: '100%',
					display: 'flex',
					flex: 1,
					flexDirection: 'column',
					margin: '0 -8px',
					minHeight: 300,
				}}
				headStyle={{
					borderBottom: 'none',
					background: 'transparent',
					marginBottom: 0,
					paddingBottom: 0,
				}}
				bodyStyle={{ paddingTop: 0 }}
			>
				{loading ? (
					<Skeleton
						active
						style={{
							border: '1px solid #ebebeb',
						}}
					/>
				) : (
					<Row
						gutter={[0, 4]}
						style={{
							height: '100%',
							background: '#fff',
							display: 'flex',
							flexDirection: 'column',
							flex: 1,
							padding: 16,
							borderRadius: 8,
							minHeight: 382,
							backgroundImage: `url(${documentIc})`,
							backgroundSize: '75% auto',
							backgroundPosition: 'bottom right',
							backgroundRepeat: 'no-repeat',
							// border: '1px solid #ebebeb',
							boxShadow: '0px 0px 6px 0px #0000000A',
						}}
					>
						{displayServices.length > 0 ? (
							displayServices.map((quyTrinh: QuyTrinh.IRecord, index: number) => (
								<Col
									span={24}
									key={quyTrinh._id}
									style={{
										height: '100%',
										display: 'flex',
										flexDirection: 'column',
										flex: 1,
										minHeight: 72,
									}}
									onMouseEnter={(e) => {
										e.currentTarget.style.transform = 'scale(1.02)';
										e.currentTarget.style.transition = 'all 0.3s ease';
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.transform = 'scale(1)';
									}}
								>
									{/* Kiểm tra xem có thông tin chung hay không để quyết định có dùng Popconfirm */}
									{quyTrinh?.danhSachCauHinhThongTinChung && quyTrinh?.danhSachCauHinhThongTinChung?.length > 0 ? (
										// Nếu có thông tin chung, click trực tiếp
										<div
											className='row'
											onClick={() => handleServiceClick(quyTrinh)}
											style={{
												display: 'flex',
												justifyContent: 'space-between',
												alignItems: 'center',
												padding: '8px 0',
												cursor: 'pointer',
												borderRadius: 4,
												transition: 'background-color 0.2s',
											}}
											onMouseEnter={(e) => {
												e.currentTarget.style.backgroundColor = '#f5f5f5';
											}}
											onMouseLeave={(e) => {
												e.currentTarget.style.backgroundColor = 'transparent';
											}}
										>
											<Space
												style={{
													borderBottom: '2px solid #f0f0f0',
													paddingBottom: 8,
													width: '100%',
													justifyContent: 'space-between',
												}}
											>
												<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
													<Tooltip title={quyTrinh.ten} placement='topLeft'>
														<span
															style={{
																fontSize: '14px',
																fontWeight: 600,
																overflow: 'hidden',
																display: '-webkit-box',
																WebkitLineClamp: 2,
																WebkitBoxOrient: 'vertical',
																lineHeight: '1.4',
																maxHeight: '2.8em', // 2 lines * 1.4 line-height
																wordBreak: 'break-word',
																textOverflow: 'ellipsis',
																width: '100%',
																maxWidth: '300px', // Giới hạn chiều rộng tối đa
															}}
														>
															{quyTrinh.ten}
														</span>
													</Tooltip>
												</div>
											</Space>
											<RightOutlined
												style={{
													color: '#999',
													fontSize: '12px',
													flexShrink: 0, // Không cho phép icon bị co lại
												}}
											/>
										</div>
									) : (
										// Nếu không có thông tin chung, sử dụng Popconfirm
										<Popconfirm
											// title={`Bạn có muốn sử dụng dịch vụ "${quyTrinh.ten}"?`}
											title={`Bạn có muốn sử dụng dịch vụ ?`}
											onConfirm={() => handleConfirmUse(quyTrinh)}
											okText='Sử dụng'
											cancelText='Đóng'
											overlayStyle={{ maxWidth: '500px' }}
											placement='topRight'
										>
											<div
												className='row'
												style={{
													display: 'flex',
													justifyContent: 'space-between',
													alignItems: 'center',
													padding: '8px 2px',
													cursor: 'pointer',
													borderRadius: 4,
													gap: '8px',
													transition: 'background-color 0.2s',
												}}
											>
												<Space
													style={{
														borderBottom: '2px solid #f0f0f0',
														paddingBottom: 8,
														width: '100%',
														justifyContent: 'space-between',
													}}
												>
													<div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
														<Tooltip title={quyTrinh.ten} placement='topLeft'>
															<span
																style={{
																	fontSize: '14px',
																	fontWeight: 600,
																	overflow: 'hidden',
																	display: '-webkit-box',
																	WebkitLineClamp: 2,
																	WebkitBoxOrient: 'vertical',
																	lineHeight: '1.4',
																	maxHeight: '2.8em', // 2 lines * 1.4 line-height
																	wordBreak: 'break-word',
																	textOverflow: 'ellipsis',
																	width: '100%',
																}}
															>
																{quyTrinh.ten}
															</span>
														</Tooltip>
													</div>
												</Space>
												<Button
													type='text'
													icon={<img src={playIc} alt='' width={'100%'} height={'100%'} />}
													style={{
														all: 'unset', // Xóa mọi style mặc định
														cursor: 'pointer',
														display: 'inline-flex',
														alignItems: 'flex-start',
														justifyContent: 'flex-start',
														width: 20,
														height: 20,
														borderRadius: '50%',
														flexShrink: 0, // Không cho phép button bị co lại
													}}
												/>
											</div>
										</Popconfirm>
									)}
								</Col>
							))
						) : (
							<Col
								span={24}
								style={{
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
									height: '100%',
								}}
							>
								<span style={{ color: '#999', fontSize: '14px' }}>Không có dịch vụ nào</span>
							</Col>
						)}
					</Row>
				)}
			</Card>

			{/* Modal chọn đợt khai báo */}
			<Modal
				title={'Chọn đợt khai báo'}
				width={500}
				visible={visibleForm}
				onCancel={() => setVisibleForm(false)}
				footer={null}
				destroyOnClose
			>
				<FormKhaiBao quyTrinhId={quyTrinhIdSelect} />
			</Modal>

			{/* Modal thông tin chung */}
			<Modal
				title={'Thông tin chung'}
				width={1000}
				visible={visibleThongTinChung}
				onCancel={() => setVisibleThongTinChung(false)}
				footer={
					<>
						<Button
							icon={<ArrowRightOutlined />}
							type={'primary'}
							onClick={() => {
								if (recordQuyTrinh) {
									setVisibleThongTinChung(false);
									// Sau khi đóng modal thông tin chung, hiển thị Popconfirm
									setTimeout(() => {
										handleRedirect(recordQuyTrinh);
									}, 100);
								}
							}}
						>
							Tiếp theo
						</Button>
					</>
				}
				destroyOnClose
			>
				<ViewThongTinChung dataThongTinChung={recordThongTinChung} />
			</Modal>
		</>
	);
};

export default CardDichVuSinhVien;
