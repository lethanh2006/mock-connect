import Donut from '@/components/Chart/Pie';
import {
  adminGetSoDonHomNay,
  adminGetTongSoDon,
  chuyenVienDieuPhoiGetSoDonHomNay,
  chuyenVienDieuPhoiGetTongSoDon,
} from '@/services/Dashboard/dashboard';
import type { DichVuMotCuaV2 } from '@/services/DichVuMotCuaV2/typing';
import { ColorTrangThaiDonMotCua, TrangThaiDonDVMC } from '@/utils/constants';
import { Badge, Card, Col, Row, Spin, Statistic } from 'antd';
import { useEffect, useState } from 'react';
import { useAccess, useModel } from 'umi';

interface DataSoLuongDon {
  trangThai: string;
  soLuong: number;
}

const ThongTinTongHop = () => {
  const access = useAccess();
  const { danhSach: danhSachBieuMau } = useModel('dichvumotcuav2');
  const [donHomNay, setDonHomNay] = useState<DataSoLuongDon[]>();
  const [tongSoDon, setTongSoDon] = useState<DataSoLuongDon[]>();
  const [donDichVu, setDonDichVu] = useState<
    { bieuMau: DichVuMotCuaV2.BieuMau; soLuongDon: DataSoLuongDon[] }[]
  >([]);
  const [loading, setLoading] = useState(false);

  const getDonHomNay = async () => {
    const response = access.adminVaQuanTri
      ? await adminGetSoDonHomNay({ loaiDichVu: 'VAN_PHONG_SO' })
      : await chuyenVienDieuPhoiGetSoDonHomNay({ loaiDichVu: 'VAN_PHONG_SO' });
    setDonHomNay(response?.data?.data ?? []);
  };

  const getTongSoDon = async () => {
    const response = access.adminVaQuanTri
      ? await adminGetTongSoDon({ loaiDichVu: 'VAN_PHONG_SO' })
      : await chuyenVienDieuPhoiGetTongSoDon({ loaiDichVu: 'VAN_PHONG_SO' });
    setTongSoDon(response?.data?.data ?? []);
  };

  const fetchData = async () => {
    setLoading(true);
    const d: any = [];
    Promise.all(
      danhSachBieuMau.map(async (element) => {
        const response = access.adminVaQuanTri
          ? await adminGetTongSoDon({
              idDichVu: element._id,
              loaiDichVu: 'VAN_PHONG_SO',
            })
          : await chuyenVienDieuPhoiGetTongSoDon({
              idDichVu: element._id,
              loaiDichVu: 'VAN_PHONG_SO',
            });
        d.push({ bieuMau: element, soLuongDon: response?.data?.data ?? [] });
      }),
    ).then(() => {
      setDonDichVu(d);
      setLoading(false);
    });
  };

  useEffect(() => {
    getDonHomNay();
    getTongSoDon();
  }, []);

  useEffect(() => {
    fetchData();
  }, [danhSachBieuMau.length]);

  return (
    <Row gutter={[20, 20]}>
      <Col xs={24} md={10} lg={8} xl={6}>
        <Row gutter={[20, 20]} style={{ height: '100%' }}>
          <Col xs={24}>
            <Card style={{ height: '100%' }}>
              <Statistic
                title={<div style={{ fontSize: 16 }}>Tổng số đơn</div>}
                value={tongSoDon?.reduce((previousValue, currentValue) => {
                  return previousValue + currentValue?.soLuong;
                }, 0)}
              />
              <Badge style={{ marginRight: 8 }} color={ColorTrangThaiDonMotCua.PROCESSING} />
              Đang xử lý:{' '}
              <b>{tongSoDon?.find((item) => item.trangThai === 'PROCESSING')?.soLuong ?? 0}</b>
              <br />
              <Badge style={{ marginRight: 8 }} color={ColorTrangThaiDonMotCua.OK} />
              Đã duyệt: <b>{tongSoDon?.find((item) => item.trangThai === 'OK')?.soLuong ?? 0}</b>
              <br />
              <Badge style={{ marginRight: 8 }} color={ColorTrangThaiDonMotCua.NOT_OK} />
              Không duyệt:{' '}
              <b>{tongSoDon?.find((item) => item.trangThai === 'NOT_OK')?.soLuong ?? 0}</b>
            </Card>
          </Col>

          <Col xs={24}>
            <Card style={{ height: '100%' }}>
              <Statistic
                title={<div style={{ fontSize: 16 }}>Số lượng đơn hôm nay</div>}
                value={donHomNay?.reduce((previousValue, currentValue) => {
                  return previousValue + currentValue?.soLuong;
                }, 0)}
              />
              <Badge style={{ marginRight: 8 }} color={ColorTrangThaiDonMotCua.PROCESSING} />
              Đang xử lý:{' '}
              <b>{donHomNay?.find((item) => item.trangThai === 'PROCESSING')?.soLuong ?? 0}</b>
              <br />
              <Badge style={{ marginRight: 8 }} color={ColorTrangThaiDonMotCua.OK} />
              Đã duyệt: <b>{donHomNay?.find((item) => item.trangThai === 'OK')?.soLuong ?? 0}</b>
              <br />
              <Badge style={{ marginRight: 8 }} color={ColorTrangThaiDonMotCua.NOT_OK} />
              Không duyệt:{' '}
              <b>{donHomNay?.find((item) => item.trangThai === 'NOT_OK')?.soLuong ?? 0}</b>
            </Card>
          </Col>
        </Row>
      </Col>

      <Col xs={24} md={14} lg={16} xl={18}>
        <Card title="Số lượng đơn theo từng dịch vụ" style={{ height: '100%' }}>
          <Spin spinning={loading}>
            <Row gutter={[12, 12]}>
              {donDichVu.map((dichVu) => (
                <Col key={dichVu.bieuMau._id} span={24} md={8}>
                  <Donut
                    labelTotal=""
                    height={220}
                    data={dichVu.soLuongDon?.map((item) => ({
                      x: TrangThaiDonDVMC?.[item.trangThai],
                      y: item.soLuong,
                    }))}
                    color={dichVu.soLuongDon?.map(
                      (item) => ColorTrangThaiDonMotCua?.[item.trangThai],
                    )}
                    hideLegend
                  />
                  <div style={{ textAlign: 'center', fontWeight: 600, fontSize: 16 }}>
                    {dichVu.bieuMau.ten}
                  </div>
                </Col>
              ))}
            </Row>
          </Spin>

          <div style={{ marginTop: '15px' }}>
            Ghi chú:
            <Badge
              style={{ marginRight: '8px', marginLeft: '25px' }}
              color={ColorTrangThaiDonMotCua.PROCESSING}
            />
            Đang xử lý
            <Badge
              style={{ marginRight: '8px', marginLeft: '25px' }}
              color={ColorTrangThaiDonMotCua.OK}
            />
            Đã duyệt
            <Badge
              style={{ marginRight: '8px', marginLeft: '25px' }}
              color={ColorTrangThaiDonMotCua.NOT_OK}
            />
            Không duyệt
          </div>
        </Card>
      </Col>
      <Col />
    </Row>
  );
};

export default ThongTinTongHop;
