import type { BuoiHoc } from '@/services/LopTinChi/typings';
import { Descriptions } from 'antd';
import moment from 'moment';

const ThongTinBuoiHoc = (props: { buoiHoc?: BuoiHoc.Record; title: string }) => {
  const { buoiHoc, title } = props;

  return (
    <Descriptions column={{ xs: 1, md: 3 }} title={title}>
      <Descriptions.Item label="Ngày học" span={2}>
        <b>
          Tuần {buoiHoc?.tuan_hoc || ''},{' '}
          {buoiHoc?.thu_kieu_so !== 6
            ? `thứ ${typeof buoiHoc?.thu_kieu_so === 'number' ? buoiHoc?.thu_kieu_so + 2 : ''}`
            : 'chủ nhật'}
          , ngày{' '}
          {buoiHoc?.ngay_bd ? moment(buoiHoc.ngay_bd, 'YYYY-MM-DD').format('DD/MM/YYYY') : ''}
        </b>
      </Descriptions.Item>
      <Descriptions.Item label="Thời gian">
        <b>
          {buoiHoc?.tiet_bd && `Tiết ${buoiHoc?.tiet_bd?.[1]}, `}
          {buoiHoc?.ngay_gio_hoc &&
            moment(buoiHoc.ngay_gio_hoc, 'YYYY-MM-DD HH:mm:ss').format('HH:mm')}{' '}
          -{' '}
          {buoiHoc?.ngay_gio_ket_thuc &&
            moment(buoiHoc.ngay_gio_ket_thuc, 'YYYY-MM-DD HH:mm:ss').format('HH:mm')}
        </b>
      </Descriptions.Item>
      {buoiHoc?.nhom_lop_tin_chi_id && (
        <Descriptions.Item label="Nhóm lớp" span={2}>
          <b>{buoiHoc?.nhom_lop_tin_chi_id?.[1]}</b>
        </Descriptions.Item>
      )}
      <Descriptions.Item label="Phòng học">
        <b>{buoiHoc?.phong_hoc}</b>
      </Descriptions.Item>
    </Descriptions>
  );
};
export default ThongTinBuoiHoc;
