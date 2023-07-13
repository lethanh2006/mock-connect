import { type HocPhan } from '@/services/DaoTao/HocPhan/typings';
import { Descriptions, Modal, Divider } from 'antd';
import DetailKetQuaHocTap from './DetailKetQuaHocTap';
import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';

const ModalChiTietDiem = (props: {
  visible: boolean;
  setVisible: (val: boolean) => void;
  lopHocPhanId?: string;
  chuongTrinhKhung?: { hocPhan?: HocPhan.IRecord; soTinChi?: number };
  listDiem?: LopHocPhan.IRecordSinhVienLopHP[];
}) => {
  const { visible, setVisible, lopHocPhanId, chuongTrinhKhung, listDiem } = props;

  return (
    <Modal
      title="Kết quả học tập"
      visible={visible}
      onCancel={() => setVisible(false)}
      okButtonProps={{ hidden: true }}
      cancelText="Đóng"
      width={600}
    >
      {chuongTrinhKhung ? (
        <Descriptions title="Thông tin học phần" column={1}>
          <Descriptions.Item label="Tên học phần">
            {chuongTrinhKhung.hocPhan?.ten}
          </Descriptions.Item>
          <Descriptions.Item label="Mã học phần">{chuongTrinhKhung.hocPhan?.ma}</Descriptions.Item>
          <Descriptions.Item label="Số tín chỉ">{chuongTrinhKhung.soTinChi}</Descriptions.Item>
        </Descriptions>
      ) : null}

      <h4 style={{ fontWeight: 600, fontSize: 16, marginBottom: 10 }}>Chi tiết điểm học phần</h4>
      {!listDiem?.length ? (
        <DetailKetQuaHocTap lopHocPhanId={lopHocPhanId} />
      ) : (
        listDiem.map((diem, index) => (
          <>
            {listDiem.length > 1 ? <Divider>Học lần {index + 1}</Divider> : null}
            <DetailKetQuaHocTap key={diem._id} sinhVienLopHp={diem} />
          </>
        ))
      )}
    </Modal>
  );
};

export default ModalChiTietDiem;
