import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { type LopTinChi } from '@/services/LopTinChi/typings';
import { convertNumberScoreToAlphabet } from '@/utils/utils';
import { Card, Col, Row, Tabs, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import GiaLapDiem from './GiaLapDiem';
import ModalChiTietDiemThanhPhan from './ModalChiTietDiemThanhPhan';

const { Text } = Typography;

const DiemThanhPhanSV = () => {
  const {
    // sinhVienGetDiemThanhPhanByHocKyModel,
    danhSachDiemThanhPhanTheoKy,
    setDanhSachDiemThanhPhanTheoKy,
    loading,
    setRecordDiemTongKet,
    danhSachDiemTongKet,
    // sinhVienGetDiemTongKetModel,
  } = useModel('hoctap.loptinchi');
  const [canhBao, setCanhBao] = useState<string | undefined>(undefined);
  // const { record } = useModel('HocKy');
  const [recordDiemThanhPhan, setRecordDiemThanhPhan] = useState<LopTinChi.DiemThanhPhan>();
  const [modalVisible, setModalVisible] = useState(false);

  // useEffect(() => {
  //   const handleApi = async () => {
  //     try {
  //       const res1 = getInfoSinhVien();
  //       const res = sinhVienGetDiemTongKetHienTai();
  //       Promise.all([res1, res]).then((values) => {
  //         switch (values[0].data?.data.nam_ctk) {
  //           case 1:
  //             if (values[1].data?.data.diem_tich_luy_thang_4 < 1.2) {
  //               setCanhBao(
  //                 'Bạn đang bị cảnh báo loại 1 do có điểm trung bình tích lũy (hệ 4) dưới 1.2',
  //               );
  //             }
  //             break;
  //           case 2:
  //             if (values[1].data?.data.diem_tich_luy_thang_4 < 1.4) {
  //               setCanhBao(
  //                 'Bạn đang bị cảnh báo loại 1 do có điểm trung bình tích lũy (hệ 4) dưới 1.4',
  //               );
  //             }
  //             break;
  //           case 3:
  //             if (values[1].data?.data.diem_tich_luy_thang_4 < 1.6) {
  //               setCanhBao(
  //                 'Bạn đang bị cảnh báo loại 1 do có điểm trung bình tích lũy (hệ 4) dưới 1.6',
  //               );
  //             }
  //             break;
  //           default:
  //             if (values[1].data?.data.diem_tich_luy_thang_4 < 1.8) {
  //               setCanhBao(
  //                 'Bạn đang bị cảnh báo loại 1 do có điểm trung bình tích lũy (hệ 4) dưới 1.8',
  //               );
  //             }
  //             break;
  //         }
  //       });
  //       sinhVienGetDiemTongKetModel().then((response: LopTinChi.DiemTheoKy[]) => {
  //         const filtered = response.filter(
  //           (el) => el.ky_hoc.is_ky_chinh && el.diem_tb_chung_hoc_ky_thang_4 < 3,
  //         );
  //         if (filtered.length > 0) {
  //           setCanhBao(
  //             'Bạn đang bị cảnh báo loại 1 do có điểm trung bình ở 1 học kì chính dưới 1.0',
  //           );
  //         }
  //       });
  //     } catch (error) {}
  //   };

  //   handleApi();
  // }, []);

  // Change ky hoc id
  // useEffect(() => {
  //   sinhVienGetDiemThanhPhanByHocKyModel(record?.id);
  //   if (record?.id) {
  //     setRecordDiemTongKet(
  //       danhSachDiemTongKet?.find((item) => item?.ky_nam_hoc_id?.[0] === record?.id),
  //     );
  //   }
  // }, [record?.id]);

  useEffect(() => {
    setDanhSachDiemThanhPhanTheoKy([
      {
        id: '2116940',
        sinh_vien_id: [34632, 'B21DCDT016'],
        ma_dinh_danh: 'B21DCDT016',
        name: 'Lê Khánh Linh',
        lop_tin_chi_id: [53001, ' INT11117_CLC-20211-02'],
        ma_lop: 'INT11117_CLC-20211-02',
        so_tin_chi: 3,
        hoc_phan_id: [3130, 'INT11117_CLC'],
        ten_hoc_phan: 'Nhập môn tin học và lập trình',
        diem_attendance: 10,
        diem_bai_tap: 8,
        diem_cuoi_ky: 4.5,
        diem_thi_nghiem: 0,
        diem_tong_ket: 6.5,
        diem_tong_ket_thang_4: 2.5,
        diem_tong_ket_dang_chu: ' C+',
        diem_trung_binh_kiem_tra_tren_lop: 8,
        diem_doc: false,
        diem_nghe: false,
        diem_viet: false,
        diem_noi: false,
        course_chuyen_can: false,
        course_ed_bt_viet_noi: false,
        course_ed_giay: false,
        course_ed_thi_cuoi_hp: false,
        course_ed_thi_giua_hp: false,
        course_ed_tt: false,
        trang_thai_sv_ltc_ds: 'da_dat',
        ky_hoc_id: [37, 20211],
        diem_thi_lan_2: false,
        write_date: '2022-03-16 07:25:06',
        create_date: '2022-03-16 07:25:06',
        loai_dau_diem_hoc_phan: 'hoc_phan_thuong',
        loai_hoc_phan_ap_dung: 1,
        is_diem_tieng_anh: false,
        is_danh_gia: true,
      },
    ]);
  });

  const onCell = (rec: LopTinChi.DiemThanhPhan) => ({
    onClick: () => {
      setRecordDiemThanhPhan(rec);
      setModalVisible(true);
    },
    style: { cursor: 'pointer' },
  });

  const columns: IColumn<LopTinChi.DiemThanhPhan>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 80,
      align: 'center',
      onCell,
    },
    {
      title: 'Tên học phần',
      dataIndex: 'ten_hoc_phan',
      width: 200,
      onCell,
    },
    {
      title: 'Số tín chỉ',
      dataIndex: 'so_tin_chi',
      width: 100,
      onCell,
    },
    {
      title: 'Tổng kết (hệ 10)',
      dataIndex: 'diem_tong_ket',
      render: (val, r) => (
        <b style={r.diem_tong_ket < 4 ? { color: 'red' } : {}}>{r.is_danh_gia ? val : '--'}</b>
      ),
      width: 100,
      onCell,
    },
    {
      title: 'Tổng kết (hệ 4)',
      dataIndex: 'diem_tong_ket_thang_4',
      render: (val, recordDiem) => (
        <b
          style={
            recordDiem.is_danh_gia ? (recordDiem.diem_tong_ket < 4 ? { color: 'red' } : {}) : {}
          }
        >
          {recordDiem.is_danh_gia
            ? val
              ? val
              : convertNumberScoreToAlphabet(recordDiem?.diem_tong_ket ?? '')[1]
            : '--'}
        </b>
      ),
      width: 100,
      onCell,
    },
    {
      title: 'Tổng kết (dạng chữ)',
      dataIndex: 'diem_tong_ket_dang_chu',
      render: (val, recordDiem) => (
        <b
          style={
            recordDiem.is_danh_gia ? (recordDiem.diem_tong_ket < 4 ? { color: 'red' } : {}) : {}
          }
        >
          {recordDiem.is_danh_gia
            ? val
              ? val
              : convertNumberScoreToAlphabet(recordDiem?.diem_tong_ket ?? '')[0]
            : '--'}
        </b>
      ),
      width: 100,
      onCell,
    },
  ];

  return (
    <Row gutter={[8, 8]}>
      <Col xs={24} lg={24}>
        <Card bodyStyle={{ paddingTop: 8 }}>
          <>
            <Tabs>
              <Tabs.TabPane tab="Điểm thành phần" key="1">
                <div style={{ marginBottom: '16px' }}>
                  <Text italic>
                    * Lưu ý: Những điểm &#34;--&#34; là do bạn chưa đánh giá giảng viên. Vui lòng
                    đánh giá để xem điểm!
                  </Text>
                </div>
                <TableStaticData
                  otherProps={{
                    loading: loading,
                    pagination: false,
                  }}
                  data={danhSachDiemThanhPhanTheoKy?.map((item, index) => ({
                    ...item,
                    index: index + 1,
                  }))}
                  columns={columns}
                />
              </Tabs.TabPane>
              <Tabs.TabPane tab="Thắc mắc điểm" key="2">
                {/* <ThacMacDiemComponent /> */}
                Thắc mắc điểm
              </Tabs.TabPane>
              <Tabs.TabPane tab="Giả lập điểm" key="3">
                <GiaLapDiem />
              </Tabs.TabPane>
            </Tabs>
          </>
        </Card>
      </Col>

      <ModalChiTietDiemThanhPhan
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        dsDiemThanhPhan={recordDiemThanhPhan && [recordDiemThanhPhan]}
      />
    </Row>
  );
};

export default DiemThanhPhanSV;
