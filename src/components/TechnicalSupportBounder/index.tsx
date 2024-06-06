import { ToolOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Modal, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import FormPostIssue from './Form';
import { unTechnicalSupportPaths } from './constant';
import { history } from 'umi';

const TechnicalSupportBounder = (props: { children: React.ReactNode }) => {
	const [visible, setVisible] = useState<boolean>(false);

	useEffect(() => {
		// Đổi màu real time => Hỗ trợ đổi tenant
		ConfigProvider.config({ theme: { primaryColor: APP_CONFIG_PRIMARY_COLOR } });
	}, []);

	return (
		<ConfigProvider>
			{props.children}

			{!unTechnicalSupportPaths.includes(window.location.pathname) ? (
				<>
					<Tooltip title='Phản hồi' placement='topLeft'>
						<Button
							// onClick={() => setVisible(true)}
							onClick={() => history.push('/phan-hoi')}
							style={{
								position: 'fixed',
								bottom: 90,
								right: 24,
								zIndex: 10,
								boxShadow: 'rgba(0, 0, 0, 0.2) 1px 1px 8px 3px',
								width: 44,
								height: 44,
								padding: 0,
								lineHeight: '44px',
								fontSize: 20,
							}}
							shape='circle'
							size='large'
							type='primary'
						>
							<ToolOutlined />
						</Button>
					</Tooltip>

					<Modal
						bodyStyle={{ padding: 0 }}
						footer={false}
						visible={visible}
						onCancel={() => setVisible(false)}
						maskClosable={false}
					>
						<FormPostIssue setVisible={setVisible} visible={visible} />
					</Modal>
				</>
			) : null}
		</ConfigProvider>
	);
};

export default TechnicalSupportBounder;
