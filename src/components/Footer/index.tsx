import { landingUrl, unitName } from '@/services/base/constant';
import { DefaultFooter } from '@ant-design/pro-layout';
import { useIntl } from 'umi';
import ConfigBounder from '../TechnicalSupportBounder/ConfigBounder';

export default () => {
	const intl = useIntl();
	const defaultMessage = intl.formatMessage({
		id: 'app.copyright.produced',
		defaultMessage: 'CopyRight',
	});

	return (
		<ConfigBounder>
			<DefaultFooter
				copyright={`2023 ${defaultMessage} - ${APP_CONFIG_APP_VERSION}`}
				links={[
					{
						key: 'link',
						title: unitName.toUpperCase(),
						href: landingUrl,
						blankTarget: true,
					},
				]}
				style={{ width: '100%' }}
			/>
		</ConfigBounder>
	);
};
