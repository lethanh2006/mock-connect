import { AppModules } from '@/services/base/constant';
import { currentRole } from '@/utils/ip';
import { getPublicAssetPath } from '@/utils/path';
import { Link, history, useIntl } from 'umi';
import './style.less';

const HeaderContentPage = () => {
	const intl = useIntl();

	return (
		<div className='header-content'>
			<img src={getPublicAssetPath('logo.png')} alt='logo' onClick={() => history.push('/')} />
			<div>
				<div className='text-error'>{intl.formatMessage({ id: 'global.rightcontent.header.title' })}</div>
				<Link to='/'>{intl.formatMessage({ id: AppModules[currentRole].title }).toLocaleUpperCase()}</Link>
			</div>
		</div>
	);
};

export default HeaderContentPage;
