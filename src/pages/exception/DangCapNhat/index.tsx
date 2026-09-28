import Footer from '@/components/Footer';
import { landingUrl } from '@/services/base/constant';
import { Button, IconEarth } from '@/components/Icons';
import { history, useIntl } from '@umijs/max';
import { Result } from 'antd';
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
					<Button asChild variant='default'>
						<a href={landingUrl} className='not-underline'>
							<IconEarth /> {intl.formatMessage({ id: 'pages.exception.portal' })}
						</a>
					</Button>
				}
			/>

			<Footer />
		</div>
	);
};
export default DangCapNhatPage;
