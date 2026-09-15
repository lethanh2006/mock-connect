import { useMenuBadge } from '@/components/AppShell';
import PageCard from '@/components/PageCard';
import { unitName } from '@/services/base/constant';
import { useIntl } from '@umijs/max';
import { useEffect } from 'react';
import './components/style.less';

const TrangChu = () => {
	const intl = useIntl();
	const [, setBadge] = useMenuBadge('/dashboard');

	useEffect(() => {
		// Khởi tạo badge cho trang Home. => để làm mẫu 
		// Hiện tại chưa có dữ liệu API nên đặt giá trị mặc định là 0 (tự động ẩn badge).
		// Khi có API thống kê thực tế, chỉ cần gọi: setBadge(res.soLuongCanXuLy);
		setBadge(0);
	}, []);

	return (
		<PageCard title={intl.formatMessage({ id: 'menu.Dashboard' })}>
			<div className='home-welcome'>
				<h1 className='title'>{intl.formatMessage({ id: 'pages.trangchu.title' })}</h1>
				<h2 className='sub-title'>
					{intl.formatMessage({ id: 'pages.trangchu.subtitle' })} - {intl.formatMessage({ id: unitName }).toUpperCase()}
				</h2>
			</div>
		</PageCard>
	);
};

export default TrangChu;
