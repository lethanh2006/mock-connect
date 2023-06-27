import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { ELoaiDiemChu } from '@/services/HocTap/LopHocPhan/constant';
import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { Card, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import ModalChiTietDiem from './ModalChiTietDiem';

const DiemThanhPhanSV = () => {
  const { danhSach, sinhVienGetAllDiemLopHocPhanModel, loading } = useModel(
    'daotao.sinhvienlophocphan',
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [lopHocPhanId, setLopHocPhanId] = useState<string>();

  useEffect(() => {
    sinhVienGetAllDiemLopHocPhanModel();
  }, []);

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

  const onCell = (rec: LopHocPhan.IRecordSinhVienLopHP) => ({
    onClick: () => {
      setLopHocPhanId(rec.lopHocPhanId);
      setModalVisible(true);
    },
    style: { cursor: 'pointer' },
  });

  const columns: IColumn<LopHocPhan.IRecordSinhVienLopHP>[] = [
    {
      title: 'Tên học phần',
      width: 150,
      render: (val, rec) => rec.hocPhan?.ten ?? '--',
      onCell,
    },
    {
      title: 'Số tín chỉ',
      dataIndex: 'soTinChi',
      width: 100,
      align: 'center',
      sortable: true,
      onCell,
    },
    {
      title: 'Tổng kết (hệ 10)',
      dataIndex: 'diemTongKet',
      align: 'center',
      render: (val, r) => <b style={val < 4 ? { color: 'red' } : {}}>{val ?? '--'}</b>,
      width: 100,
      onCell,
      sortable: true,
    },
    {
      title: 'Tổng kết (hệ 4)',
      dataIndex: 'diemThang4',
      align: 'center',
      render: (val, recordDiem) => (
        <b
        // style={
        //   recordDiem.is_danh_gia ? (recordDiem.diem_tong_ket < 4 ? { color: 'red' } : {}) : {}
        // }
        >
          {/* {recordDiem.is_danh_gia
            ? val
              ? val
              : convertNumberScoreToAlphabet(recordDiem?.diem_tong_ket ?? '')[1]
            : '--'} */}
          {val ?? '--'}
        </b>
      ),
      width: 100,
      sortable: true,
      onCell,
    },
    {
      title: 'Tổng kết (dạng chữ)',
      dataIndex: 'diemChu',
      align: 'center',
      render: (val, recordDiem) => (
        <b
        // style={
        //   recordDiem.is_danh_gia ? (recordDiem.diem_tong_ket < 4 ? { color: 'red' } : {}) : {}
        // }
        >
          {/* {recordDiem.is_danh_gia
            ? val
              ? val
              : convertNumberScoreToAlphabet(recordDiem?.diem_tong_ket ?? '')[0]
            : '--'} */}
          {val}
        </b>
      ),
      filterType: 'select',
      filterData: Object.values(ELoaiDiemChu),
      width: 100,
      onCell,
    },
  ];

  return (
    <>
      <Card bodyStyle={{ paddingTop: 8 }}>
        <Tabs>
          <Tabs.TabPane tab="Điểm tổng kết" key="1">
            <div style={{ marginBottom: '16px' }}>
              {/* <Text italic>
                  {`* Lưu ý: Những điểm "--" là do bạn chưa đánh giá giảng viên. Vui lòng đánh giá
                    để xem điểm!`}
                </Text> */}
            </div>
            <TableStaticData
              loading={loading}
              // otherProps={{
              //   loading: loading,
              //   pagination: false,
              // }}
              data={danhSach ?? []}
              columns={columns}
              addStt
              hasTotal
            />
          </Tabs.TabPane>

          {/* <Tabs.TabPane tab="Thắc mắc điểm" key="2"> */}
          {/* <ThacMacDiemComponent /> */}
          {/* Thắc mắc điểm
          </Tabs.TabPane>
          <Tabs.TabPane tab="Giả lập điểm" key="3">
            <GiaLapDiem />
          </Tabs.TabPane> */}
        </Tabs>
      </Card>

      <ModalChiTietDiem
        lopHocPhanId={lopHocPhanId}
        visible={modalVisible}
        setVisible={setModalVisible}
      />
    </>
  );
};

export default DiemThanhPhanSV;
