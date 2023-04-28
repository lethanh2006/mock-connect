import { useEffect } from 'react';
import { Modal, Typography } from 'antd';
import { useModel } from 'umi';
import { useParams } from 'react-router-dom';
import './style.less';

export interface IParams {
  id: string;
}

const ViewPopup = () => {
  const params: IParams = useParams();
  const { record, getQuanLyOtoByIdPublicModel } = useModel('quanlyoto');
  useEffect(() => {
    getQuanLyOtoByIdPublicModel(params?.id);
  }, [params?.id]);

  return (
    <div className="background-image">
      <Modal title="Chi tiết xe" visible={true} closable={false} width={500} footer={''}>
        <Typography.Paragraph>Họ và tên: {record?.hoTen}</Typography.Paragraph>
        <Typography.Paragraph>Đơn vị: {record?.donVi}</Typography.Paragraph>
        <Typography.Paragraph>Biển số xe: {record?.bienSoXe}</Typography.Paragraph>
        <Typography.Paragraph>Hãng xe: {record?.hangXe}</Typography.Paragraph>
        <Typography.Paragraph>Tên xe: {record?.tenXe}</Typography.Paragraph>
        <Typography.Paragraph>Số điện thoại: {record?.soDienThoai}</Typography.Paragraph>
        <Typography.Paragraph>Email: {record?.email}</Typography.Paragraph>
        <Typography.Paragraph>
          Loại xe:{' '}
          {record?.loaiXe === 'A'
            ? 'Lãnh đạo'
            : record?.loaiXe === 'B'
            ? 'Nhân viên'
            : record?.loaiXe === 'C'
            ? 'Người ngoài trường'
            : 'Thành phần khác'}
        </Typography.Paragraph>
      </Modal>
    </div>
  );
};

export default ViewPopup;
