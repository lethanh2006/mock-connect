import ThongBaoLopPage from '@/pages/ThongBao/ThongBaoLop';
import { TeamOutlined } from '@ant-design/icons';
import { Breadcrumb, Card, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { history, useModel } from 'umi';
import DetailKetQuaHocTap from '../KetQuaHocTap/components/DetailKetQuaHocTap';
import DanhGiaGiangVienPage from './DanhGiaGiangVien';
import DanhSachBuoiHoc from './LichHoc';
import ThongTinChung from './components/ThongTinChung';

const DetailLopTinChi = ({
	match: {
		params: { id },
	},
}: {
	match: { params: { id: string } };
}) => {
	const { record: recHocKy, getModel: getHocKy } = useModel('daotao.hocky');
	const { record, sinhVienGetByIdModel } = useModel('lophocphan.lophocphan');
	const paths = ['thong-tin', 'buoi-hoc', 'thong-bao', 'ket-qua', 'danh-gia'];
	const [tabActive, setTabActive] = useState<string>(paths[0]);
	const hash = window.location.hash?.replace('#', '') ?? paths[0];

	useEffect(() => {
		if (id)
			sinhVienGetByIdModel(id).then((rec) => {
				if (!recHocKy?._id) getHocKy({ ma: rec?.maHocKy });
			});
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
				<Tabs.TabPane tab='Danh sách buổi học' key={paths[1]} />
				<Tabs.TabPane tab='Thông báo' key={paths[2]} />
				<Tabs.TabPane tab='Kết quả học tập' key={paths[3]} />
				<Tabs.TabPane tab='Đánh giá giảng viên' key={paths[4]} />
			</Tabs>

			{tabActive === paths[0] ? (
				<ThongTinChung />
			) : tabActive === paths[1] ? (
				<DanhSachBuoiHoc />
			) : tabActive === paths[2] ? (
				<ThongBaoLopPage loai='lop-hoc-phan' idLop={id} />
			) : tabActive === paths[3] ? (
				<>
					<h4 style={{ fontWeight: 600, fontSize: 16, marginBottom: 10 }}>Chi tiết điểm lớp tín chỉ</h4>
					<DetailKetQuaHocTap lopHocPhanId={record?._id} />
				</>
			) : paths[4] ? (
				<DanhGiaGiangVienPage />
			) : null}
		</Card>
	);
};

export default DetailLopTinChi;
