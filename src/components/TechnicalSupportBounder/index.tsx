import NotAccessible from '@/pages/exception/403';
import { useIntl } from '@umijs/max';
import { IconWrench01 } from '@/components/Icons';
import { FloatButton, Modal } from 'antd';
import { useMemo, useState } from 'react';
import { matchRoutes, useAccess, useAppData, useLocation, useModel } from 'umi';
import FormPostIssue from './Form';
import { unTechnicalSupportPaths } from './constant';

const TechnicalSupportBounder = (props: { children: React.ReactNode }) => {
	const intl = useIntl();
	const [visible, setVisible] = useState<boolean>(false);

	const { initialState } = useModel('@@initialState');
	const access = useAccess() as Record<string, any>;
	const { pathname } = useLocation();
	const { clientRoutes } = useAppData();

	const matchedRoute = useMemo(() => {
		const matches = matchRoutes(clientRoutes as any[], pathname);
		if (!matches?.length) return undefined;

		return [...matches].reverse().find((item) => (item.route as any)?.access)?.route as
			| { access?: string; maChucNang?: string; listChucNang?: string[] }
			| undefined;
	}, [clientRoutes, pathname]);

	const renderContent = () => {
		if (initialState?.permissionLoading) return <>{props.children}</>;

		const accessCode = matchedRoute?.access;
		if (accessCode) {
			const detector = access[accessCode];
			const allowed = typeof detector === 'function' ? detector(matchedRoute) : !!detector;
			if (!allowed) return <NotAccessible />;
		}

		return <>{props.children}</>;
	};

	return (
		<>
			{renderContent()}

			{!unTechnicalSupportPaths.includes(window.location.pathname) ? (
				<>
					<FloatButton
						tooltip={intl.formatMessage({ id: 'global.technical.title' })}
						onClick={() => setVisible(true)}
						type='primary'
						icon={<IconWrench01 size={18} />}
					/>

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
