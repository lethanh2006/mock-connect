import { Card, Empty } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import NhuCauHocPhanPage from './NhuCauHocPhan';
import FilterHocKy from '@/pages/DaoTao/HocKy/FilterHocKy';

const DangKyNhuCauPage = () => {
	const { getDotDangKyNhuCauHocKyModel, record } = useModel('daotao.dangkynhucau.dotdangkynhucau');
	const { record: recHocKy } = useModel('daotao.hocky');

	useEffect(() => {
		if (recHocKy?._id) getDotDangKyNhuCauHocKyModel(recHocKy?.ma);
	}, [recHocKy?._id]);

	return (
		<>
			<Card title='Đăng ký nhu cầu'>
				<div style={{ marginBottom: 12 }}>
					<FilterHocKy isSetHocKy />
				</div>
				{record?._id ? <NhuCauHocPhanPage /> : <Empty description='Không có đợt đăng ký' style={{ marginTop: 32 }} />}
			</Card>
		</>
	);
};

export default DangKyNhuCauPage;
