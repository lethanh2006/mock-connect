import BaiTapPage from '@/pages/HocTap/LopHocPhan/BaiTap';
import DienDan from '@/pages/HocTap/LopHocPhan/DienDan';
import ThongBaoLopPage from '@/pages/ThongBao/ThongBaoLop';
import { ESettingKey } from '@/services/base/constant';
import { ipDaoTao } from '@/utils/ip';
import { TeamOutlined } from '@ant-design/icons';
import { Breadcrumb, Card, Col, Row, Tabs } from 'antd';
import { useEffect, useState } from 'react';
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
	const paths = ['thong-tin', 'buoi-hoc', 'thong-bao', 'ket-qua', 'danh-gia', 'dien-dan', 'bai-tap', 'lms'];
	const [tabActive, setTabActive] = useState<string>(paths[0]);
	const hash = window.location.hash?.replace('#', '') ?? paths[0];

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

	useEffect(() => {
		if (hash && paths.includes(hash)) setTabActive(hash);
		else setTabActive(paths[0]);
	}, [hash]);

	const onChangeTab = (tab: string) => {
		window.location.hash = tab === paths[0] ? '' : tab;
	};

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
			<Tabs onChange={onChangeTab} activeKey={tabActive}>
				<Tabs.TabPane tab='Thông tin chung' key={paths[0]} />
				<Tabs.TabPane tab='Lịch học' key={paths[1]} />
				<Tabs.TabPane tab='Thông báo' key={paths[2]} />
				<Tabs.TabPane tab='Diễn đàn' key={paths[5]} />
				{settings?.GENERAL_INFO?.lmsMode === 'odoo' && record?.syncLms ? (
					<Tabs.TabPane tab='Kết quả LMS' key={paths[7]} />
				) : null}
				<Tabs.TabPane tab='Bài tập, bài kiểm tra' key={paths[6]} />
				<Tabs.TabPane tab='Kết quả học tập' key={paths[3]} />
				<Tabs.TabPane tab='Đánh giá giảng viên' key={paths[4]} />
			</Tabs>

			{tabActive === paths[0] ? (
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
			) : tabActive === paths[1] ? (
				<DanhSachBuoiHoc />
			) : tabActive === paths[2] ? (
				<ThongBaoLopPage loai='lop-hoc-phan' idLop={id} />
			) : tabActive === paths[3] ? (
				<>
					<h4 style={{ fontWeight: 600, fontSize: 16, marginBottom: 10 }}>Chi tiết điểm học phần</h4>
					<DetailKetQuaHocTap lopHocPhanId={record?._id} toDanhGiaGiangVien={() => onChangeTab(paths[4])} />
				</>
			) : tabActive === paths[4] ? (
				<DanhGiaGiangVienPage danhSachNhanSu={record?.nhanSuList ?? []} />
			) : tabActive === paths[5] ? (
				<DienDan idLopHocPhan={record?._id ?? id} />
			) : tabActive === paths[6] ? (
				<BaiTapPage lopHocPhanId={id} />
			) : tabActive === paths[7] ? (
				<LmsOdooPage idLopHocPhan={id} />
			) : null}
		</Card>
	);
};

export default DetailLopTinChi;
