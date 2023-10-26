import { Card, notification } from 'antd';
import { useEffect } from 'react';
import TableChiTietThu from './components/TableChiTietThu';

const ChiTietThuPage = () => {
	// Callback from MOMO
	useEffect(() => {
		if (window.location.href.includes('orderType=momo_wallet'))
			if (window.location.href.includes('resultCode=0'))
				notification.success({ message: 'Thành công', description: 'Thanh toán công nợ thành công' });
			else notification.warn({ message: 'Thất bại', description: 'Thanh toán thất bại' });
	}, []);

	return (
		<Card title='Công nợ'>
			<TableChiTietThu />
		</Card>
	);
};

export default ChiTietThuPage;
