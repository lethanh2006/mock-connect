import { CommonTopicType } from '@/services/TinTuc/constant';
import { ellipse } from '@/utils/utils';
import { Card, Empty, Pagination, Spin, Tabs, Tooltip } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import './components/styles.less';
import TinTucWpPage from './Wordpress';
import BlockTinTuc from './Slink/BlockTinTuc';

const TinTucPage = () => {
	const {
		getAllModel: getAllChuDe,
		danhSach: danhSachChuDe,
		setRecord: setChuDe,
		record: recChuDe,
	} = useModel('tintuc.chude');
	const { loading, page, limit, total, setPage, setLimit, getModel } = useModel('tintuc.tintuc');
	const { page: pagewp, limit: limitwp, getModel: getModelwp } = useModel('tintuc.tintucwp');
	const hash = window.location.hash.slice(1, 25);

	useEffect(() => {
		getAllChuDe(undefined, { order: 1 }, { type: CommonTopicType.TIN_TUC }).then((listMenu) => {
			if (hash === '' || hash.includes('=')) setChuDe(undefined);
			else setChuDe(listMenu.find((item) => item._id === hash));
		});
	}, []);

	useEffect(() => {
		if (recChuDe?.isTinTucWP) {
			getModelwp(pagewp, limitwp, recChuDe?.idCategoryWp ? +recChuDe?.idCategoryWp : undefined, recChuDe?.linkWP);
		} else {
			getModel({ idTopic: recChuDe?._id });
		}
	}, [page, limit, pagewp, limitwp, recChuDe?._id]);

	const changeMenu = (k: string) => {
		setChuDe(danhSachChuDe.find((item) => item._id === k));
		window.location.hash = '#' + k;
		setPage(1);
	};

	const onChangePaging = (p: number, size: number) => {
		setPage(p);
		setLimit(size);
	};

	return (
		<Card title='Tin tức' bodyStyle={{ paddingTop: 0 }}>
			{danhSachChuDe && danhSachChuDe.length > 0 ? (
				<Tabs activeKey={recChuDe?._id ?? 'all'} onChange={changeMenu} style={{ overflow: 'inherit' }}>
					<Tabs.TabPane key={'all'} tab={<Tooltip title='Tất cả'>Tất cả</Tooltip>}>
						{recChuDe?.isTinTucWP ? (
							<TinTucWpPage />
						) : (
							<Spin spinning={loading}>
								<BlockTinTuc />
								<Pagination
									onChange={onChangePaging}
									defaultPageSize={22}
									current={page}
									pageSize={limit}
									total={total}
									pageSizeOptions={[10, 22, 34]}
									style={{ textAlign: 'right' }}
								/>
							</Spin>
						)}
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
							{recChuDe?.isTinTucWP ? (
								<TinTucWpPage />
							) : (
								<Spin spinning={loading}>
									<BlockTinTuc />
									<Pagination
										onChange={onChangePaging}
										defaultPageSize={22}
										current={page}
										pageSize={limit}
										total={total}
										pageSizeOptions={[10, 22, 34]}
										style={{ textAlign: 'right' }}
									/>
								</Spin>
							)}
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
