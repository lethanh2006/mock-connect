/* eslint-disable no-underscore-dangle */
import DanhMuc from '@/pages/DichVuMotCua/components/DanhMuc';
import FormBieuMau from '@/pages/DichVuMotCua/components/FormBieuMau';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { useModel, useAccess } from 'umi';

const SinhVienTaoDon = ({
  match: {
    params: { id },
  },
}: {
  match: { params: { id: string } };
}) => {
  const access = useAccess();
  const { visibleFormBieuMau, setVisibleFormBieuMau, record, getBieuMauByIdModel, recordDon } =
    useModel('dichvumotcua');
  // const { getAllKyHocSinhVienModel, setDanhSach: setDanhSachKyHoc } = useModel('kyhoc');
  // const { getAllNamHocSinhVienModel, setDanhSach: setDanhSachNamHoc } = useModel('namhoc');
  const {
    getAllLopTinChiSinhVienModel,
    setDanhSach: setDanhSachLopTinChi,
    getAllMonHocSinhVienModel,
    setDanhSachMonHoc,
  } = useModel('hoctap.loptinchi');

  // const { visibleForm, setVisibleForm } = useModel('thanhtoan');
  // const [infoSinhVien, setInfoSinhVien] = useState<Login.Profile>();
  // useEffect(() => {
  //   window.scroll({ top: 0 });
  //   const getInfoSV = async () => {
  //     const res = await getInfoSinhVien();
  //     setInfoSinhVien(res?.data?.data ?? {});
  //   };
  //   getInfoSV();
  //   getBieuMauByIdModel(id);
  //   if (access.sinhVien) {
  //     getAllKyHocSinhVienModel();
  //     getAllNamHocSinhVienModel();
  //     getAllMonHocSinhVienModel();
  //     getAllLopTinChiSinhVienModel();
  //   }
  //   return () => {
  //     setDanhSachLopTinChi([]);
  //     setDanhSachMonHoc([]);
  //     setDanhSachKyHoc([]);
  //     setDanhSachNamHoc([]);
  //     setVisibleForm(false);
  //   };
  // }, []);
  return (
    <Card>
      <DanhMuc
        button={
          <Button
            // disabled={!record?._id}
            onClick={() => {
              setVisibleFormBieuMau(true);
            }}
            icon={<PlusOutlined />}
            type="primary"
            style={{ marginRight: '18%' }}
          >
            Sử dụng dịch vụ
          </Button>
        }
      />

      <Modal
        destroyOnClose
        onCancel={() => {
          setVisibleFormBieuMau(false);
        }}
        footer={false}
        width="800px"
        bodyStyle={{ padding: 0 }}
        visible={visibleFormBieuMau}
      >
        {/* <FormBieuMau
          type="create"
          // infoNguoiTaoDon={infoSinhVien}
          record={
            {
              thongTinDichVu: { ...record },
            } as DichVuMotCua.Don
          }
        /> */}
        Form bieu mau
      </Modal>
      {/* {record?.thongTinThuTuc?.yeuCauTraPhi && (
        <Modal
          maskClosable={false}
          title="Thanh toán (Sinh viên có thể xem lại các thông tin này ở mục 'Đơn đã gửi')"
          destroyOnClose
          onCancel={() => {
            setVisibleForm(false);
          }}
          footer={
            <Button
              onClick={() => {
                setVisibleForm(false);
              }}
            >
              Đóng
            </Button>
          }
          width="800px"
          visible={visibleForm}
        >
          <ThanhToan
            identityCode={recordDon?.identityCode ?? ''}
            trangThaiThanhToan={recordDon?.trangThaiThanhToan}
          />
        </Modal>
      )} */}
    </Card>
  );
};

export default SinhVienTaoDon;
