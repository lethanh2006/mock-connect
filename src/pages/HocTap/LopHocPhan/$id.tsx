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
	const { record, sinhVienGetByIdModel } = useModel('daotao.lophocphan');
	const hash = window.location.hash;
	const [tabActive, setTabActive] = useState<string>(hash.includes('danhgia') ? '6' : '1');

	useEffect(() => {
		if (id)
			sinhVienGetByIdModel(id).then((rec) => {
				if (!recHocKy?._id) getHocKy({ ma: rec?.maHocKy });
			});
	}, [id]);

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
			<Tabs onChange={(tab) => setTabActive(tab)} activeKey={tabActive}>
				<Tabs.TabPane tab='Thông tin chung' key='1'>
					<ThongTinChung />
				</Tabs.TabPane>

				<Tabs.TabPane tab='Danh sách buổi học' key='2'>
					<DanhSachBuoiHoc />
				</Tabs.TabPane>
				<Tabs.TabPane tab='Thông báo' key='4'>
					<ThongBaoLopPage loai='lop-hoc-phan' idLop={id} />
				</Tabs.TabPane>

				<Tabs.TabPane tab='Kết quả học tập' key='3'>
					<h4 style={{ fontWeight: 600, fontSize: 16, marginBottom: 10 }}>Chi tiết điểm lớp tín chỉ</h4>
					<DetailKetQuaHocTap lopHocPhanId={record?._id} />
				</Tabs.TabPane>

				<Tabs.TabPane tab='Đánh giá giảng viên' key='5'>
					<DanhGiaGiangVienPage />
				</Tabs.TabPane>

				{/*
        <Tabs.TabPane tab="Học liệu số" key="5">
          <HocLieuSo />
        </Tabs.TabPane>
        {access.sinhVien && thongTinChung?.giangVienList?.length > 0 && (
          <Tabs.TabPane tab="Đánh giá giảng viên" key="6">
            <DanhGiaGiangVien idLop={id} />
          </Tabs.TabPane>
        )} */}
			</Tabs>
		</Card>
	);
};

export default DetailLopTinChi;
