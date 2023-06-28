import { PaperClipOutlined } from '@ant-design/icons';
import { Button, Card, Descriptions } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';

const ModalDetailPhanhoi = () => {
  const { record, setVisibleForm } = useModel('tienich.phanhoi');

  return (
    <Card title="Chi tiết phản hồi">
      <Descriptions column={1}>
        <Descriptions.Item label="Nội dung phản hồi">{record?.noiDungPhanHoi}</Descriptions.Item>
        <Descriptions.Item label="Loại phản hồi">
          {record?.loaiPhanHoi}{' '}
          {/* {record?.loaiPhanHoi === ELoaiPhanHoi.DVMC ? <a>(xem chi tiết đơn)</a> : null} */}
        </Descriptions.Item>
        <Descriptions.Item label="File đính kèm">
          {record?.urlPhanAnh ? (
            <>
              <PaperClipOutlined />{' '}
              <a href={record?.urlPhanAnh} target="_blank" rel="noreferrer">
                File đính kèm
              </a>
            </>
          ) : null}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày gửi">
          {moment(record?.createdAt).format('HH:mm DD/MM/YYYY')}
        </Descriptions.Item>

        <Descriptions.Item label="Câu trả lời">{record?.noiDungTraLoiPhanHoi}</Descriptions.Item>
        <Descriptions.Item label="Người trả lời">{record?.maChuyenVien}</Descriptions.Item>
        <Descriptions.Item label="Thời gian trả lời">
          {record?.thoiGianTraLoi ? (
            moment(record.thoiGianTraLoi).format('HH:mm DD/MM/YYYY')
          ) : (
            <i>Chưa trả lời</i>
          )}
        </Descriptions.Item>
      </Descriptions>

      <div className="form-footer">
        <Button onClick={() => setVisibleForm(false)}>Đóng</Button>
      </div>
    </Card>
  );
};

export default ModalDetailPhanhoi;
