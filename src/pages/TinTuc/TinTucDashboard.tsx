import { CommonTopicType } from '@/services/TinTuc/constant';
import { useEffect } from 'react';
import { useModel } from 'umi';
import './components/styles.less';
import TinTucDashboardSlink from './Slink/TinTucDashboard';
import TinTucDashboardWP from './Wordpress/TinTucDashboard';

const TinTucDashboard = () => {
	const { getAllModel: getAllChuDe, danhSach: danhSachChuDe } = useModel('tintuc.chude');

	const isWp = danhSachChuDe?.find((item) => item?.isTinTucWP);

	useEffect(() => {
		getAllChuDe(undefined, { order: 1 }, { type: CommonTopicType.TIN_TUC });
	}, []);

	return isWp ? <TinTucDashboardWP /> : <TinTucDashboardSlink />;
};

export default TinTucDashboard;
