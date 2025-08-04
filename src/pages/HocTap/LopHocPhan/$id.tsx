import { TabViewPage } from '@/components/TabViewPage';
import BaiTapPage from '@/pages/HocTap/LopHocPhan/BaiTap';
import DienDan from '@/pages/HocTap/LopHocPhan/DienDan';
import ThongBaoLopPage from '@/pages/ThongBao/ThongBaoLop';
import { ESettingKey } from '@/services/base/constant';
import { ipDaoTao } from '@/utils/ip';
import {
	BarChartOutlined,
	BellOutlined,
	CalendarOutlined,
	FileTextOutlined,
	InfoCircleOutlined,
	LaptopOutlined,
	MessageOutlined,
	StarOutlined,
} from '@ant-design/icons';
import { Col, Row, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import { history, useModel, useParams } from 'umi';
import DetailKetQuaHocTap from '../KetQuaHocTap/components/DetailKetQuaHocTap';
import DanhSachGiangVien from './components/DanhSachGiangVien';
import DanhSachSinhVien from './components/DanhSachSinhVien';
import ThongTinChungV2 from './components/ThongTinChung';
import ThongTinChungHeaderCard from './components/ThongTinChungHeaderCard';
import DanhGiaGiangVienPage from './DanhGiaGiangVien';
import DanhSachBuoiHoc from './LichHoc';
import LmsOdooPage from './LMS';

const DetailLopTinChi = () => {
	const { id } = useParams<{ id: string }>();
	const { record: recHocKy, getModel: getHocKy } = useModel('daotao.hocky');
	const { record, sinhVienGetByIdModel, setRecord, loading } = useModel('lophocphan.lophocphan');
	const { settings, getByKeyModel: getSettings } = useModel('tienich.caidat');
	const {
		record: recLopThucHanh,
		danhSach: danhSachLopThucHanh,
		sinhVienGetByIdModel: getByIdLopThucHanh,
		sinhVienGetModel: getLopThucHanh,
		danhSachNhanSu: danhSachNhanSuLopTH,
		getAllNhanSuModel: getNhanSuLopTH,
		loading: loadingThucHanh,
	} = useModel('daotao.lopthuchanh');
	const [activeKey, setActiveKey] = useState<string>('-1');
	const auth = useAuth();
	const paths = ['thong-tin', 'buoi-hoc', 'thong-bao', 'dien-dan', 'lms', 'bai-tap', 'ket-qua', 'danh-gia-giang-vien'];
	const titles = [
		'Thông tin chung',
		'Lịch học',
		'Thông báo',
		'Diễn đàn',
		'Kết quả LMS',
		'Bài tập, bài kiểm tra',
		'Kết quả học tập',
		'Đánh giá giảng viên',
	];

	useEffect(() => {
		getSettings(ESettingKey.GENERAL_INFO, ipDaoTao);
	}, []);

	const getData = () => {
		if (id) {
			sinhVienGetByIdModel(id)
				.then((rec) => {
					if (rec.parent?._id) history.replace(`/hoc-tap/lop-tin-chi/${rec.parent._id}${window.location.hash}`);
					else if (!recHocKy?._id) getHocKy({ ma: rec?.maHocKy });
				})
				.catch((er) => {
					history.push('/hoc-tap/lop-tin-chi');
				});
		}
	};

	useEffect(() => {
		if (auth.user?.access_token) {
			const path = window.location.pathname;
			// Nếu là link lấy từ giảng viên thì chuyển đến đúng link của sinh viên
			if (path.startsWith('/giang-day/lop-tin-chi/')) {
				window.history.replaceState(
					{},
					document.title,
					`/hoc-tap/lop-tin-chi/${id}${window.location.search}${window.location.hash}`,
				);
			} else getData();
		}

		return () => {
			setRecord(undefined);
		};
	}, [auth.user?.access_token, id]);

	// Thêm useEffect để lấy dữ liệu nhóm thực hành
	useEffect(() => {
		setActiveKey('-1');
		if (record?._id) {
			getLopThucHanh({ tenCha: record?.ten });
		}
	}, [record?._id]);

	useEffect(() => {
		if (activeKey !== '-1') {
			getByIdLopThucHanh(activeKey);
			getNhanSuLopTH(activeKey);
		}
	}, [activeKey]);

	const menus = [
		{
			title: titles[0],
			menuKey: paths[0],
			content: (
				<Row gutter={[16, 16]}>
					<Col span={24} md={{ span: 16 }} xxl={{ span: 18 }}>
						<ThongTinChungV2 />
					</Col>
					<Col span={24} md={{ span: 8 }} xxl={{ span: 6 }}>
						<Row
							gutter={[16, 16]}
							style={{
								// maxHeight: '120vh',
								overflowX: 'auto',
								scrollbarWidth: 'none', // Firefox
								msOverflowStyle: 'none', // IE 10+
							}}
						>
							<Col span={24}>
								<Tabs activeKey={activeKey} onChange={(val) => setActiveKey(val)} style={{ marginTop: 16 }}>
									<Tabs.TabPane tab='Danh sách sinh viên' key='-1' />
									{danhSachLopThucHanh?.map((item) => (
										<Tabs.TabPane tab={`Nhóm ${item.loai} ${item.soThuTuNhom}`} key={item._id} />
									))}
								</Tabs>

								{activeKey !== '-1' ? (
									<DanhSachGiangVien danhSachNhanSu={danhSachNhanSuLopTH} title='Giảng viên phụ trách nhóm lớp' />
								) : null}

								<DanhSachSinhVien
									sinhVienList={
										activeKey !== '-1' ? (recLopThucHanh?.sinhVienList ?? []) : (record?.sinhVienList ?? [])
									}
									loading={loading || loadingThucHanh}
									fromLopHocPhan
								/>
							</Col>
						</Row>
					</Col>
				</Row>
			),
			icon: <InfoCircleOutlined />,
		},
		{
			title: titles[1],
			menuKey: paths[1],
			content: <DanhSachBuoiHoc />,
			icon: <CalendarOutlined />,
		},
		{
			title: titles[2],
			menuKey: paths[2],
			content: <ThongBaoLopPage loai='lop-hoc-phan' idLop={id as string} />,
			icon: <BellOutlined />,
		},
		{
			title: titles[3],
			menuKey: paths[3],
			content: <DienDan idLopHocPhan={record?._id ?? (id as string)} />,
			icon: <MessageOutlined />,
		},

		{
			title: titles[4],
			menuKey: paths[4],
			content: <LmsOdooPage idLopHocPhan={id as string} />,
			hide: !(settings?.GENERAL_INFO?.lmsMode === 'odoo' && record?.syncLms),
			icon: <LaptopOutlined />,
		},

		{
			title: titles[5],
			menuKey: paths[5],
			content: <BaiTapPage lopHocPhanId={id as string} />,
			icon: <FileTextOutlined />,
		},
		{
			title: titles[6],
			menuKey: paths[6],
			content: (
				<>
					<h4 style={{ fontWeight: 600, fontSize: 16, marginBottom: 10 }}>Chi tiết điểm học phần</h4>
					<DetailKetQuaHocTap
						lopHocPhanId={record?._id}
						toDanhGiaGiangVien={() => (window.location.hash = 'danh-gia-giang-vien')}
					/>
				</>
			),
			icon: <BarChartOutlined />,
		},
		{
			title: titles[7],
			menuKey: paths[7],
			content: <DanhGiaGiangVienPage danhSachNhanSu={record?.nhanSuList ?? []} />,
			icon: <StarOutlined />,
		},
	];

	return (
		<>
			<ThongTinChungHeaderCard />
			<TabViewPage
				hideCard
				menu={menus}
				tabType='line'
				tabStyle={{
					backgroundColor: 'transparent',
					marginTop: '-48px', // để phần Tabpane nằm bên trong ThongTinChungHeaderCard
				}}
			/>
		</>
	);
};

export default DetailLopTinChi;
