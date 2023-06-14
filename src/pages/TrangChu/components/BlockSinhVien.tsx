import { useModel, history } from 'umi';
import { thongKeKetQuaHocTap } from '@/services/Dashboard/dashboard';
import { Badge, Card, Col, Statistic } from 'antd';
import { useEffect, useState } from 'react';
import { thongKeMyInvoice } from '@/services/CongNo/ThanhToan/thanhtoan';
import { currencyFormat } from '@/utils/utils';
import { getMetaData } from '@/services/User/user';
import { type LopTinChi } from '@/services/HocTap/LopTinChi/typings';
import { thongKeDon } from '@/services/DVMC/DichVuMotCuaV2/dichvumotcuav2';

const BlockSinhVien = () => {
  const [dataThongKe, setDataThongKe] = useState<{
    tong: number;
    daDuyet: number;
    khongDuyet: number;
  }>();
  const [xepHang, setXepHang] = useState<User.XepHangUser>();
  const [recordDiemTongKet, setRecordDiemTongKet] = useState<LopTinChi.DiemTongKet>();
  const { sinhVienGetDiemTongKetModel } = useModel('hoctap.loptinchi');
  const [ketQuaHocTap, setKetQuaHocTap] = useState<{
    gpaKyGanNhat: number;
    tongSoTinChiTichLuy: 0;
    tongSoTinChiPhaiDat: 0;
  }>({ gpaKyGanNhat: 0, tongSoTinChiTichLuy: 0, tongSoTinChiPhaiDat: 0 });

  const [dataCongNo, setDataCongNo] = useState<{
    tongChuaNop: number;
    tongDaNop: number;
  }>();

  const getThongKeDon = async () => {
    const res = await thongKeDon();
    setDataThongKe(res?.data?.data ?? {});
  };

  const getThongKeKetQuaHocTap = async () => {
    const res = await thongKeKetQuaHocTap();
    setKetQuaHocTap(res?.data?.data);
  };

  const getGPAKyGanNhat = async () => {
    const response: LopTinChi.DiemTongKet[] = await sinhVienGetDiemTongKetModel();
    for (let i = response.length - 1; i >= 0; i--) {
      if (response[i]?.diem_tb_chung_hoc_ky_thang_4) {
        setRecordDiemTongKet(response[i]);
        break;
      }
    }
  };
  const getCongNo = async () => {
    const res1 = thongKeMyInvoice({ condition: { status: 'open' } });
    const res2 = thongKeMyInvoice({ condition: { status: { $in: ['paid', 'overpaid'] } } });
    Promise.all([res1, res2]).then((values) => {
      setDataCongNo({
        tongChuaNop: values[0].data?.data.totalDue,
        tongDaNop: values[1].data?.data.totalDue,
      });
    });
  };

  const getDiemXepHang = async () => {
    const res = await getMetaData();
    setXepHang(res.data.data.thuHangCPAKhoaNganh);
  };

  useEffect(() => {
    getThongKeDon();
    getThongKeKetQuaHocTap();
    getGPAKyGanNhat();
    getCongNo();
    getDiemXepHang();
  }, []);

  return (
    <>
      <Col xs={24} md={12} xl={6}>
        <Card
          onClick={() => history.push('/hoctap/gochoctap')}
          style={{ cursor: 'pointer', height: '100%' }}
        >
          <Statistic
            title={<div style={{ fontSize: 16 }}>Kết quả học tập</div>}
            value={recordDiemTongKet?.diem_tb_chung_hoc_ky_thang_4 ?? 0}
            valueStyle={{ display: 'none' }}
          />
          {/* <br />
          <div>
            <ArrowUpOutlined /> Kỳ gần nhất
          </div> */}
          {/* <Statistic
            title={<div style={{ fontSize: 16 }}>Tổng số tín chỉ tích lũy</div>}
            value={`${recordDiemTongKet?.tong_so_tin_chi_tich_luy_sau_hoc_ky ?? 0}/${
              ketQuaHocTap?.tongSoTinChiPhaiDat ?? 0
            }`}
          /> */}
          <br />

          <Badge
            color="green"
            // text={`Điểm TB học kỳ gần nhất (hệ 4): ${ketQuaHocTap.gpaKyGanNhat ?? 'Chưa cập nhật'}`}
            text={'Điểm TB học kỳ gần nhất (hệ 4): --'}
          />
          <br />
          <Badge
            color="green"
            // text={`Điểm TB tích lũy (hệ 4): ${xepHang?.diem ?? 'Chưa cập nhật'}`}
            text={'Điểm TB tích lũy (hệ 4): --'}
          />
          <br />
          <Badge
            color="green"
            // text={`Tổng số tín chỉ tích lũy: ${
            //   recordDiemTongKet?.tong_so_tin_chi_tich_luy_sau_hoc_ky ?? 0
            // }/${ketQuaHocTap?.tongSoTinChiPhaiDat ?? 0}`}
            text={'Tổng số tín chỉ tích lũy: --'}
          />
          {/* <br />
          <Progress
            percent={
              ketQuaHocTap?.tongSoTinChiPhaiDat > 0 &&
              recordDiemTongKet?.tong_so_tin_chi_tich_luy_sau_hoc_ky
                ? +(
                    (recordDiemTongKet?.tong_so_tin_chi_tich_luy_sau_hoc_ky /
                      ketQuaHocTap.tongSoTinChiPhaiDat) *
                    100
                  ).toFixed(0)
                : 0
            }
            size="small"
          /> */}
        </Card>
      </Col>
      <Col xs={24} md={12} xl={6}>
        <Card
          onClick={() => history.push('/hoctap/gochoctap')}
          style={{ cursor: 'pointer', height: '100%' }}
        >
          <Statistic
            title={<div style={{ fontSize: 16 }}>Xếp hạng sinh viên</div>}
            // value={`${xepHang?.viTri ?? 0}/${xepHang?.tongSo ?? 0}`}
            value={'--'}
          />
          <br />
          {/*<div>Điểm: {xepHang?.diem}</div>*/}
          <div>Điểm: --</div>
        </Card>
      </Col>
      <Col xs={24} md={12} xl={6}>
        <Card
          onClick={() => history.push('/dich-vu-mot-cua-sinh-vien')}
          style={{ cursor: 'pointer', height: '100%' }}
        >
          <Statistic
            title={<div style={{ fontSize: 16 }}>Dịch vụ sử dụng</div>}
            value={`${dataThongKe?.tong ?? 0}`}
          />
          <Badge color="green" text={`Đã duyệt: ${dataThongKe?.daDuyet ?? 0}`} />
          <br />
          <Badge color="red" text={`Không duyệt: ${dataThongKe?.khongDuyet ?? 0}`} />
        </Card>
      </Col>
      <Col xs={24} md={12} xl={6}>
        <Card
          onClick={() => history.push('/congnosinhvien')}
          style={{ cursor: 'pointer', height: '100%' }}
        >
          <Statistic title={<div style={{ fontSize: 16 }}>Công nợ</div>} value={'Chi tiết'} />
          <Badge
            color="green"
            text={`Tổng đã nộp: ${currencyFormat(dataCongNo?.tongDaNop) || 0}đ`}
          />
          <br />
          <Badge
            color="red"
            text={`Tổng chưa nộp: ${currencyFormat(dataCongNo?.tongChuaNop) || 0}đ`}
          />
        </Card>
      </Col>
    </>
  );
};

export default BlockSinhVien;
