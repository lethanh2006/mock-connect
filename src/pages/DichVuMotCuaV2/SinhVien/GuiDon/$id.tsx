/* eslint-disable no-underscore-dangle */
import ThanhToan from '@/pages/CongNo/ThanhToan';
import DanhMuc from '@/pages/DichVuMotCuaV2/components/DanhMuc';
import FormBieuMau from '@/pages/DichVuMotCuaV2/components/FormBieuMau';
import { type DichVuMotCuaV2 } from '@/services/DVMC/DichVuMotCuaV2/typing';
import { type SinhVien } from '@/services/DaoTao/SinhVien/typings';
import { getInfo } from '@/services/ant-design-pro/api';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const SinhVienTaoDon = ({
  match: {
    params: { id },
  },
}: {
  match: { params: { id: string } };
}) => {
  const { visibleFormBieuMau, setVisibleFormBieuMau, record, getBieuMauByIdModel, recordDon } =
    useModel('dvmc.dichvumotcuav2');
  // const { getAllKyHocSinhVienModel, setDanhSach: setDanhSachKyHoc } = useModel('daotao.hocky');
  // const { getAllNamHocSinhVienModel, setDanhSach: setDanhSachNamHoc } = useModel('daotao.namhoc');

  // const {
  //   getAllMonHocSinhVienModel,
  //   setDanhSachMonHoc,
  //   getAllLopTinChiSinhVienModel,
  //   setDanhSach: setDanhSachLopTinChi,
  // } = useModel('hoctap.loptinchi');

  const { visibleForm, setVisibleForm } = useModel('dvmc.thanhtoan');
  const [infoSinhVien, setInfoSinhVien] = useState<SinhVien.IRecord>();
  // const { record: recordSinhVien } = useModel('sinhvien');
  useEffect(() => {
    window.scroll({ top: 0 });
    const getInfoSV = async () => {
      const res = await getInfo();
      setInfoSinhVien(res?.data?.data ?? {});
    };
    getInfoSV();
    getBieuMauByIdModel(id);
    // if (access.sinhVien) {
    //   getAllKyHocSinhVienModel();
    //   getAllNamHocSinhVienModel();
    //   getAllMonHocSinhVienModel();
    //   getAllLopTinChiSinhVienModel();
    // }
    return () => {
      setVisibleForm(false);
    };
  }, []);
  return (
    <Card>
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
        <FormBieuMau
          type="create"
          infoNguoiTaoDon={infoSinhVien}
          record={
            {
              thongTinDichVu: { ...record },
            } as DichVuMotCuaV2.Don
          }
        />
      </Modal>

      {record?.thongTinThuTuc?.yeuCauTraPhi && (
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
      )}

      <DanhMuc
        button={
          <Button
            disabled={!record?._id}
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
    </Card>
  );
};

export default SinhVienTaoDon;
