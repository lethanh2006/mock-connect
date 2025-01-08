import { ConfigProvider, Tooltip } from 'antd';
import { unChatMessagerSupportPaths } from '../constant';

const PanpageHoTro = (props: { path: string }) => {
	const { path } = props;

	return (
		<ConfigProvider>
			{!unChatMessagerSupportPaths.includes(window.location.pathname) ? (
				<>
					<Tooltip title='Hỗ trợ kỹ thuật' placement='topLeft'>
						<img
							onClick={() => window.open(path, '_blank')}
							style={{
								cursor: 'pointer',
								width: 45,
								position: 'fixed',
								bottom: 30,
								right: 20,
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
		</ConfigProvider>
	);
};

export default PanpageHoTro;
