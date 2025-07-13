import { AppModules } from '@/services/base/constant';
import { currentRole } from '@/utils/ip';
import { Link, history, useIntl } from 'umi';
import './style.less';

const HeaderContentPage = () => {
	const intl = useIntl();

	return (
		<div className='css-var-rv header-content'>
			<img src='/logo.png' alt='logo' onClick={() => history.push('/')} />
			<div>
				<div className='text-error'>{intl.formatMessage({ id: 'global.rightcontent.header.title' })}</div>
				<Link to='/'>{AppModules[currentRole].title?.toLocaleUpperCase()}</Link>
			</div>
			{/* <img src='/images/hoa-dao.png' alt='hoa-dao' /> */}
		</div>
	);
};

export default HeaderContentPage;
