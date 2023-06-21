import { type ThoiKhoaBieu } from '@/services/DaoTao/ThoiKhoaBieu/typing';
import { ColorSuKien, ELoaiSuKien } from '@/services/SuKien/constant';
import { type SuKien } from '@/services/SuKien/typings';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Descriptions, Modal, Popconfirm, Space, Tag } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';

const ModalViewDetailCalendar = (props: {
  visible: boolean;
  setVisible: any;
  event: any;
  getData: () => void;
}) => {
  const { visible, setVisible, event, getData } = props;
  const { deleteModel, handleEdit } = useModel('sukien');
  const isThoiKhoaBieu = event.loaiSuKien === ELoaiSuKien.LICH_HOC;
  const thoiKhoaBieu = isThoiKhoaBieu ? (event as ThoiKhoaBieu.IRecord) : undefined;
  const suKien = !isThoiKhoaBieu ? (event as SuKien.IRecord) : undefined;

  return (
    <Modal
      visible={visible}
      title="Chi tiết lịch"
      destroyOnClose
      onCancel={() => setVisible(false)}
      footer={
        <Space wrap>
          {suKien && suKien.loaiSuKien === ELoaiSuKien.CA_NHAN ? (
            <>
              <Button
                type="primary"
                onClick={() => {
                  handleEdit(suKien);
                  setVisible(false);
                }}
                icon={<EditOutlined />}
              >
                Chỉnh sửa
              </Button>
              <Popconfirm
                title="Bạn có chắc chắn muốn xóa sự kiện này không?"
                onConfirm={() => {
                  deleteModel(suKien?._id ?? '', getData);
                  setVisible(false);
                }}
              >
                <Button danger icon={<DeleteOutlined />}>
                  Xóa
                </Button>
              </Popconfirm>
            </>
          ) : null}
          <Button onClick={() => setVisible(false)}>Đóng</Button>
        </Space>
      }
    >
      {isThoiKhoaBieu ? (
        <Descriptions column={1}>
          <Descriptions.Item label="Lớp học phần">{thoiKhoaBieu?.tenLopHocPhan}</Descriptions.Item>
          <Descriptions.Item label="Thời gian bắt đầu">
            {moment(thoiKhoaBieu?.thoiGianBatDau).format('HH:mm DD/MM/YYYY')}
          </Descriptions.Item>
          <Descriptions.Item label="Thời gian kết thúc">
            {moment(thoiKhoaBieu?.thoiGianKetThuc).format('HH:mm DD/MM/YYYY')}
          </Descriptions.Item>
          <Descriptions.Item label="Giảng viên">
            {thoiKhoaBieu?.nhanSu?.ten ?? '--'}
          </Descriptions.Item>
          <Descriptions.Item label="Phòng học">{thoiKhoaBieu?.phongHoc ?? '--'}</Descriptions.Item>
          <Descriptions.Item label="Loại hình học tập">
            {thoiKhoaBieu?.loaiHinhHocTap ?? '--'}
          </Descriptions.Item>
          <Descriptions.Item label="Tiêu đề bài học">
            {thoiKhoaBieu?.tieuDeBaiHoc ?? '--'}
          </Descriptions.Item>
          <Descriptions.Item label="Nội dung bài học">
            {thoiKhoaBieu?.noiDungBaiHoc ?? '--'}
          </Descriptions.Item>
          <Descriptions.Item label="Đường dẫn">
            {thoiKhoaBieu?.urlBaiHoc ? (
              <a href={thoiKhoaBieu.urlBaiHoc} target="_blank" rel="noreferrer">
                Bài học
              </a>
            ) : (
              '--'
            )}
          </Descriptions.Item>
        </Descriptions>
      ) : (
        <Descriptions column={1}>
          <Descriptions.Item label="Tên sự kiện">{suKien?.tenSuKien}</Descriptions.Item>
          <Descriptions.Item label="Thời gian bắt đầu">
            {moment(suKien?.thoiGianBatDau).format('HH:mm DD/MM/YYYY')}
          </Descriptions.Item>
          <Descriptions.Item label="Thời gian kết thúc">
            {moment(suKien?.thoiGianKetThuc).format('HH:mm DD/MM/YYYY')}
          </Descriptions.Item>
          <Descriptions.Item label="Địa điểm">{suKien?.diaDiem ?? '--'}</Descriptions.Item>
          <Descriptions.Item label="Ghi chú">{suKien?.ghiChu ?? '--'}</Descriptions.Item>
          <Descriptions.Item label="Loại sự kiện">
            {suKien?.loaiSuKien ? (
              <Tag color={ColorSuKien[suKien.loaiSuKien]}>{suKien.loaiSuKien}</Tag>
            ) : (
              '--'
            )}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
};

export default ModalViewDetailCalendar;
