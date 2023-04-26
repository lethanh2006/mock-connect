import { TeamOutlined } from '@ant-design/icons';
import { Breadcrumb, Card, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { history, useAccess, useModel } from 'umi';
import './components/style.less';
import ThongTinChung from './components/ThongTinChung';
import DanhSachBuoiHoc from './components/ThongTinBuoiHoc';

const DetailLopTinChi = ({
  match: {
    params: { id },
  },
}: {
  match: { params: { id: string } };
}) => {
  const access = useAccess();
  const { record, sinhVienGetLopTinChiByIdModel } = useModel('hoctap.loptinchi');
  const hash = window.location.hash;
  const [tabActive, setTabActive] = useState<string>(hash.includes('danhgia') ? '6' : '1');
  const isNhanVien = localStorage.getItem('vaiTro') === 'nhan_vien';

  // useEffect(() => {
  //   getThongTinChungLopTinChi(id);
  // }, [id]);

  useEffect(() => {
    if (id) sinhVienGetLopTinChiByIdModel(id);
  }, [id]);
  console.log(record, 'record');

  return (
    <Card
      bodyStyle={{ paddingTop: 4 }}
      title={
        <Breadcrumb style={{ cursor: 'pointer' }}>
          <Breadcrumb.Item
            onClick={() => {
              history.push('/hoc-tap/lop-tin-chi');
            }}
          >
            <TeamOutlined /> Lớp tín chỉ
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            {record?.hocPhan?.ma ?? ''} - {record?.hocPhan?.ten ?? ''}
          </Breadcrumb.Item>
        </Breadcrumb>
      }
    >
      <Tabs
        onChange={(tab) => {
          setTabActive(tab);
        }}
        activeKey={tabActive}
      >
        <Tabs.TabPane tab="Thông tin chung" key="1">
          <ThongTinChung id={id} isGiangVien={isNhanVien} />
        </Tabs.TabPane>

        <Tabs.TabPane tab="Danh sách buổi học" key="2">
          <DanhSachBuoiHoc idLopTinChi={id} isGiangVien={isNhanVien} />
        </Tabs.TabPane>

        {/* <Tabs.TabPane tab="Kết quả học tập" key="3">
          {isNhanVien ? (
            <KetQuaHocTapGV id={id} isDisplay={tabActive === '3'} />
          ) : (
            <KetQuaHocTapSV
              id={id}
              // tabActive={tabActive}
              isDisplay={tabActive === '3'}
              onSetActiveTab={() => {
                setTabActive('6');
              }}
            />
          )}
        </Tabs.TabPane> */}
        {/* <Tabs.TabPane tab="Thông báo" key="4">
          <ThongBao isNhanVien={isNhanVien} id={id} typeLop="LopTinChi" />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Học liệu số" key="5">
          <HocLieuSo />
        </Tabs.TabPane>
        {access.nhanVien && (
          <Tabs.TabPane tab="Nhập điểm">
            <NhapDiem id={id} />
          </Tabs.TabPane>
        )}
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
