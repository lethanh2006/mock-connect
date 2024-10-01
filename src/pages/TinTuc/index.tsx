import { CommonTopicType } from '@/services/TinTuc/constant';
import { ellipse } from '@/utils/utils';
import { Card, Empty, Tabs, Tooltip } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import './components/styles.less';
import TinTucSlinkPage from './Slink';
import TinTucWpPage from './Wordpress';
import { ELoaiThongTinXemSau } from '@/services/XemSau/constant';

const TinTucPage = () => {
	const {
		getAllModel: getAllChuDe,
		danhSach: danhSachChuDe,
		setRecord: setChuDe,
		record: recChuDe,
	} = useModel('tintuc.chude');
	const { setPage } = useModel('tintuc.tintuc');
	const { setPage: setPageWP } = useModel('tintuc.tintucwp');
	const { getAllModel } = useModel('xemsau');
	const { getThongTinCuaToiModel } = useModel('sinhvien.sinhvien');

	const hash = window.location.hash.slice(1, 25);

	useEffect(() => {
		getAllChuDe(undefined, { order: 1 }, { type: CommonTopicType.TIN_TUC }).then((listMenu) => {
			if (hash === '' || hash.includes('=')) setChuDe(undefined);
			else setChuDe(listMenu.find((item) => item._id === hash));
		});
	}, []);

	const getData = () => {
		getAllModel(undefined, undefined, { loaiThongTin: ELoaiThongTinXemSau.TIN_TUC }, undefined, 'me/many');
	};

	useEffect(() => {
		getThongTinCuaToiModel();
		getData();
	}, []);

	const changeMenu = (k: string) => {
		setChuDe(danhSachChuDe.find((item) => item._id === k));
		window.location.hash = '#' + k;
		setPage(1);
		setPageWP(1);
	};

	return (
		<Card title='Tin tức' bodyStyle={{ paddingTop: 0 }}>
			{danhSachChuDe && danhSachChuDe.length > 0 ? (
				<Tabs activeKey={recChuDe?._id ?? 'all'} onChange={changeMenu} style={{ overflow: 'inherit' }}>
					<Tabs.TabPane key={'all'} tab={<Tooltip title='Tất cả'>Tất cả</Tooltip>}>
						{recChuDe?.isTinTucWP ? <TinTucWpPage getData={getData} /> : <TinTucSlinkPage getData={getData} />}
					</Tabs.TabPane>
					{danhSachChuDe?.map((chuDe) => (
						<Tabs.TabPane
							key={chuDe?._id}
							tab={
								<Tooltip title={chuDe?.name}>
									{recChuDe?._id === chuDe?._id ? chuDe.name : ellipse(chuDe?.name)}
								</Tooltip>
							}
						>
							{recChuDe?.isTinTucWP ? <TinTucWpPage getData={getData} /> : <TinTucSlinkPage getData={getData} />}
						</Tabs.TabPane>
					))}
				</Tabs>
			) : (
				<Empty style={{ paddingTop: 32 }} description='Chưa có tin tức' />
			)}
		</Card>
	);
};

export default TinTucPage;
