import type { LopTinChi } from '@/services/LopTinChi/typings';
import { Descriptions, Modal, Tabs } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import DetailKetQuaHocTap from '../../components/KetQuaHocTap/Detail';

const ModalChiTietDiemThanhPhan = (props: {
  modalVisible: boolean;
  setModalVisible: any;
  dsDiemThanhPhan?: LopTinChi.DiemThanhPhan[];
  hocPhan?: TienTrinhHocTap.IHocPhan;
  chuongTrinhKhung?: TienTrinhHocTap.IChuongTrinhKhung;
}) => {
  const { infoMonHoc, getInfoMonHocModel } = useModel('hoctap.loptinchi');
  const { modalVisible, setModalVisible, dsDiemThanhPhan, hocPhan, chuongTrinhKhung } = props;
  const loaiHocPhan = chuongTrinhKhung?.loai_hoc_phan ?? hocPhan?.loai_hoc_phan ?? '';

  useEffect(() => {
    if (modalVisible) {
      const idHocPhan =
        hocPhan?.id ?? chuongTrinhKhung?.hoc_phan_id?.[0] ?? dsDiemThanhPhan?.[0]?.hoc_phan_id?.[0];
      if (idHocPhan) getInfoMonHocModel(idHocPhan);
    }
  }, [modalVisible]);

  return (
    <Modal
      title={
        hocPhan?.ten_hoc_phan ??
        chuongTrinhKhung?.ten_hoc_phan ??
        dsDiemThanhPhan?.[0]?.ten_hoc_phan ??
        'Chi tiết học phần'
      }
      visible={modalVisible}
      onCancel={() => setModalVisible(false)}
      okButtonProps={{ hidden: true }}
      cancelText="Đóng"
      bodyStyle={{ paddingTop: 0 }}
      width={800}
    >
      <Tabs>
        <Tabs.TabPane tab="Thông tin học phần" key="thongtin">
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Số tín chỉ">
              {hocPhan?.so_tin_chi ??
                chuongTrinhKhung?.so_tin_chi ??
                dsDiemThanhPhan?.[0]?.so_tin_chi}
            </Descriptions.Item>
            <Descriptions.Item label="Loại học phần">
              {loaiHocPhan === 'tu_chon' ? 'Tự chọn' : loaiHocPhan === 'bat_buoc' ? 'Bắt buộc' : ''}
            </Descriptions.Item>
            <Descriptions.Item span={3} label="Nội dung chi tiết">
              {infoMonHoc?.noi_dung_chi_tiet && (
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      infoMonHoc?.noi_dung_chi_tiet !== 'false'
                        ? infoMonHoc?.noi_dung_chi_tiet
                        : '',
                  }}
                />
              )}
            </Descriptions.Item>
            <Descriptions.Item span={3} label="Mục tiêu kiến thức">
              {infoMonHoc?.objective_kien_thuc && (
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      infoMonHoc?.objective_kien_thuc !== 'false'
                        ? infoMonHoc?.objective_kien_thuc
                        : '',
                  }}
                />
              )}
            </Descriptions.Item>
            <Descriptions.Item span={3} label="Mục tiêu kỹ năng">
              {infoMonHoc?.objective_ky_nang && (
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      infoMonHoc?.objective_ky_nang !== 'false'
                        ? infoMonHoc?.objective_ky_nang
                        : '',
                  }}
                />
              )}
            </Descriptions.Item>
            <Descriptions.Item span={3} label="Mục tiêu thái độ">
              {infoMonHoc?.objective_thai_do && (
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      infoMonHoc?.objective_thai_do !== 'false'
                        ? infoMonHoc?.objective_thai_do
                        : '',
                  }}
                />
              )}
            </Descriptions.Item>
            <Descriptions.Item span={3} label="Yêu cầu về cơ sở vật chất">
              {infoMonHoc?.yeu_cau_ve_csvc && (
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      infoMonHoc?.yeu_cau_ve_csvc !== 'false' ? infoMonHoc?.yeu_cau_ve_csvc : '',
                  }}
                />
              )}
            </Descriptions.Item>
          </Descriptions>
        </Tabs.TabPane>

        <Tabs.TabPane tab="Chi tiết điểm" key="diem">
          <DetailKetQuaHocTap ketQuaHocTap={dsDiemThanhPhan} />
        </Tabs.TabPane>
      </Tabs>
    </Modal>
  );
};

export default ModalChiTietDiemThanhPhan;
