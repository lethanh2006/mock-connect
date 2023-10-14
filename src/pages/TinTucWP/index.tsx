import { Card, Pagination, Spin } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import BlockTinTuc from './BlockTinTuc';
import './styles.less';

const TinTucPage = () => {
	const { loading, page, limit, total, setPage, setLimit, getModel } = useModel('tintuc.tintucwp');

	useEffect(() => {
		getModel();
	}, [page, limit]);

	const onChangePaging = (p: number, size: number) => {
		setPage(p);
		setLimit(size);
	};

	return (
		<Card title='Tin tức'>
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
		</Card>
	);
};

export default TinTucPage;
