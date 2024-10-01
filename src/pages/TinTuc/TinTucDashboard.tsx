import { CommonTopicType } from '@/services/TinTuc/constant';
import { useEffect } from 'react';
import { useModel } from 'umi';
import './components/styles.less';
import TinTucDashboardSlink from './Slink/TinTucDashboard';
import TinTucDashboardWP from './Wordpress/TinTucDashboard';

const TinTucDashboard = (props: { isTinTucWP?: boolean }) => {
	const { isTinTucWP } = props;
	const { getAllModel: getAllChuDe } = useModel('tintuc.chude');

	useEffect(() => {
		if (isTinTucWP) {
			getAllChuDe(undefined, { order: 1 }, { type: CommonTopicType.TIN_TUC });
		}
	}, [isTinTucWP]);

	return isTinTucWP ? <TinTucDashboardWP /> : <TinTucDashboardSlink />;
};

export default TinTucDashboard;
