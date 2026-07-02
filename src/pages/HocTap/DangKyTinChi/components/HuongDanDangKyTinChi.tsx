import { YoutubeOutlined } from '@ant-design/icons';
import { useIntl } from 'umi';

const HuongDanDangKyTinChi = () => {
	const intl = useIntl();

	return (
		<div className='huong-dan'>
			<div className='title-huong-dan'>
				<i>{intl.formatMessage({ id: 'dangkytinchi.thongtindangky.huongdandangky.title' })}</i>
			</div>

			<YoutubeOutlined
				className='pulse'
				onClick={() => window.open('https://www.youtube.com/watch?v=2xghlws7tAk&t=2s')}
			/>
		</div>
	);
};

export default HuongDanDangKyTinChi;
