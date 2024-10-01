import { Pagination, Spin } from 'antd';
import { useModel } from 'umi';
import '../components/styles.less';
import BlockTinTuc from './BlockTinTuc';
import { useEffect } from 'react';

const TinTucWpPage = (props: any) => {
	const { getData } = props;
	const { record: recChuDe } = useModel('tintuc.chude');
	const { getModel, loading, page, limit, total, setPage, setLimit } = useModel('tintuc.tintucwp');

	useEffect(() => {
		getModel(page, limit, recChuDe?.idCategoryWp ? +recChuDe?.idCategoryWp : undefined, recChuDe?.linkWP);
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
