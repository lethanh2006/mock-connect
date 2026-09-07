import Footer from '@/components/Footer';
import { landingUrl } from '@/services/base/constant';
import { IconEarth } from '@/components/Icons';
import { history, useIntl } from '@umijs/max';
import { Button, Result } from 'antd';
import { useEffect } from 'react';

const DangCapNhatPage = () => {
	const intl = useIntl();

	// Nếu Đang cập nhật thì bỏ cái này đi
	useEffect(() => {
		history.replace('/dashboard');
	}, []);

	return (
		<div
			style={{
				minHeight: '100vh',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				flexDirection: 'column',
			}}
		>
			<Result
				status='404'
				title={intl.formatMessage({ id: 'pages.exception.updating.title' })}
				style={{ background: 'none' }}
				subTitle={intl.formatMessage({ id: 'pages.exception.updating.subtitle' })}
				extra={
					<Button type='primary' href={landingUrl} icon={<IconEarth />} className='not-underline'>
						{intl.formatMessage({ id: 'pages.exception.portal' })}
					</Button>
				}
			/>

			<Footer />
		</div>
	);
};
export default DangCapNhatPage;
