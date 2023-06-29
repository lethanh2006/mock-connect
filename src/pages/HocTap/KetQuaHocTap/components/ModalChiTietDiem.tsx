import { type HocPhan } from '@/services/DaoTao/HocPhan/typings';
import { Descriptions, Modal } from 'antd';
import DetailKetQuaHocTap from './DetailKetQuaHocTap';

const ModalChiTietDiem = (props: {
  visible: boolean;
  setVisible: (val: boolean) => void;
  lopHocPhanId?: string;
  chuongTrinhKhung?: { hocPhan?: HocPhan.IRecord; soTinChi?: number };
}) => {
  const { visible, setVisible, lopHocPhanId, chuongTrinhKhung } = props;

  return (
    <Modal
      title="Chi tiết điểm lớp học phần"
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

      <DetailKetQuaHocTap lopHocPhanId={lopHocPhanId} />
    </Modal>
  );
};

export default ModalChiTietDiem;
