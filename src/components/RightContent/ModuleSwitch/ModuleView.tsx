import { IconDoubleHumanCard, SidebarView } from '@/components/Icons';
import {
	AppModules,
	EModuleKey,
	moduleCongThongTin,
	moduleQuanLyVanBan,
	moduleTapChiKhoaHoc,
} from '@/services/base/constant';
import type { Login } from '@/services/base/typing';
import { financeApiClientId, qldtApiClientId } from '@/utils/ip';
import { hasModulePermission } from '@/utils/keycloakRoles';
import { useIntl, useModel } from 'umi';
import './style.less';

const ModuleView = () => {
	const intl = useIntl();
	const { initialState } = useModel('@@initialState');
	const permissions = initialState?.authorizedPermissions?.map((item) => item.rsname);
	const isCanBo = initialState?.authorizedPermissions?.some(
		(permission) => permission.rsname === EModuleKey.CONG_CAN_BO,
	);
	const extendModules: Partial<Login.TModule>[] = [];
	if (moduleQuanLyVanBan.url && isCanBo) extendModules.push(moduleQuanLyVanBan);
	if (moduleTapChiKhoaHoc.url) extendModules.push(moduleTapChiKhoaHoc);
	if (moduleCongThongTin.url) extendModules.push(moduleCongThongTin);

	const allowedModules = Object.entries(AppModules).filter(([name, value]) => {
		const clientIds =
			name === EModuleKey.QLDT ? [qldtApiClientId] : name === EModuleKey.TC ? [financeApiClientId] : undefined;

		return (
			(permissions?.includes(name as EModuleKey) ||
				(clientIds && hasModulePermission(initialState, name, clientIds))) &&
			!!value.url
		);
	});
	const cntModules = allowedModules.length + extendModules.length;

	return (
		<SidebarView value='app-drawer' className='module-view'>
			<div className='module-header'>
				{intl.formatMessage({ id: 'global.rightcontent.moduleswitch.dschungnang' })} ({cntModules})
			</div>

			<div className='module-container' style={{ padding: '0 12px 12px' }}>
				<div className='module-grid'>
					{allowedModules.map(([name, value]) => (
						<a key={name} href={value?.url} target='_blank' rel='noreferrer'>
							<div className='module-item'>
								{value?.icon ? (
									<img src={`${AppModules[EModuleKey.CORE].url}modules/${value.icon}`} />
								) : (
									<IconDoubleHumanCard size={36} className='module-icon' />
								)}
								<span className='module-name'>{intl.formatMessage({ id: value?.title ?? name })}</span>
							</div>
						</a>
					))}

					{extendModules.map((mod) => (
						<a key={mod.url} href={mod.url} target='_blank' rel='noreferrer'>
							<div className='module-item'>
								{mod.icon ? (
									<img src={`${AppModules[EModuleKey.CORE].url}modules/${mod.icon}`} />
								) : (
									<IconDoubleHumanCard size={36} className='module-icon' />
								)}
								<span className='module-name'>{intl.formatMessage({ id: mod.title })}</span>
							</div>
						</a>
					))}
				</div>
			</div>
		</SidebarView>
	);
};

export default ModuleView;
