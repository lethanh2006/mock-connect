import { TabViewPage } from '@/components/TabViewPage';
import TheChatPage from '@/pages/TienIch/TheChat';
import { CheckCircleOutlined, SmileOutlined, StopOutlined } from '@ant-design/icons';
import { useIntl } from 'umi';
import BaoLuuThoiHoc from '../BaoLuuThoiHoc';
import XetHocVuPage from '../XetHocVu';

const HocTapKhacPage = () => {
	const intl = useIntl();

	const menu = [
		{
			icon: <CheckCircleOutlined />,
			title: intl.formatMessage({ id: 'hoctapkhac.xethocvu.title' }),
			menuKey: 'xet-hoc-vu',
			content: <XetHocVuPage />,
		},
		{
			icon: <StopOutlined />,
			title: intl.formatMessage({ id: 'hoctapkhac.baoluuthoihoc.title' }),
			menuKey: 'baoluu-thoihoc',
			content: <BaoLuuThoiHoc />,
		},
		{
			icon: <SmileOutlined />,
			title: intl.formatMessage({ id: 'hoctapkhac.thechatsinhvien.title' }),
			menuKey: 'thechat',
			content: <TheChatPage />,
		},
	];

	return (
		<TabViewPage
			cardBigTitle
			cardTitle={intl.formatMessage({ id: 'hoctapkhac.title' })}
			menu={menu}
		/>
	);
};

export default HocTapKhacPage;
