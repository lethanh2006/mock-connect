import { TabViewPage } from '@/components/TabViewPage';
import { ELoaiThongTinXemSau } from '@/services/TienIch/XemSau/constant';
import { CommonTopicType } from '@/services/TinTuc/constant';
import { ellipse } from '@/utils/utils';
import { Card, Empty, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import './components/styles.less';
import TinTucSlinkPage from './Slink';
import TinTucWpPage from './Wordpress';

const TinTucPage = () => {
	const {
		getAllModel: getAllChuDe,
		danhSach: danhSachChuDe,
		setRecord: setChuDe,
		record: recChuDe,
	} = useModel('tintuc.chude');
	const { setPage } = useModel('tintuc.tintuc');
	const { setPage: setPageWP } = useModel('tintuc.tintucwp');
	const { getAllModel } = useModel('tienich.xemsau');
	const hash = window.location.hash.slice(1, 25);
	const [tabActive, setTabActive] = useState<string>('all');

	const isWp = recChuDe?.isTinTucWP || (tabActive === 'all' && danhSachChuDe?.find((item) => item?.isTinTucWP));

	//Xem sau
	const getData = () => {
		getAllModel(undefined, undefined, { loaiThongTin: ELoaiThongTinXemSau.TIN_TUC }, undefined, 'me/many');
	};

	useEffect(() => {
		getData();
	}, []);

	//Chủ đề
	useEffect(() => {
		getAllChuDe(undefined, { order: 1 }, { type: CommonTopicType.TIN_TUC }).then((listMenu) => {
			if (hash === '' || hash.includes('=')) setChuDe(undefined);
			else setChuDe(listMenu.find((item) => item._id === hash));
		});
	}, []);

	const main = () =>
		isWp ? <TinTucWpPage tabActive={tabActive} getData={getData} /> : <TinTucSlinkPage tabActive={tabActive} />;

	const menus = [
		{
			title: 'Tất cả',
			menuKey: 'all',
			content: main(),
		},
		...danhSachChuDe?.map((chuDe) => ({
			title: <Tooltip title={chuDe?.name}>{recChuDe?._id === chuDe?._id ? chuDe.name : ellipse(chuDe?.name)}</Tooltip>,
			menuKey: chuDe._id,
			content: main(),
		})),
	];

	return (
		<Card title='Tin tức' bodyStyle={{ paddingTop: 0 }}>
			{danhSachChuDe && danhSachChuDe.length > 0 ? (
				<TabViewPage
					hideCard
					menu={menus as any}
					onChange={(key) => {
						setTabActive(key);
						setChuDe(danhSachChuDe.find((item) => item._id === key));
						setPageWP(1);
						setPage(1);
					}}
				/>
			) : (
				<Empty style={{ paddingTop: 32 }} description='Chưa có tin tức' />
			)}
		</Card>
	);
};

export default TinTucPage;
