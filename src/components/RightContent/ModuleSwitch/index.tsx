import { Icon9SquareGrid, SidebarDockItem } from '@/components/Icons';
import { useIntl } from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import ModuleView from './ModuleView';
import './style.less';

const ModuleSwitch = () => {
	const intl = useIntl();

	return (
		<HeaderDropdown placement='bottomRight' content={<ModuleView />}>
			<span className='module-switch-trigger'>
				<SidebarDockItem tooltip={intl.formatMessage({ id: 'app.header.appdrawer', defaultMessage: 'Danh sách chức năng' })}>
					<Icon9SquareGrid />
				</SidebarDockItem>
			</span>
		</HeaderDropdown>
	);
};

export default ModuleSwitch;
