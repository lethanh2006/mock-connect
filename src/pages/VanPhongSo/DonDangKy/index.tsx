import Donut from '@/components/Chart/Pie';
import type { DichVuMotCuaV2 } from '@/services/DichVuMotCuaV2/typing';
import type { VanphongsoCsvc } from '@/services/VanPhongSo/typings';
import { getAllDonDangSuDung, getThongKeDonVps } from '@/services/VanPhongSo/vanphongso';
import { ColorTrangThaiDonMotCua } from '@/utils/constants';
import { Badge, Button, Card, Col, DatePicker, Row, Spin, Statistic, Tabs } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useAccess, useModel } from 'umi';
import DonBaoCaoSuCo from '../DonBaoCaoSuCo';
import DonMuonPhongHop from '../DonMuonPhongHop';
import DonMuonXe from '../DonMuonXe';
import ModalDonDangSuDung from './ModalDonDangSuDung';

const DonDangKy = () => {
  const {
    trangThaiQuanLyDon,
    setTrangThaiQuanLyDon,
    setCondition,
    condition,
    setTotal,
    setDanhSachDon,
    getAllBieuMauModel,
    setRecordDon,
    setRecord,
    setDanhSach,
    setLoaiDichVu,
  } = useModel('dichvumotcuav2');
  const [data, setData] = useState<VanphongsoCsvc.ThongKeDonVps>();
  const [dataThongKe, setDataThongKe] = useState<VanphongsoCsvc.DataSoLuongDon>();
  const [loading, setLoading] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [dateFilter, setDateFilter] = useState<{
    thoiGianBd?: string;
    thoiGianKt?: string;
  }>({} as any);
  const [dataDon, setDataDon] = useState<DichVuMotCuaV2.Don[]>([]);
  const { pathname } = window.location;
  const arrPathName = pathname?.split('/') ?? [];
  const access = useAccess();
  const isQuanLy = access.adminManyAccessFilter({
    listChucNang: ['quan-ly-muon-xe-cong', 'quan-ly-muon-phong-hop'],
  });
  const isXeCong = arrPathName?.includes('xecong');
  const isPhongHop = arrPathName?.includes('phonghop');
  const isBaoCaoSuCo = arrPathName?.includes('baocaosuco');

  const getDataThongKe = async () => {
    setLoading(true);
    const res = await getThongKeDonVps(dateFilter);
    setData(res?.data?.data ?? {});
    if (isXeCong) {
      setDataThongKe(res?.data?.data?.MUON_OTO ?? {});
    }
    if (isPhongHop) {
      setDataThongKe(res?.data?.data?.MUON_PHONG_HOC ?? {});
    }
    if (isBaoCaoSuCo) {
      setDataThongKe(res?.data?.data?.BAO_CAO_SU_CO ?? {});
    }
    setLoading(false);
  };

  useEffect(() => {
    getAllBieuMauModel('VAN_PHONG_SO'); // get biểu mẫu để render form động
    setLoaiDichVu('VAN_PHONG_SO');
    return () => {
      setTotal(0);
      setDanhSachDon([]);
      setCondition({});
      setRecordDon({} as DichVuMotCuaV2.Don);
      setDanhSach([]);
      setRecord({} as DichVuMotCuaV2.BieuMau);
    };
  }, []);

  useEffect(() => {
    if (isQuanLy) {
      getDataThongKe();
    }
  }, [dateFilter]);

  const handleFilterDonTheoThoiGian = (value: any) => {
    if (value) {
      const ngayBatDau = value?.[0];
      const ngayKetThuc = value?.[1];
      const timeStartString = moment(ngayBatDau).toISOString();
      const timeEndString = moment(ngayKetThuc).toISOString();
      setCondition({
        ...condition,
        createdAt: {
          $gte: moment(timeStartString).endOf('day').toDate(),
          $lte: moment(timeEndString).startOf('day').toDate(),
        },
      });
      setDateFilter({ thoiGianBd: timeStartString, thoiGianKt: timeEndString });
    } else {
      delete condition.createdAt;
      setCondition({ ...condition });
      setDateFilter({});
    }
  };

  return (
    <div>
      {isQuanLy ? (
        <Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
          <Col xs={24} md={10} lg={8} xl={6}>
            <Row gutter={[12, 12]} style={{ height: '100%' }}>
              <Col xs={24}>
                <Card style={{ height: '100%' }}>
                  <Spin spinning={loading}>
                    <Statistic
                      title={<div style={{ fontSize: 16 }}>Tổng số đơn</div>}
                      value={dataThongKe?.tong ?? 0}
                    />
                    <Badge style={{ marginRight: 8 }} color="blue" />
                    Đang xử lý: <b>{dataThongKe?.processing ?? 0}</b>
                    <br />
                    <Badge style={{ marginRight: 8 }} color="green" />
                    Đã duyệt: <b>{dataThongKe?.ok ?? 0}</b>
                    <br />
                    <Badge style={{ marginRight: 8 }} color="red" />
                    Không duyệt: <b>{dataThongKe?.not_oke ?? 0}</b>
                  </Spin>
                </Card>
              </Col>
              {isXeCong && data?.allXeCSVC ? (
                <Col xs={24}>
                  <Card style={{ height: '100%' }}>
                    <Spin spinning={loading}>
                      <Statistic
                        title={<div style={{ fontSize: 16 }}>Tổng số xe</div>}
                        value={data.allXeCSVC}
                      />
                      <Badge style={{ marginRight: 8 }} color="blue" />
                      Xe đang dùng: <b>{data?.allXeDangDung ?? 0}</b>{' '}
                      {data?.allXeDangDung !== 0 && (
                        <Button
                          type="link"
                          style={{ padding: '0' }}
                          onClick={() => {
                            getAllDonDangSuDung().then((res) => {
                              setDataDon(res?.data?.data?.allDonXe ?? []);
                              setVisible(true);
                            });
                          }}
                        >
                          (chi tiết)
                        </Button>
                      )}
                      <br />
                      <Badge style={{ marginRight: 8 }} color="green" />
                      Khả dụng: <b>{data.allXeCSVC - data?.allXeDangDung}</b>{' '}
                    </Spin>
                  </Card>
                </Col>
              ) : isPhongHop && data?.allPhongCSVC ? (
                <Col xs={24}>
                  <Card style={{ height: '100%' }}>
                    <Spin spinning={loading}>
                      <Statistic
                        title={<div style={{ fontSize: 16 }}>Tổng số phòng</div>}
                        value={data.allPhongCSVC}
                      />
                      <Badge style={{ marginRight: 8 }} color="blue" />
                      Phòng đang dùng: <b>{data?.allPhongDangDung ?? 0}</b>{' '}
                      {data?.allPhongDangDung !== 0 && (
                        <Button
                          type="link"
                          style={{ padding: '0' }}
                          onClick={() => {
                            getAllDonDangSuDung().then((res) => {
                              setDataDon(res?.data?.data?.allDonPhong ?? []);
                              setVisible(true);
                            });
                          }}
                        >
                          (chi tiết)
                        </Button>
                      )}
                      <br />
                      <Badge style={{ marginRight: 8 }} color="green" />
                      Khả dụng: <b>{data.allPhongCSVC - data?.allPhongDangDung}</b>{' '}
                    </Spin>
                  </Card>
                </Col>
              ) : null}
            </Row>
          </Col>

          <Col xs={24} md={14} lg={16} xl={18}>
            <Card
              title={
                <div>
                  Lọc theo thời gian tạo đơn
                  <DatePicker.RangePicker
                    format=" HH:mm DD/MM/YYYY"
                    minuteStep={15}
                    style={{ width: '300px', marginLeft: '12px' }}
                    onChange={(value) => handleFilterDonTheoThoiGian(value)}
                    placeholder={['Thời gian bắt đầu', 'Thời gian kết thúc']}
                    showTime
                  />
                </div>
              }
              style={{ height: '100%' }}
            >
              <Spin spinning={loading}>
                <Donut
                  labelTotal="đơn"
                  height={240}
                  color={['OK', 'PROCESSING', 'NOT_OK']?.map(
                    (item) => ColorTrangThaiDonMotCua[item],
                  )}
                  data={[
                    { x: 'Đã duyệt', y: dataThongKe?.ok ?? 0 },
                    { x: 'Đang xử lý', y: dataThongKe?.processing ?? 0 },
                    { x: 'Không duyệt', y: dataThongKe?.not_oke ?? 0 },
                  ]}
                />
              </Spin>
            </Card>
          </Col>
        </Row>
      ) : null}

      <Card title="Đơn đăng ký" bodyStyle={{ paddingTop: 8 }}>
        <Tabs
          onChange={(key: string) => {
            setTrangThaiQuanLyDon(key);
          }}
          activeKey={trangThaiQuanLyDon}
          defaultActiveKey="PROCESSING"
        >
          <Tabs.TabPane tab="Chờ xử lý" key="PROCESSING" />
          <Tabs.TabPane tab="Duyệt" key="OK" />
          <Tabs.TabPane tab="Không duyệt" key="NOT_OK" />
        </Tabs>

        {arrPathName?.includes('xecong') ? (
          <DonMuonXe />
        ) : arrPathName?.includes('phonghop') ? (
          <DonMuonPhongHop />
        ) : (
          <DonBaoCaoSuCo />
        )}
      </Card>

      {isQuanLy ? (
        <ModalDonDangSuDung
          dataDon={dataDon}
          isPhongHop={isPhongHop}
          isXeCong={isXeCong}
          setVisible={setVisible}
          visible={visible}
        />
      ) : null}
    </div>
  );
};

export default DonDangKy;
