import { IconFrontCamera } from '@/components/Icons';
import { useIntl } from 'umi';

const HuongDanDangKyTinChi = () => {
	const intl = useIntl();
	const youtubeUrl =
		typeof APP_CONFIG_URL_HUONG_DAN_DANG_KY_TIN_CHI !== 'undefined' ? APP_CONFIG_URL_HUONG_DAN_DANG_KY_TIN_CHI : '';

	return (
		<div className='course-registration-guide'>
			<div className='course-registration-guide__title'>
				<i>{intl.formatMessage({ id: 'dangkytinchi.thongtindangky.huongdandangky.title' })}</i>
			</div>

			{youtubeUrl ? (
				<button
					type='button'
					className='course-registration-guide__button'
					aria-label={intl.formatMessage({ id: 'dangkytinchi.thongtindangky.huongdandangky.title' })}
					onClick={() => window.open(youtubeUrl, '_blank', 'noopener,noreferrer')}
				>
					<IconFrontCamera size={43} />
				</button>
			) : null}
		</div>
	);
};

export default HuongDanDangKyTinChi;
