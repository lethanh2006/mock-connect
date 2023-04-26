import { type LopTinChi } from '@/services/LopTinChi/typings';
import { Descriptions } from 'antd';
import moment from 'moment';

const ThongTinBuoiHoc = (props: { buoiHoc?: LopTinChi.IBuoiHoc }) => {
  const { buoiHoc } = props;

  return (
    <Descriptions column={{ xs: 1, md: 3 }} title="Thông tin buổi học">
      <Descriptions.Item label="Ngày học" span={2}>
        <b>
          Tuần {moment(buoiHoc?.ngay).week()}, thứ {moment(buoiHoc?.ngay).day()}, ngày{' '}
          {moment(buoiHoc?.ngay).format('DD/MM/YYYY')}
        </b>
      </Descriptions.Item>
      <Descriptions.Item label="Thời gian">
        <b>
          {buoiHoc?.tietBatDau?.timeBatDau.slice(0, -3)} -{' '}
          {buoiHoc?.tietKetThuc?.timeKetThuc.slice(0, -3)}
        </b>
      </Descriptions.Item>
      {buoiHoc?.lopHocPhan && (
        <Descriptions.Item label="Lớp học phần" span={2}>
          <b>{buoiHoc?.lopHocPhan?.ten}</b>
        </Descriptions.Item>
      )}
      <Descriptions.Item label="Phòng học">
        <b>{buoiHoc?.phongHoc ?? 'Chưa cập nhật'}</b>
      </Descriptions.Item>
    </Descriptions>
  );
};
export default ThongTinBuoiHoc;
