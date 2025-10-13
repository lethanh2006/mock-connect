import '@/pages/TinTuc/components/styles.less';
import { CommonTopicType } from '@/services/TinTuc/constant';
import { useEffect } from 'react';
import { useModel } from 'umi';
import TinTucDashboardSlink from './TinTucDashboardSlinkTT';
import TinTucDashboardWP from './TinTucDashboardWP';

const TinTucDashboard = () => {
	const { getAllModel: getAllChuDe, danhSach: danhSachChuDe } = useModel('tintuc.chude');

	const isWp = danhSachChuDe?.find((item) => item?.isTinTucWP);

	useEffect(() => {
		getAllChuDe(undefined, { order: 1 }, { type: CommonTopicType.TIN_TUC });
	}, []);

	return isWp ? <TinTucDashboardWP /> : <TinTucDashboardSlink />;
};

export default TinTucDashboard;
