import ConfigBounder from '@/components/TechnicalSupportBounder/ConfigBounder';
import { Button, Result } from 'antd';
import { Link } from 'umi';

const NotFoundContent = () => (
	<ConfigBounder>
		<Result
			status='404'
			title='404'
			style={{
				background: 'none',
			}}
			subTitle='Xin lỗi, trang bạn yêu cầu không tồn tại.'
			extra={
				<Link to='/'>
					<Button type='primary'>Về trang chủ</Button>
				</Link>
			}
		/>
	</ConfigBounder>
);

export default NotFoundContent;
