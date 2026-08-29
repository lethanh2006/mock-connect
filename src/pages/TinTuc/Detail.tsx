import { ArrowLeftOutlined } from '@ant-design/icons';
import { Card } from 'antd';
import queryString from 'query-string';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import './components/styles.less';
import ChiTietTinSlink from './Slink/ChiTietTinTuc';

const ChiTietTinTucPage = () => {
	const intl = useIntl();
	const { getByIdModel: getIdTinTucSlink, setRecord: setRecordSlink } = useModel('tintuc.tintuc');
	const { location } = window;

	const { id: idSlink } = queryString.parse(location.search);

	const fetchData = async () => {
		getIdTinTucSlink(idSlink as string).then(() => {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		});
	};

	useEffect(() => {
		fetchData();

		return () => {
			setRecordSlink(undefined);
		};
	}, [idSlink]);

	return (
		<Card
			title={
				<span onClick={() => window.history.back()} style={{ cursor: 'pointer' }}>
					<ArrowLeftOutlined /> {intl.formatMessage({ id: 'global.button.quaylai' })}
				</span>
			}
		>
			<ChiTietTinSlink />
		</Card>
	);
};

export default ChiTietTinTucPage;
