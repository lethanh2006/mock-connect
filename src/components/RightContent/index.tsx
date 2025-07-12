import React from 'react';
import { useModel } from 'umi';
import ConfigBounder from '../TechnicalSupportBounder/ConfigBounder';
import AvatarDropdown from './AvatarDropdown';
import ModuleSwitch from './ModuleSwitch';
import NoticeIconView from './NoticeIcon';
import styles from './index.less';

const GlobalHeaderRight: React.FC = () => {
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

					{/* <Tooltip title='Giới thiệu chung' placement='bottom'>
						<Button onClick={() => history.push('/gioi-thieu')} icon={<InfoCircleOutlined />} />
					</Tooltip> */}

					<AvatarDropdown menu />
				</div>
			</div>
		</ConfigBounder>
	);
};

export default GlobalHeaderRight;
