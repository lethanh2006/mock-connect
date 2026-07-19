import { getPublicAssetPath } from '@/utils/path';
import { Card } from 'antd';
import { useIntl, useModel } from 'umi';
import './style.less';

const WelcomeCard = () => {
	const intl = useIntl();
	const { initialState } = useModel('@@initialState');
	const { record: recSinhVien, loading } = useModel('sinhvien.sinhvien');
	const frame = getPublicAssetPath('images/welcome-frame.png');
	const gif = getPublicAssetPath('images/welcome.gif');

	return (
		<Card variant='borderless' className='welcome-card' loading={loading}>
			{/* Background geometric shapes */}
			<img className='background-frame' src={frame} alt='Background frame' />

			{/* Content */}
			<div className='content'>
				{/* Hand peace sign icon */}
				<img src={gif} alt='hi' className='gif-image' />

				{/* Text content */}
				<div className='text-content'>
					<h2 className='greeting-text'>
						{intl.formatMessage(
							{ id: 'trangchu.title.xinchao' },
							{
								ten: recSinhVien?.firstName ?? initialState?.currentUser?.given_name ?? 'bạn',
							},
						)}
					</h2>

					<p className='welcome-text'>{intl.formatMessage({ id: 'trangchu.title.quaylai' })}</p>
				</div>
			</div>
		</Card>
	);
};

export default WelcomeCard;
