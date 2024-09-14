import ButtonExtend from '@/components/Table/ButtonExtend';
import {
	colorTrangThaiNopBaiTap,
	type ETrangThaiNopBaiTap,
	mapTrangThaiNopBaiTap,
} from '@/services/DaoTao/BaiTap/constants';
import type { BaiTap } from '@/services/DaoTao/BaiTap/typing';
import { Col, Divider, Row, Space, Tag } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';
import BoxFile from '../../DienDan/components/BoxFile';

interface IProps {
	data: BaiTap.IDanhSachGiaoBaiTap;
}

const CardStatusBaiTap = (props: IProps) => {
	const { data } = props;
	const { handleEdit } = useModel('daotao.baitap');

	return (
		<div className='card relative' style={{ paddingBottom: 12, paddingTop: 8 }}>
			<div className='content'>
				<Row gutter={[12, 12]}>
					<Col xs={{ span: 24, order: 2 }} md={{ span: 17, order: 1 }}>
						<Space>
							<div
								style={{
									color: 'rgb(0, 0, 0)',
									fontWeight: 600,
									fontSize: 16,
								}}
							>
								{data?.assignment?.noiDung}
							</div>{' '}
							{data?.assignment?.isQuiz && <Tag color='blue'>Quiz</Tag>}
						</Space>
					</Col>
					<Col xs={{ span: 24, order: 1 }} md={{ span: 7, order: 2 }} style={{ textAlign: 'center' }}>
						<span style={{ color: APP_CONFIG_PRIMARY_COLOR }}>
							{data?.assignment?.thoiGianLamBaiQuiz ? (
								<span>
									{`${data?.assignment?.thoiGianLamBaiQuiz} phút `}{' '}
									{data?.assignment?.active ? (
										<span>(Hạn {moment(data?.assignment?.thoiGianKetThuc).format('HH:mm DD/MM/YYYY')})</span>
									) : (
										<span style={{ color: 'red' }}>(Chưa kích hoạt)</span>
									)}
								</span>
							) : (
								`Hạn ${moment(data?.assignment?.thoiGianKetThuc).format('HH:mm DD/MM/YYYY')}`
							)}
						</span>
					</Col>
				</Row>

				{data?.assignment?.choPhepCapNhatSauNop && <i>(Cho phép nộp bài sau thời gian hết hạn)</i>}

				<Divider />

				<Row gutter={[12, 12]}>
					<Col xs={24} md={{ span: 7, push: 17 }} style={{ textAlign: 'center' }}>
						<Row gutter={[12, 12]}>
							<Col xs={data?.assignment?.isQuiz ? 12 : 24} md={24}>
								<Tag color={colorTrangThaiNopBaiTap[data.trangThai as ETrangThaiNopBaiTap]}>
									{mapTrangThaiNopBaiTap[data.trangThai as ETrangThaiNopBaiTap]}
								</Tag>
							</Col>
							{data?.assignment?.isQuiz && (
								<Col xs={12} md={24}>
									<div style={{ marginTop: 8, fontSize: 28, fontWeight: 'bold', color: 'green' }}>
										{data?.assignment?.congBoDiemSauNop ? data?.tongDiem ?? '--' : '--'}
									</div>
									<div>Điểm số</div>
								</Col>
							)}
							<Col xs={24}>
								<ButtonExtend type='primary' onClick={() => handleEdit(data)} notHideText>
									Xem chi tiết và làm bài
								</ButtonExtend>
							</Col>
						</Row>
					</Col>

					<Col xs={24} md={{ span: 17, pull: 7 }}>
						<Row gutter={[12, 12]}>
							<Col span={24}>
								<div
									className='noi-dung-post'
									dangerouslySetInnerHTML={{ __html: data?.assignment?.huongDanNop ?? '' }}
								/>
							</Col>

							<Col span={24} style={{ lineHeight: 1 }}>
								<Row gutter={[12, 12]}>
									{data?.assignment?.urlTepDinhKem?.map((val) => (
										<Col span={24} md={12} key={val}>
											<BoxFile url={val} />
										</Col>
									))}
								</Row>
							</Col>
						</Row>
					</Col>
				</Row>
			</div>
		</div>
	);
};
export default CardStatusBaiTap;
