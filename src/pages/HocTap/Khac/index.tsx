import { TabViewPage } from '@/components/TabViewPage';
import DangKyChuyenNganhPage from '@/pages/SinhVien/DangKyChuyenNganh';
import TheChatPage from '@/pages/TienIch/TheChat';
import { CheckCircleOutlined, ProfileOutlined, SmileOutlined, StopOutlined } from '@ant-design/icons';
import { useIntl } from 'umi';
import BaoLuuThoiHoc from '../BaoLuuThoiHoc';
import XetHocVuPage from '../XetHocVu';

const HocTapKhacPage = () => {
	const intl = useIntl();
	return (
		<TabViewPage
			cardTitle={intl.formatMessage({ id: 'hoctapkhac.title' })}
			menu={[
				{
					icon: <ProfileOutlined />,
					title: intl.formatMessage({ id: 'hoctapkhac.dangkychuyennganh.title' }),
					menuKey: 'dang-ky-chuyen-nganh',
					content: <DangKyChuyenNganhPage />,
				},
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
			]}
		/>
	);
};

export default HocTapKhacPage;
