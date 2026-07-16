import { HomeOutlined } from '@ant-design/icons';
import { Button, Result, Spin } from 'antd';
import { useIntl, useModel } from 'umi';

const NotAccessible = () => {
	const { initialState } = useModel('@@initialState');
	const intl = useIntl();

	if (initialState?.permissionLoading)
		return (
			<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 32, marginBottom: 32 }}>
				<Spin spinning />
				<div>{intl.formatMessage({ id: 'pages.exception.loading' })}</div>
			</div>
		);
	return (
		<Result
			status='403'
			title={intl.formatMessage({ id: 'pages.exception.403.title' })}
			style={{
				background: 'none',
			}}
			subTitle={intl.formatMessage({ id: 'pages.exception.403.subtitle' })}
			extra={
				<Button type='primary' icon={<HomeOutlined />} onClick={() => (window.location.href = '/')}>
					{intl.formatMessage({ id: 'pages.exception.backhome' })}
				</Button>
			}
		/>
	);
};

export default NotAccessible;
