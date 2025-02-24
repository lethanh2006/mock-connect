import { primaryColor } from '@/services/base/constant';
import { colorLoaiHocLuc } from '@/services/HocTap/constant';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Card, Col, Row, Tooltip } from 'antd';
import { useModel } from 'umi';

const StatKetQuaTichLuySinhVien = () => {
	const { record } = useModel('daotao.ketquahocky');

	if (!record?._id) return <></>;
	return (
		<Row gutter={[12, 12]}>
			<Col span={24} xxl={12}>
				<Card className='ket-qua-card'>
					<div className='ket-qua-content'>
						<div className='title'>Kết quả tích lũy</div>
						<Row gutter={[8, 0]}>
							{/* <Col span={24} lg={12}>
								<div className='row'>
									<span className='sum-text'>{record.trungBinhTichLuyToanKhoa ?? '--'}</span>
									TBC tích lũy (hệ 10)
								</div>
							</Col> */}
							<Col span={24} md={8}>
								<div className='row'>
									<span className='sum-text'>{record.trungBinhTichLuyToanKhoaThang4 ?? '--'}</span>
									TBC tích lũy (hệ 4)
								</div>
							</Col>
							<Col span={24} md={8}>
								<div className='row'>
									<span className='sum-text'>{record.tongSoTinChiTichLuyToanKhoa ?? '--'}</span>
									Tổng số tín chỉ tích lũy
								</div>
							</Col>
							<Col span={24} md={8}>
								<div className='row'>
									<span className='sum-text'>{record.tongSoTinChiNoToanKhoa ?? '--'}</span>
									Tổng STC chưa đạt toàn khóa
									<Tooltip title='Tổng số tín chỉ các học phần sinh viên đã tham gia học tập nhưng kết quả học tập chưa đạt trong toàn khóa'>
										<InfoCircleOutlined style={{ color: primaryColor }} />
									</Tooltip>
								</div>
							</Col>
						</Row>
					</div>
				</Card>
			</Col>

			<Col span={24} md={12} xxl={6}>
				<Card className='ket-qua-card'>
					<div className='ket-qua-content'>
						<div className='title'>Trình độ (theo KQHT hiện tại)</div>
						<span className='sum-text'>{record.trinhDo ?? '--'}</span>
					</div>
				</Card>
			</Col>
			<Col span={24} md={12} xxl={6}>
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
	);
};

export default StatKetQuaTichLuySinhVien;
