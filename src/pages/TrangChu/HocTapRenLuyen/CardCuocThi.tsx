import { ELoaiDot } from '@/services/TienIch/KhaoSat/constants';
import { Card, Carousel, Spin } from 'antd';
import { useEffect } from 'react';
import { history, useModel } from 'umi';
const { Meta } = Card;

const CardCuocThiDashboard = () => {
	const { getDotMeModel, loading, danhSach } = useModel('tienich.dotkhaosat');

	useEffect(() => {
		getDotMeModel(ELoaiDot.CUOC_THI);
	}, []);

	return danhSach.length ? (
		<Spin spinning={loading}>
			<Carousel autoplay pauseOnDotsHover>
				{danhSach?.map((item) => (
					// eslint-disable-next-line react/jsx-key
					<Card
						hoverable
						cover={<img alt='example' src={item?.bannerUrl} style={{ height: 120, objectFit: 'cover' }} />}
						onClick={() => history.push('/cuoc-thi')}
					>
						<Meta title={item?.ten} />
					</Card>
				))}
			</Carousel>
		</Spin>
	) : null;
};

export default CardCuocThiDashboard;
