import { Pagination, Spin } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import BlockTinTuc from './BlockTinTuc';

const TinTucSlinkPage = (props: any) => {
	const { getData, tabActive } = props;
	const { record: recChuDe } = useModel('tintuc.chude');
	const { getModel, loading, page, limit, total, setPage, setLimit } = useModel('tintuc.tintuc');

	useEffect(() => {
		getModel(tabActive === 'all' ? undefined : { idTopic: recChuDe?._id });
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

export default TinTucSlinkPage;
