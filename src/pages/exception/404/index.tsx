import ConfigBounder from '@/components/TechnicalSupportBounder/ConfigBounder';
import { HomeOutlined } from '@ant-design/icons';
import { Button, Result } from 'antd';
import { history } from 'umi';

const NotFoundContent = () => (
	<ConfigBounder>
		<Result
			status='404'
			title='404'
			style={{ background: 'none' }}
			subTitle='Xin lỗi, trang bạn yêu cầu không tồn tại.'
			extra={
				<Button type='primary' onClick={() => history.push('/')} icon={<HomeOutlined />}>
					Về trang chủ
				</Button>
			}
		/>
	</ConfigBounder>
);

export default NotFoundContent;
