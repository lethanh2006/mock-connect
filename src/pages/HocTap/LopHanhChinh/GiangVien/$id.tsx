import ThongBao from '@/pages/LopTinChi/components/ThongBao';
import type { APILopHanhChinh } from '@/services/LopHanhChinh';
import { getDataLopHanhChinh, getDSSVLopHanhChinh } from '@/services/LopHanhChinh/lophanhchinh';
import { TeamOutlined } from '@ant-design/icons';
import { Breadcrumb, Card, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { history, useModel } from 'umi';
import ThongTinChung from '../components/ThongTinChung';

const DetailLopHanhChinh = ({
  match: {
    params: { id },
  },
}: {
  match: { params: { id: number } };
}) => {
  const { record, setRecord } = useModel('lophanhchinh');
  const isNhanVien = localStorage.getItem('vaiTro') === 'nhan_vien';
  const [data, setData] = useState<APILopHanhChinh.INhanVienSinhVien>();

  const getData = async () => {
    const res = await getDSSVLopHanhChinh(id);
    setData(res?.data?.data);

    if (!record?.id)
      getDataLopHanhChinh('can-bo').then((response) => {
        const d = response?.data?.data;
        setRecord(d?.find((item: any) => item.id == id));
      });
  };

  useEffect(() => {
    getData();
  }, [id]);

  return (
    <Card
      bodyStyle={{ paddingTop: 4 }}
      title={
        <Breadcrumb style={{ cursor: 'pointer' }}>
          <Breadcrumb.Item
            onClick={() => {
              history.push('/lophanhchinh');
            }}
          >
            <TeamOutlined /> Lớp hành chính
          </Breadcrumb.Item>
          <Breadcrumb.Item>{record?.ten_lop_hanh_chinh ?? ''}</Breadcrumb.Item>
        </Breadcrumb>
      }
    >
      <Tabs>
        <Tabs.TabPane tab="Thông tin chung" key="1">
          <ThongTinChung
            danhSachSinhVien={data?.sinhVienList ?? []}
            diemTichLuyLonNhat={data?.diemTichLuyLonNhat}
            diemTichLuyNhoNhat={data?.diemTichLuyNhoNhat}
            diemTichLuyTB={data?.diemTichLuyTB}
          />
        </Tabs.TabPane>

        <Tabs.TabPane tab="Thông báo" key="4">
          <ThongBao isNhanVien={isNhanVien} id={id} typeLop="LopHanhChinh" />
        </Tabs.TabPane>
      </Tabs>
    </Card>
  );
};

export default DetailLopHanhChinh;
