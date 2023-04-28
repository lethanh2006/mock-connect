import Donut from '@/components/Chart/Pie';
import {
  adminGetSoDonHomNay,
  adminGetTongSoDon,
  chuyenVienDieuPhoiGetSoDonHomNay,
  chuyenVienDieuPhoiGetTongSoDon,
} from '@/services/Dashboard/dashboard';
import { TrangThaiDonDVMC } from '@/utils/constants';
import { Badge, Card, Col, Row, Select, Statistic } from 'antd';
import { useEffect, useState } from 'react';
import { useAccess, useModel } from 'umi';

interface DataSoLuongDon {
  trangThai: string;
  soLuong: number;
}

const ThongTinTongHop = () => {
  const access = useAccess();
  const { danhSach, loaiDichVu, setRecord } = useModel('dichvumotcuav2');
  const { recordTongSoDon, idDichVu, setIdDichVu } = useModel('dashboard');
  const [donHomNay, setDonHomNay] = useState<DataSoLuongDon[]>();
  const [tongSoDon, setTongSoDon] = useState<DataSoLuongDon[]>();
  const { pathname } = window.location;
  const isDvmc = pathname?.includes('dichvumotcua') ?? false;

  const getDonHomNay = async () => {
    const response = access.adminVaQuanTri
      ? await adminGetSoDonHomNay({ loaiDichVu: isDvmc ? 'DVMC' : 'VAN_PHONG_SO' })
      : await chuyenVienDieuPhoiGetSoDonHomNay({ loaiDichVu: isDvmc ? 'DVMC' : 'VAN_PHONG_SO' });
    setDonHomNay(response?.data?.data ?? []);
  };

  const getTongSoDon = async () => {
    const response = access.adminVaQuanTri
      ? await adminGetTongSoDon({ loaiDichVu: isDvmc ? 'DVMC' : 'VAN_PHONG_SO' })
      : await chuyenVienDieuPhoiGetTongSoDon({ loaiDichVu: isDvmc ? 'DVMC' : 'VAN_PHONG_SO' });
    setTongSoDon(response?.data?.data ?? []);
  };

  useEffect(() => {
    getDonHomNay();
    getTongSoDon();

    return () => {
      setIdDichVu(undefined);
    };
  }, [loaiDichVu]);

  return (
    <Row gutter={[20, 20]}>
      <Col xs={24} md={10} lg={8} xl={6}>
        <Row gutter={[20, 20]}>
          <Col xs={24}>
            <Card>
              <Statistic
                title={<div style={{ fontSize: 16 }}>Tổng số đơn</div>}
                value={tongSoDon?.reduce((previousValue, currentValue) => {
                  return previousValue + currentValue?.soLuong;
                }, 0)}
              />
              <Badge style={{ marginRight: 8 }} color="blue" /> Đang xử lý:
              {tongSoDon?.find((item) => item.trangThai === 'PROCESSING')?.soLuong ?? 0}
              <br />
              <Badge style={{ marginRight: 8 }} color="green" />
              Đã duyệt: {tongSoDon?.find((item) => item.trangThai === 'OK')?.soLuong ?? 0}
              <br />
              <Badge style={{ marginRight: 8 }} color="red" />
              Không duyệt: {tongSoDon?.find((item) => item.trangThai === 'NOT_OK')?.soLuong ?? 0}
            </Card>
          </Col>
          <Col xs={24}>
            <Card>
              <Statistic
                title={<div style={{ fontSize: 16 }}>Số lượng đơn hôm nay</div>}
                value={donHomNay?.reduce((previousValue, currentValue) => {
                  return previousValue + currentValue?.soLuong;
                }, 0)}
              />
              <Badge style={{ marginRight: 8 }} color="blue" />
              Đang xử lý: {donHomNay?.find((item) => item.trangThai === 'PROCESSING')?.soLuong ?? 0}
              <br />
              <Badge style={{ marginRight: 8 }} color="green" />
              Đã duyệt: {donHomNay?.find((item) => item.trangThai === 'OK')?.soLuong ?? 0}
              <br />
              <Badge style={{ marginRight: 8 }} color="red" />
              Không duyệt: {donHomNay?.find((item) => item.trangThai === 'NOT_OK')?.soLuong ?? 0}
            </Card>
          </Col>
        </Row>
      </Col>
      <Col xs={24} md={14} lg={16} xl={18}>
        <Card
          title={
            <div>
              Số lượng đơn theo từng dịch vụ
              <Select
                allowClear
                placeholder="Lọc theo loại dịch vụ"
                onChange={(val: string | undefined) => {
                  setIdDichVu(val);
                  setRecord(
                    val
                      ? danhSach?.find((item) => item._id === val)
                      : ({
                          _id: {
                            $in: danhSach?.map((item) => item._id),
                          },
                        } as any),
                  );
                }}
                showSearch
                value={idDichVu}
                style={{ width: '400px', float: 'right' }}
              >
                {danhSach?.map((item) => (
                  <Select.Option key={item._id} value={item._id}>
                    {item.ten}
                  </Select.Option>
                ))}
              </Select>
            </div>
          }
        >
          <Donut
            labelTotal="đơn"
            height={272}
            data={recordTongSoDon?.map((item) => ({
              x: TrangThaiDonDVMC?.[item.trangThai],
              y: item.soLuong,
            }))}
          />
        </Card>
      </Col>
      <Col />
    </Row>
  );
};

export default ThongTinTongHop;
