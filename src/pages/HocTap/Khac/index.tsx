import { TabViewPage } from '@/components/TabViewPage';
import DangKyChuyenNganhPage from '@/pages/SinhVien/DangKyChuyenNganh';
import TheChatPage from '@/pages/TienIch/TheChat';
import { CheckCircleOutlined, ProfileOutlined, SmileOutlined, StopOutlined } from '@ant-design/icons';
import BaoLuuThoiHoc from '../BaoLuuThoiHoc';
import XetHocVuPage from '../XetHocVu';

const HocTapKhacPage = () => {
	return (
		<TabViewPage
			cardTitle='Học tập khác'
			menu={[
				{
					icon: <ProfileOutlined />,
					title: 'Đăng ký chuyên ngành',
					menuKey: 'dang-ky-chuyen-nganh',
					content: <DangKyChuyenNganhPage />,
				},
				{
					icon: <CheckCircleOutlined />,
					title: 'Xét học vụ',
					menuKey: 'xet-hoc-vu',
					content: <XetHocVuPage />,
				},
				{
					icon: <StopOutlined />,
					title: 'Bảo lưu, thôi học',
					menuKey: 'baoluu-thoihoc',
					content: <BaoLuuThoiHoc />,
				},
				{
					icon: <SmileOutlined />,
					title: 'Thể chất sinh viên',
					menuKey: 'thechat',
					content: <TheChatPage />,
				},
			]}
		/>
	);
};

export default HocTapKhacPage;
