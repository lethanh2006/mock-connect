import { Tooltip } from 'antd';
import { useMediaQuery } from 'react-responsive';
import HeaderDropdown from '../HeaderDropdown';
import ModuleView from './ModuleView';

const ModuleSwitch = () => {
	const isMobile = useMediaQuery({ query: '(max-width: 767px)' });

	return (
		<HeaderDropdown placement={isMobile ? 'bottom' : 'bottomRight'} content={<ModuleView />}>
			<Tooltip title='Danh sách chức năng' placement='bottom'>
				<div className='header-menu-item'>
					<img src='/icons/modules.svg' alt='apps' />
				</div>
			</Tooltip>
		</HeaderDropdown>
	);
};

export default ModuleSwitch;
