import { InfoCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import React from 'react';
import { history, useIntl, useModel } from 'umi';
import ConfigBounder from '../TechnicalSupportBounder/ConfigBounder';
import AvatarDropdown from './AvatarDropdown';
import styles from './index.less';
import LocaleSwitch from './LocaleSwitch';
import ModuleSwitch from './ModuleSwitch';
import NoticeIconView from './NoticeIcon';

const GlobalHeaderRight: React.FC = () => {
	const intl = useIntl();
	const { initialState } = useModel('@@initialState');

	if (!initialState || !initialState.currentUser) {
		return null;
	}

	return (
		<ConfigBounder>
			<div className='css-var-ra' style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center' }}>
				<div className={styles.menu_right}>
					<ModuleSwitch />

					<NoticeIconView />

					{/* <Tooltip
				title={intl.formatMessage({ id: 'app.header.introduce', defaultMessage: 'Giới thiệu chung' })}
				placement='bottom'
			>
				<a onClick={() => history.push('/gioi-thieu')}>
					<InfoCircleOutlined />
				</a>
			</Tooltip> */}

					<LocaleSwitch />

					<AvatarDropdown  />
				</div>
			</div>
		</ConfigBounder>
	);
};

export default GlobalHeaderRight;
