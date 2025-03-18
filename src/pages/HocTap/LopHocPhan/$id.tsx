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
	TeamOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Card, Col, Row } from 'antd';
import { useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import { history, useModel } from 'umi';
import CardThongBao from '../../ThongBao/ThongBaoLop/CardThongBao';
import DetailKetQuaHocTap from '../KetQuaHocTap/components/DetailKetQuaHocTap';
import CardGiangVienLop from './components/CardGiangVien';
import ThongTinChung from './components/ThongTinChung';
import DanhGiaGiangVienPage from './DanhGiaGiangVien';
import DanhSachBuoiHoc from './LichHoc';
import CardBuoiHocTiepTheo from './LichHoc/CardBuoiHocTiepTheo';
import LmsOdooPage from './LMS';

const DetailLopTinChi = ({
	match: {
		params: { id },
	},
}: {
	match: { params: { id: string } };
}) => {
	const { record: recHocKy, getModel: getHocKy } = useModel('daotao.hocky');
	const { record, sinhVienGetByIdModel, setRecord, loading } = useModel('lophocphan.lophocphan');
	// const { getAllModel: getAllNhanSu, danhSach: danhSachNhanSu, loading } = useModel('lophocphan.nhansulophocphan');
	const { settings, getByKeyModel: getSettings } = useModel('tienich.caidat');
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
			// getAllNhanSu(false, undefined, { lopHocPhanId: id });
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

	const menus = [
		{
			title: titles[0],
			menuKey: paths[0],
			content: (
				<Row gutter={[16, 16]}>
					<Col span={24} md={{ span: 8, push: 16 }} xxl={{ span: 6, push: 18 }}>
						<Row gutter={[16, 16]}>
							<Col span={24}>
								<CardBuoiHocTiepTheo />
							</Col>
							<Col span={24}>
								<CardGiangVienLop
									danhSachNhanSu={record?.nhanSuList ?? []}
									title='Giảng viên lớp học'
									loading={loading}
								/>
							</Col>
							<Col span={24}>
								<CardThongBao
									loai='lop-hoc-phan'
									idLop={record?._id}
									onShowAll={() => (window.location.hash = 'thong-bao')}
								/>
							</Col>
						</Row>
					</Col>
					<Col span={24} md={{ span: 16, pull: 8 }} xxl={{ span: 18, pull: 6 }}>
						<ThongTinChung />
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
			content: <ThongBaoLopPage loai='lop-hoc-phan' idLop={id} />,
			icon: <BellOutlined />,
		},
		{
			title: titles[3],
			menuKey: paths[3],
			content: <DienDan idLopHocPhan={record?._id ?? id} />,
			icon: <MessageOutlined />,
		},

		{
			title: titles[4],
			menuKey: paths[4],
			content: <LmsOdooPage idLopHocPhan={id} />,
			hide: !(settings?.GENERAL_INFO?.lmsMode === 'odoo' && record?.syncLms),
			icon: <LaptopOutlined />,
		},

		{
			title: titles[5],
			menuKey: paths[5],
			content: <BaiTapPage lopHocPhanId={id} />,
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
		<Card
			bodyStyle={{ paddingTop: 4 }}
			title={
				<Breadcrumb style={{ cursor: 'pointer' }}>
					<Breadcrumb.Item onClick={() => history.push('/hoc-tap/lop-tin-chi')}>
						<TeamOutlined /> Lớp tín chỉ
					</Breadcrumb.Item>
					<Breadcrumb.Item>{record?.ten ?? ''}</Breadcrumb.Item>
				</Breadcrumb>
			}
		>
			<TabViewPage hideCard menu={menus} />
		</Card>
	);
};

export default DetailLopTinChi;
