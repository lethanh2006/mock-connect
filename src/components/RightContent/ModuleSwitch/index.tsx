import { Tooltip } from 'antd';
import { useMediaQuery } from 'react-responsive';
import HeaderDropdown from '../HeaderDropdown';
import ModuleView from './ModuleView';

const ModuleSwitch = () => {
	const isMobile = useMediaQuery({ query: '(max-width: 767px)' });

	return (
		<HeaderDropdown placement={isMobile ? 'bottom' : 'bottomRight'} content={<ModuleView />}>
			<Tooltip title='Danh sách chức năng' placement='bottom'>
				<a>
					<img src='/icon-tien-ich.svg' alt='apps' />
				</a>
			</Tooltip>
		</HeaderDropdown>
	);
};

export default ModuleSwitch;
