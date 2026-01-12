import { unitName } from '@/services/base/constant';
import { Card } from 'antd';
import './components/style.less';
import { useIntl } from '@umijs/max';

const TrangChu = () => {
	const intl = useIntl();
	return (
		<Card styles={{ body: { height: '100%' } }} variant='borderless'>
			<div className='home-welcome'>
				<h1 className='title'>PHÂN HỆ QUẢN LÝ ĐÀO TẠO</h1>
				<h2 className='sub-title'>
					HỆ THỐNG PHẦN MỀM CHỈ ĐẠO, ĐIỀU HÀNH - {(intl.formatMessage({ id: unitName })).toUpperCase()}
				</h2>
			</div>
		</Card>
	);
};

export default TrangChu;
