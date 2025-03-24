import { ToolOutlined } from '@ant-design/icons';
import { FloatButton, Modal } from 'antd';
import { useState } from 'react';
import { history } from 'umi';
import PanpageHoTro from './FanpageHoTro';
import FormPostIssue from './Form';
import { unTechnicalSupportPaths } from './constant';

const TechnicalSupportBounder = (props: { children: React.ReactNode }) => {
	const [visible, setVisible] = useState<boolean>(false);

	return (
		<>
			{props.children}

			{!unTechnicalSupportPaths.includes(window.location.pathname) ? (
				<>
					<FloatButton
						tooltip='Phản hồi kĩ thuật'
						// onClick={() => setVisible(true)}
							onClick={() => history.push('/phan-hoi')}
						type='primary'
						icon={<ToolOutlined />}
					/>

					<PanpageHoTro path={APP_CONFIG_HO_TRO_KY_THUAT} />

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

		</>
	);
};

export default TechnicalSupportBounder;
