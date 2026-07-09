import { YoutubeOutlined } from '@ant-design/icons';
import { useIntl } from 'umi';

const HuongDanDangKyTinChi = () => {
	const intl = useIntl();
	const youtubeUrl =
		typeof APP_CONFIG_URL_HUONG_DAN_DANG_KY_TIN_CHI !== 'undefined' ? APP_CONFIG_URL_HUONG_DAN_DANG_KY_TIN_CHI : '';

	return (
		<div className='huong-dan'>
			<div className='title-huong-dan'>
				<i>{intl.formatMessage({ id: 'dangkytinchi.thongtindangky.huongdandangky.title' })}</i>
			</div>

			{youtubeUrl ? <YoutubeOutlined className='pulse' onClick={() => window.open(youtubeUrl, '_blank')} /> : null}
		</div>
	);
};

export default HuongDanDangKyTinChi;
