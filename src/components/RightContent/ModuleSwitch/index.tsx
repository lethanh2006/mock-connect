import { Icon9SquareGrid, SidebarDockItem } from '@/components/Icons';
import { useIntl } from 'umi';

const ModuleSwitch = () => {
	const intl = useIntl();

	return (
		<SidebarDockItem
			view='app-drawer'
			tooltip={intl.formatMessage({ id: 'app.header.appdrawer', defaultMessage: 'Danh sách chức năng' })}
		>
			<Icon9SquareGrid size={22} />
		</SidebarDockItem>
	);
};

export default ModuleSwitch;
