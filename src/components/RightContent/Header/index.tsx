import { AppModules } from '@/services/base/constant';
import { currentRole } from '@/utils/ip';
import { Link, history, useIntl } from 'umi';
import './style.less';

const HeaderContentPage = () => {
	const intl = useIntl();

	return (
		<div className='header-content'>
			<img src='/student/logo.png' alt='logo' onClick={() => history.push('/')} />
			<div>
				{/* <div className='text-error'>{intl.formatMessage({ id: 'global.rightcontent.header.title' })}</div> */}
				<Link to='/'>{intl.formatMessage({ id: AppModules[currentRole].title }).toLocaleUpperCase()}</Link>
			</div>
			{/* <img src='/student/images/hoa-dao.png' alt='hoa-dao' /> */}
		</div>
	);
};

export default HeaderContentPage;
