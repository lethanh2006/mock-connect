import { TabViewPage } from '@/components/TabViewPage';
import SelectSongNganh from '@/pages/DaoTao/SongNganh/SelectSongNganh';
import DangKyChuyenNganh from '@/pages/SinhVien/DangKyChuyenNganh';
import DangKyChuyenNganhPage from '@/pages/SinhVien/DangKyChuyenNganhMoi/History';
import TheChatPage from '@/pages/TienIch/TheChat';
import { CheckCircleOutlined, ProfileOutlined, SmileOutlined, StopOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useAccess, useIntl, useModel } from 'umi';
import BaoLuuThoiHoc from '../BaoLuuThoiHoc';
import XetHocVuPage from '../XetHocVu';

const HocTapKhacPage = () => {
	const intl = useIntl();
	const access = useAccess();
	const { maKhoaNganh, setMaKhoaNganh } = useModel('sinhvien.sinhvien');
	const [activeTab, setActiveTab] = useState<string>('dang-ky-chuyen-nganh');

	const shouldShowSelectSongNganh = activeTab === 'dang-ky-chuyen-nganh' || activeTab === 'dang-ky-chuyen-nganh-hep';

	const menu = [
		...(access.cctFilter()
			? [
				{
					icon: <ProfileOutlined />,
					title: intl.formatMessage({ id: 'hoctapkhac.dangkychuyennganh.title' }),
					menuKey: 'dang-ky-chuyen-nganh',
					content: <DangKyChuyenNganhPage type='concentration' />,
				},
				{
					icon: <ProfileOutlined />,
					title: intl.formatMessage({ id: 'hoctapkhac.dangkychuyennganhhep.title' }),
					menuKey: 'dang-ky-chuyen-nganh-hep',
					content: <DangKyChuyenNganhPage type='minor' />,
				},
			]
			: [
				{
					icon: <ProfileOutlined />,
					title: intl.formatMessage({ id: 'hoctapkhac.dangkychuyennganh.title' }),
					menuKey: 'dang-ky-chuyen-nganh',
					content: <DangKyChuyenNganh />,
				},
			]),
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
			cardProps={shouldShowSelectSongNganh ? { extra: <SelectSongNganh style={{ width: 250 }} value={maKhoaNganh} onChange={(val) => setMaKhoaNganh(val)} /> } : undefined}
			onChange={(tab) => setActiveTab(tab)}
			cardTitle={intl.formatMessage({ id: 'hoctapkhac.title' })}
			menu={menu}
		/>
	);
};

export default HocTapKhacPage;
