import { Button, Result } from 'antd';
import { Link, useIntl } from 'umi';

const ServerError = () => {
	const intl = useIntl();

	return (
		<Result
			status='500'
			title='500'
			style={{
				background: 'none',
			}}
			subTitle={intl.formatMessage({ id: 'pages.exception.500.subtitle' })}
			extra={
				<Link to='/'>
					<Button type='primary'>{intl.formatMessage({ id: 'pages.exception.backhome' })}</Button>
				</Link>
			}
		/>
	);
};

export default ServerError;
