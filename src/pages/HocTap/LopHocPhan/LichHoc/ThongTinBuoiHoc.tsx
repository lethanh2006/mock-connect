import { type ThoiKhoaBieu } from '@/services/DaoTao/ThoiKhoaBieu/typing';
import { Descriptions } from 'antd';
import moment from 'moment';

const ThongTinBuoiHoc = (props: { buoiHoc?: ThoiKhoaBieu.IRecord }) => {
  const { buoiHoc } = props;

  return (
    <Descriptions column={{ xs: 1, md: 3 }} title="Thông tin buổi học">
      <Descriptions.Item label="Ngày học" span={2}>
        Tuần {moment(buoiHoc?.ngay).week()}, thứ {moment(buoiHoc?.ngay).day()}, ngày{' '}
        {moment(buoiHoc?.ngay).format('DD/MM/YYYY')}
      </Descriptions.Item>
      <Descriptions.Item label="Tiết học">
        {buoiHoc?.tietBatDau} - {buoiHoc?.tietKetThuc}
      </Descriptions.Item>
      <Descriptions.Item label="Tên lớp" span={3}>
        {buoiHoc?.lopHocPhan?.ten}
      </Descriptions.Item>
      <Descriptions.Item label="Phòng học">
        {buoiHoc?.phongHoc ?? <i>Chưa cập nhật</i>}
      </Descriptions.Item>
      <Descriptions.Item label="Loại hình học tập">
        {buoiHoc?.loaiHinhHocTap ?? <i>Chưa cập nhật</i>}
      </Descriptions.Item>
      <Descriptions.Item label="Giảng viên">
        {buoiHoc?.nhanSu?.ten ?? <i>Chưa cập nhật</i>}
      </Descriptions.Item>
    </Descriptions>
  );
};
export default ThongTinBuoiHoc;
