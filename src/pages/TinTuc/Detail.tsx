import { ArrowLeftOutlined } from '@ant-design/icons';
import { Card } from 'antd';
import queryString from 'query-string';
import { useEffect } from 'react';
import { useModel } from 'umi';
import './components/styles.less';
import ChiTietTinSlink from './Slink/ChiTietTinTuc';
import ChiTietTinTucWpPage from './Wordpress/ChiTietTinTuc';

const ChiTietTinTucPage = () => {
	const { getByIdModel } = useModel('tintuc.chude');
	const { getByIdModel: getIdTinTucWP } = useModel('tintuc.tintucwp');
	const { getByIdModel: getIdTinTucSlink } = useModel('tintuc.tintuc');
	const { location } = window;

	const { idSlink, idWordPess, idChuDe } = queryString.parse(location.search);
	const isTinTucWP = !!idWordPess;

	const fetchData = async () => {
		if (isTinTucWP) {
			getByIdModel(idChuDe as string, false).then((res) => {
				if (res) {
					getIdTinTucWP(idWordPess as string, undefined, res?.linkWP).then((response) => {
						window.scrollTo({ top: 0, behavior: 'smooth' });
					});
				}
			});
		} else {
			getIdTinTucSlink(idSlink as string).then((response) => {
				window.scrollTo({ top: 0, behavior: 'smooth' });
			});
		}
	};

	useEffect(() => {
		fetchData();
	}, [idSlink, idWordPess]);

	return (
		<Card
			title={
				<span onClick={() => window.history.back()} style={{ cursor: 'pointer' }}>
					<ArrowLeftOutlined /> Quay lại
				</span>
			}
		>
			{/* Điều chỉnh để hiển thị component theo loại tin tức */}
			{isTinTucWP ? <ChiTietTinTucWpPage /> : <ChiTietTinSlink />}
		</Card>
	);
};

export default ChiTietTinTucPage;
