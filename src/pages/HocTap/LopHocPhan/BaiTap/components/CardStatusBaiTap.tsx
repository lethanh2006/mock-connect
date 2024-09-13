import ButtonExtend from '@/components/Table/ButtonExtend';
import {
	colorTrangThaiNopBaiTap,
	type ETrangThaiNopBaiTap,
	mapTrangThaiNopBaiTap,
} from '@/services/DaoTao/BaiTap/constants';
import type { BaiTap } from '@/services/DaoTao/BaiTap/typing';
import { Col, Row, Space, Tag } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';
import BoxFile from '../../DienDan/components/BoxFile';
import { PlusOutlined } from '@ant-design/icons';

interface IProps {
	data: BaiTap.IDanhSachGiaoBaiTap;
}

const CardStatusBaiTap = (props: IProps) => {
	const { data } = props;
	const { handleEdit } = useModel('daotao.baitap');

	return (
		<div className='card relative' style={{ paddingBottom: 12 }}>
			<div className='header-card flex justify-between'>
				<div className='user-name flex item-center' style={{ width: '60%' }}>
					<Space>
						<div className='name'>{data?.assignment?.noiDung}</div>{' '}
						{data?.assignment?.isQuiz && <Tag color='blue'>Quiz</Tag>}
					</Space>
				</div>

				<div className='hannopbai'>
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
				</div>
			</div>

			{data?.assignment?.choPhepCapNhatSauNop && (
				<i style={{ color: APP_CONFIG_PRIMARY_COLOR, marginLeft: 18 }}>(Cho phép nộp bài sau thời gian hết hạn)</i>
			)}

			<div className='content'>
				<Row gutter={[12, 12]} style={{ marginTop: 8 }}>
					<Col xs={24} md={{ span: 7, push: 17 }} style={{ textAlign: 'center' }}>
						<div className='diembaitap'>
							<Tag color={colorTrangThaiNopBaiTap[data.trangThai as ETrangThaiNopBaiTap]}>
								{mapTrangThaiNopBaiTap[data.trangThai as ETrangThaiNopBaiTap]}
							</Tag>
							{data?.assignment?.isQuiz && (
								<div>
									<div style={{ marginTop: 8, fontSize: 28, fontWeight: 'bold', color: 'green' }}>
										{data?.assignment?.congBoDiemSauNop ? data?.tongDiem ?? '--' : '--'}
									</div>
									<div>Điểm số</div>
								</div>
							)}
						</div>
					</Col>
					<Col xs={24} md={{ span: 17, pull: 7 }}>
						<div className='noi-dung-post' dangerouslySetInnerHTML={{ __html: data?.assignment?.huongDanNop ?? '' }} />

						<Row gutter={[12, 12]} style={{ marginTop: 8 }}>
							{data?.assignment?.urlTepDinhKem?.map((val) => (
								<Col span={24} md={12} key={val}>
									<BoxFile url={val} />
								</Col>
							))}
						</Row>
					</Col>
					<Col xs={24} style={{ textAlign: 'right' }}>
						<ButtonExtend type='primary' onClick={() => handleEdit(data)} icon={<PlusOutlined />}>
							Xem chi tiết và làm bài
						</ButtonExtend>
					</Col>
				</Row>
			</div>
		</div>
	);
};
export default CardStatusBaiTap;
