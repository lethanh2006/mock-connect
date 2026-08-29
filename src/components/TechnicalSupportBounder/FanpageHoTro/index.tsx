import { getPublicAssetPath } from '@/utils/path';
import { Tooltip } from 'antd';
import { unMessengerSupportPaths } from '../constant';

const PanpageHoTro = () => {
	const path = APP_CONFIG_HO_TRO_KY_THUAT;

	if (!path) return null;
	return (
		<>
			{!unMessengerSupportPaths.includes(window.location.pathname) ? (
				<>
					<Tooltip title='Fanpage Messenger' placement='topLeft'>
						<img
							onClick={() => window.open(path, '_blank')}
							style={{
								cursor: 'pointer',
								width: 40,
								position: 'fixed',
								bottom: 108,
								right: 24,
								zIndex: 10,
								boxShadow: 'rgba(0, 0, 0, 0.2) 1px 1px 8px 3px',
								padding: 0,
								borderRadius: '50%',
							}}
							src={getPublicAssetPath('images/messenger_icon.png')}
							alt='mess'
						/>
					</Tooltip>
				</>
			) : null}
		</>
	);
};

export default PanpageHoTro;
