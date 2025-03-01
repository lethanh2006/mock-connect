import { ToolOutlined } from '@ant-design/icons';
import { ConfigProvider, FloatButton, Modal } from 'antd';
import { useState } from 'react';
import FormPostIssue from './Form';
import { unTechnicalSupportPaths } from './constant';

const TechnicalSupportBounder = (props: { children: React.ReactNode }) => {
	const [visible, setVisible] = useState<boolean>(false);

	return (
		<ConfigProvider theme={{ token: { borderRadius: 4 }, hashed: false }}>
			{props.children}

			{!unTechnicalSupportPaths.includes(window.location.pathname) ? (
				<>
					<FloatButton
						tooltip='Phản hồi kĩ thuật'
						onClick={() => setVisible(true)}
						type='primary'
						icon={<ToolOutlined />}
					/>

					<Modal
						styles={{ content: { padding: 0 }, body: { padding: 0 } }}
						footer={false}
						open={visible}
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
