import { ToolOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import { FloatButton, Modal } from 'antd';
import { useState } from 'react';
import { history } from 'umi';
import PanpageHoTro from './FanpageHoTro';
import FormPostIssue from './Form';
import { unTechnicalSupportPaths } from './constant';

const TechnicalSupportBounder = (props: { children: React.ReactNode }) => {
	const intl = useIntl();
	const [visible, setVisible] = useState<boolean>(false);

	return (
		<>
			{props.children}

			{!unTechnicalSupportPaths.includes(window.location.pathname) ? (
				<>
					<FloatButton
						tooltip={intl.formatMessage({ id: 'global.technical.title' })}
						// onClick={() => setVisible(true)}
						onClick={() => history.push('/phan-hoi')}
						type='primary'
						icon={<ToolOutlined />}
					/>

					<PanpageHoTro path={APP_CONFIG_HO_TRO_KY_THUAT} />

					<Modal
						footer={null}
						open={visible}
						onCancel={() => setVisible(false)}
						maskClosable={false}
						title={intl.formatMessage({ id: 'global.technical.title' })}
					>
						<FormPostIssue setVisible={setVisible} visible={visible} />
					</Modal>
				</>
			) : null}

		</>
	);
};

export default TechnicalSupportBounder;
