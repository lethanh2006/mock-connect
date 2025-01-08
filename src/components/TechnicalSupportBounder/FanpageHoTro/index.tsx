import { Tooltip } from 'antd';
import { unChatMessagerSupportPaths } from '../constant';

const PanpageHoTro = (props: { path: string }) => {
	const { path } = props;

	return (
		<>
			{!unChatMessagerSupportPaths.includes(window.location.pathname) ? (
				<>
					<Tooltip title='Fanpage Messenger' placement='topLeft'>
						<img
							onClick={() => window.open(path, '_blank')}
							style={{
								cursor: 'pointer',
								width: 40,
								position: 'fixed',
								bottom: 30,
								right: 24,
								zIndex: 10,
								boxShadow: 'rgba(0, 0, 0, 0.2) 1px 1px 8px 3px',
								padding: 0,
								borderRadius: '50%',
							}}
							src='images/messenger_icon.png'
							alt='mess'
						/>
					</Tooltip>
				</>
			) : null}
		</>
	);
};

export default PanpageHoTro;
