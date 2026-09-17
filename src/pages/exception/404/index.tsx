import { Button, IconRoofedHouse } from '@/components/Icons';
import { Result } from 'antd';
import { history, useIntl } from 'umi';

const NotFoundContent = () => {
	const intl = useIntl();

	return (
		<Result
			status='404'
			title='404'
			style={{ background: 'none' }}
			subTitle={intl.formatMessage({ id: 'pages.exception.404.subtitle' })}
			extra={
				<Button variant='default' onClick={() => history.push('/')} icon={<IconRoofedHouse />}>
					{intl.formatMessage({ id: 'pages.exception.backhome' })}
				</Button>
			}
		/>
	);
};

export default NotFoundContent;
