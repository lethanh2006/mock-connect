import { Card, Carousel, Empty } from 'antd';
import { useEffect } from 'react';
import { Link, useIntl, useModel } from 'umi';
import ChartVaoRaThuVien from './Chart';
import StatVaoRaThuVien from './Stat';
import './style.less';

const VaoRaThuVienDashboardCard = () => {
	const intl = useIntl();
	const { loading, thongKeVaoRaModel, thongKeVaoRa } = useModel('thuvien.vaorathuvien');

	useEffect(() => {
		thongKeVaoRaModel();
	}, []);

	return (
		<Card
			variant='borderless'
			className='card-borderless'
			title={intl.formatMessage({ id: 'trangchu.hoctaprenluyen.thuvien.title' })}
			extra={
				<Link to={'/thu-vien/vao-ra'} type='link' className='xem-tat-ca-link'>
					{intl.formatMessage({ id: 'trangchu.hoctaprenluyen.thuvien.xemthem' })}
				</Link>
			}
			loading={loading}
		>
			<Card variant='borderless' style={{ borderRadius: 8 }}>
				{thongKeVaoRa.length ? (
					<Carousel autoplay pauseOnDotsHover autoplaySpeed={2500} infinite>
						<div>
							<StatVaoRaThuVien />
						</div>
						<div>
							<ChartVaoRaThuVien />
						</div>
					</Carousel>
				) : (
					<Empty
						image={Empty.PRESENTED_IMAGE_SIMPLE}
						style={{ margin: '16px 0' }}
						description={intl.formatMessage({ id: 'trangchu.hoctaprenluyen.thuvien.empty' })}
					/>
				)}
			</Card>
		</Card>
	);
};

export default VaoRaThuVienDashboardCard;
