import { primaryColor } from '@/services/base/constant';
import { colorLoaiHocLuc } from '@/services/HocTap/constant';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Card, Col, Row, Tooltip } from 'antd';
import { useIntl, useModel } from 'umi';

const StatKetQuaTichLuySinhVien = () => {
	const intl = useIntl();
	const { record } = useModel('daotao.ketquahocky');

	if (!record?._id) return <></>;
	return (
		<Row gutter={[12, 12]}>
			<Col span={24} xxl={12}>
				<Card className='ket-qua-card'>
					<div className='ket-qua-content'>
						<div className='title'>{intl.formatMessage({ id: 'ketquahoctap.stat.ketqua' })}</div>
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
									{intl.formatMessage({ id: 'ketquahoctap.stat.tbc' })}
								</div>
							</Col>
							<Col span={24} md={8}>
								<div className='row'>
									<span className='sum-text' style={{ color: '#9bd437' }}>
										{record.tongSoTinChiTichLuyToanKhoa ?? '--'}
									</span>
									{intl.formatMessage({ id: 'ketquahoctap.stat.tichluy' })}
								</div>
							</Col>
							<Col span={24} md={8}>
								<div className='row'>
									<span className='sum-text' style={{ color: '#fc7e4d' }}>
										{record.tongSoTinChiNoToanKhoa ?? '--'}
									</span>
									{intl.formatMessage({ id: 'ketquahoctap.stat.toankhoa' })}
									<Tooltip title={intl.formatMessage({ id: 'ketquahoctap.stat.toankhoa.tooltip' })}>
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
						<div className='title'>{intl.formatMessage({ id: 'ketquahoctap.stat.trinhdo' })}</div>
						<span className='sum-text'>{record.trinhDo ?? '--'}</span>
					</div>
				</Card>
			</Col>
			<Col span={24} md={12} xxl={6}>
				<Card className='ket-qua-card'>
					<div className='ket-qua-content'>
						<div className='title'>{intl.formatMessage({ id: 'ketquahoctap.stat.xeploai' })}</div>
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
