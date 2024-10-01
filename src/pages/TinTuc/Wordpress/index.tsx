import { Pagination, Spin } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import '../components/styles.less';
import BlockTinTuc from './BlockTinTuc';

const TinTucWpPage = (props: { getData: () => void; tabActive: string }) => {
	const { getData, tabActive } = props;
	const { record: recChuDe, danhSach: danhSachChuDe } = useModel('tintuc.chude');
	const { getModel, loading, page, limit, total, setPage, setLimit } = useModel('tintuc.tintucwp');

	const linkWp = danhSachChuDe?.filter((item) => item?.isTinTucWP)?.[0];
	const idCategory = danhSachChuDe?.filter((item) => item?.isTinTucWP)?.map((items) => items?.idCategoryWp);

	useEffect(() => {
		if (tabActive === 'all') {
			getModel(page, limit, idCategory, linkWp?.linkWP);
		} else {
			getModel(page, limit, recChuDe?.idCategoryWp ? [+recChuDe?.idCategoryWp] : undefined, recChuDe?.linkWP);
		}
	}, [page, limit, recChuDe?._id]);

	const onChangePaging = (p: number, size: number) => {
		setPage(p);
		setLimit(size);
	};

	return (
		<Spin spinning={loading}>
			<BlockTinTuc getData={getData} />

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
	);
};

export default TinTucWpPage;
