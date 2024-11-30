import { colorLoaiHocLuc } from '@/services/HocTap/constant';
import { Card, Col, Empty, Row, Spin } from 'antd';
import { useModel } from 'umi';
import '../KetQuaToanKhoa/style.less';

const ViewKetQuaHocKy = () => {
	const { record, loading } = useModel('daotao.ketquahocky');

	return (
		<>
			<Spin spinning={loading}>
				{record?._id ? (
					<>
						<Row gutter={[12, 12]}>
							<Col span={24} md={12}>
								<Card className='ket-qua-card'>
									<div className='ket-qua-content'>
										<div className='title'>Kết quả học kỳ</div>
										<Row gutter={[8, 0]}>
											{/* <Col span={24} xxl={12}>
												<div className='row'>
													<span className='sum-text'>{record.trungBinhHocKy ?? '--'}</span>
													{intl.formatMessage({ id: 'ketquahoctap.ketquahocky.trungbinhhocky10' })}
												</div>
											</Col> */}
											<Col span={24} xxl={12}>
												<div className='row'>
													<span className='sum-text'>{record.trungBinhHocKyThang4 ?? '--'}</span>
													Trung bình học kỳ (hệ 4)
												</div>
											</Col>
											<Col span={24} xxl={12}>
												<div className='row'>
													<span className='sum-text'>{record.trungBinhHocBongHocKyThang4 ?? '--'}</span>
													Trung bình học bổng
												</div>
											</Col>
											<Col span={24} xxl={12}>
												<div className='row'>
													<span className='sum-text'>{record.tongSoTinChiTichLuyHocKy ?? '--'}</span>
													Số tín chỉ tích lũy học kỳ
												</div>
											</Col>
											{/* <Col span={24} xxl={12}>
												<div className='row'>
													<span className='sum-text'>{record.tongSoTinChiNoHocKy ?? '--'}</span>
													{intl.formatMessage({ id: 'ketquahoctap.ketquahocky.tinchino' })}
												</div>
											</Col> */}
										</Row>
									</div>
								</Card>
							</Col>

							<Col span={24} md={12}>
								<Card className='ket-qua-card'>
									<div className='ket-qua-content'>
										<div className='title'>Kết quả tích lũy</div>
										<Row gutter={[8, 0]}>
											{/* <Col span={24} xxl={12}>
												<div className='row'>
													<span className='sum-text'>{record.trungBinhTichLuyToanKhoa ?? '--'}</span>
													{intl.formatMessage({ id: 'ketquahoctap.ketquahocky.trungbinhtichluy10' })}
												</div>
											</Col> */}
											<Col span={24} xxl={12}>
												<div className='row'>
													<span className='sum-text'>{record.trungBinhTichLuyToanKhoaThang4 ?? '--'}</span>
													TBC tích lũy (hệ 4)
												</div>
											</Col>
											<Col span={24} xxl={12}>
												<div className='row'>
													<span className='sum-text'>{record.tongSoTinChiTichLuyToanKhoa ?? '--'}</span>
													Tổng số tín chỉ tích luỹ
												</div>
											</Col>
											<Col span={24} xxl={12}>
												<div className='row'>
													<span className='sum-text'>{record.tongSoTinChiNoToanKhoa ?? '--'}</span>
													STC chưa đạt toàn khóa
												</div>
											</Col>
										</Row>
									</div>
								</Card>
							</Col>

							<Col span={24} md={12}>
								<Card className='ket-qua-card'>
									<div className='ket-qua-content'>
										<div className='title'>Trình độ (theo KQHT hiện tại)</div>
										<span className='sum-text'>{record.trinhDo ?? '--'}</span>
									</div>
								</Card>
							</Col>
							<Col span={24} md={12}>
								<Card className='ket-qua-card'>
									<div className='ket-qua-content'>
										<div className='title'>Xếp loại học lực</div>
										<span className='sum-text' style={{ color: colorLoaiHocLuc[record.hocLuc] }}>
											{record.hocLuc ?? '--'}
										</span>
									</div>
								</Card>
							</Col>
						</Row>
					</>
				) : (
					<Empty description='Không có dữ liệu trung bình học kỳ!' style={{ marginTop: 50, marginBottom: 32 }} />
				)}
			</Spin>
		</>
	);
};

export default ViewKetQuaHocKy;
