import BaiTapPage from '@/pages/DaoTao/BaiTap';
import DienDan from '@/pages/HocTap/LopHocPhan/DienDan';
import ThongBaoLopPage from '@/pages/ThongBao/ThongBaoLop';
import { TeamOutlined } from '@ant-design/icons';
import { Breadcrumb, Card, Col, Row, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { history, useModel } from 'umi';
import DetailKetQuaHocTap from '../KetQuaHocTap/components/DetailKetQuaHocTap';
import DanhGiaGiangVienPage from './DanhGiaGiangVien';
import DanhSachBuoiHoc from './LichHoc';
import CardBuoiHocTiepTheo from './LichHoc/CardBuoiHocTiepTheo';
import CardThongBao from './ThongBao/CardThongBao';
import CardGiangVienLop from './components/CardGiangVien';
import ThongTinChung from './components/ThongTinChung';

const DetailLopTinChi = ({
	match: {
		params: { id },
	},
}: {
	match: { params: { id: string } };
}) => {
	const { record: recHocKy, getModel: getHocKy } = useModel('daotao.hocky');
	const { record, sinhVienGetByIdModel, setRecord } = useModel('lophocphan.lophocphan');
	const { getAllModel: getAllNhanSu, danhSach: danhSachNhanSu, loading } = useModel('lophocphan.nhansulophocphan');
	const paths = ['thong-tin', 'buoi-hoc', 'thong-bao', 'ket-qua', 'danh-gia', 'dien-dan', 'bai-tap'];
	const [tabActive, setTabActive] = useState<string>(paths[0]);
	const hash = window.location.hash?.replace('#', '') ?? paths[0];

	const getData = () => {
		if (id) {
			sinhVienGetByIdModel(id).then((rec) => {
				if (!recHocKy?._id) getHocKy({ ma: rec?.maHocKy });
			});
			getAllNhanSu(false, undefined, { lopHocPhanId: id });
		}
	};

	useEffect(() => {
		getData();

		return () => {
			setRecord(undefined);
		};
	}, [id]);

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
				<Tabs.TabPane tab='Diễn đàn' key={paths[5]} />
				<Tabs.TabPane tab='Lịch học' key={paths[1]} />
				<Tabs.TabPane tab='Bài tập' key={paths[6]} />
				<Tabs.TabPane tab='Thông báo' key={paths[2]} />
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
								<CardGiangVienLop danhSachNhanSu={danhSachNhanSu} title='Giảng viên lớp học' loading={loading} />
							</Col>
							<Col span={24}>
								<CardThongBao />
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
					<DetailKetQuaHocTap lopHocPhanId={record?._id} />
				</>
			) : tabActive === paths[4] ? (
				<DanhGiaGiangVienPage />
			) : tabActive === paths[5] ? (
				<DienDan idLopHocPhan={record?._id ?? id} />
			) : tabActive === paths[6] ? (
				<BaiTapPage lopHocPhanId={id} />
			) : null}
		</Card>
	);
};

export default DetailLopTinChi;
