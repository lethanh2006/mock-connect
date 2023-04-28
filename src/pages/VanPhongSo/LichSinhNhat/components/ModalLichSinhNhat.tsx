import { Modal, Typography } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';

const ModalLichSinhNhat = () => {
  const { visibleModal, setVisibleModal, record } = useModel('lichsinhnhat');

  return (
    <Modal
      destroyOnClose
      onCancel={() => setVisibleModal(false)}
      visible={visibleModal}
      title="Chi tiết"
      okButtonProps={{ hidden: true }}
      cancelText="Đóng"
    >
      <div>
        <Typography.Paragraph>
          <b>Họ tên:</b> {record?.hoTen ?? ''}
        </Typography.Paragraph>
        <Typography.Paragraph>
          <b>Mã định danh:</b> {record?.maDinhDanh ?? ''}
        </Typography.Paragraph>

        <Typography.Paragraph>
          <b>Ngày sinh:</b> {moment(record?.ngaySinh).format('DD/MM/YYYY') ?? ''}
        </Typography.Paragraph>
        <Typography.Paragraph>
          <b> Chức vụ:</b> {record?.chucVu ? record?.chucVu : 'Chưa xác định'}
        </Typography.Paragraph>
        <Typography.Paragraph>
          <b>Đơn vị:</b> {record?.donVi ? record?.donVi : 'Chưa xác định'}
        </Typography.Paragraph>
      </div>
    </Modal>
  );
};

export default ModalLichSinhNhat;
