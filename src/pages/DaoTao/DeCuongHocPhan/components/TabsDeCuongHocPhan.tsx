import { Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl } from 'umi';
import ThongTinChungPage from './ThongTinChung';

const TabsDeCuongHocPhan = (props: { activeKey?: string; khoiChuongTrinh?: any }) => {
	const intl = useIntl();
	const [activeKey, setActiveKey] = useState<string>(props.activeKey || '0');

	useEffect(() => {
		setActiveKey(props.activeKey || '0');
	}, [props.activeKey]);

	return (
		<>
			<Tabs activeKey={activeKey} onChange={(tab) => setActiveKey(tab)}>
				<Tabs.TabPane key='0' tab={intl.formatMessage({ id: 'lophocphan.id.decuong.thongtinchung' })} />
				{/* <Tabs.TabPane key='5' tab={intl.formatMessage({ id: 'lophocphan.id.decuong.chuandaura' })} />
				<Tabs.TabPane key='4' tab={intl.formatMessage({ id: 'lophocphan.id.decuong.tomtat' })} /> */}
				{/* <Tabs.TabPane key='2' tab='Lịch trình cụ thể' /> */}
				{/* <Tabs.TabPane key='1' tab={intl.formatMessage({ id: 'lophocphan.id.decuong.gv' })} />
				<Tabs.TabPane key='3' tab={intl.formatMessage({ id: 'lophocphan.id.decuong.hoclieu' })} /> */}
			</Tabs>

			{activeKey === '0' ? (
				<ThongTinChungPage khoiChuongTrinh={props.khoiChuongTrinh} />
			) : // ) : activeKey === '1' ? (
			// 	<GiangVienDeCuongPage />
			// ) : activeKey === '2' ? (
			// 	<LichTrinhCuTheList />
			// ) : activeKey === '3' ? (
			// 	<HocLieuDeCuongPage />
			// ) : activeKey === '4' ? (
			// 	<NoiDungHocPhanPage />
			// ) : activeKey === '5' ? (
			// 	<ChuanDauRaHocPhanPage />
			null}
		</>
	);
};

export default TabsDeCuongHocPhan;
