import { InfoCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import React from 'react';
import { history, useModel } from 'umi';
import ConfigBounder from '../TechnicalSupportBounder/ConfigBounder';
import AvatarDropdown from './AvatarDropdown';
import ModuleSwitch from './ModuleSwitch';
import NoticeIconView from './NoticeIcon';
import styles from './index.less';

export type SiderTheme = 'light' | 'dark';

const GlobalHeaderRight: React.FC = () => {
	const { initialState } = useModel('@@initialState');

	if (!initialState || !initialState.currentUser) {
		return null;
	}

	return (
		<ConfigBounder>
			<div className='css-var-ra' style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center' }}>
				<div className={styles.right}>
					<ModuleSwitch />

					<NoticeIconView />

					<Tooltip title='Giới thiệu chung' placement='bottom'>
						<a onClick={() => history.push('/gioi-thieu')}>
							<InfoCircleOutlined />
						</a>
					</Tooltip>

					<AvatarDropdown menu />
				</div>
			</div>
		</ConfigBounder>
	);
};

export default GlobalHeaderRight;
