import { type SinhVien } from '@/services/DaoTao/SinhVien/typings';
import { Descriptions } from 'antd';

const ThongTinNguoiTaoDon = (props: {
  record?: SinhVien.IRecord;
  thongTinNguoiTaoAdmin?: { hoTen: string; maDonVi: string; maSinhVien: string };
}) => {
  return (
    <Descriptions column={{ xs: 2, sm: 2, md: 4, lg: 4, xl: 4, xxl: 4 }} size="small">
      <Descriptions.Item label={'Họ và tên'} span={2}>
        {props?.record?.ten}
      </Descriptions.Item>
      <Descriptions.Item label={'Ngày sinh'} span={2}>
        {props?.record?.ngaySinh ?? ''}
      </Descriptions.Item>
      <Descriptions.Item label={'Mã sinh viên'} span={2}>
        {props?.record?.ma || props?.thongTinNguoiTaoAdmin?.maSinhVien || ''}
      </Descriptions.Item>
      <Descriptions.Item span={2} label={'Hệ đào tạo'}>
        {props?.record?.khoaNganh?.khoaSinhVien?.trinhDoDaoTao?.dmTrinhDo?.ten}
      </Descriptions.Item>
      <Descriptions.Item span={2} label={'Hình thức đào tạo'}>
        {props?.record?.khoaNganh?.khoaSinhVien?.hinhThucDaoTao?.danhMucHTDT?.ten}
      </Descriptions.Item>
      <Descriptions.Item label={'Khóa'} span={2}>
        {props?.record?.khoaNganh?.khoaSinhVien?.ten}
      </Descriptions.Item>

      <Descriptions.Item label={'Ngành'} span={2}>
        {props?.record?.khoaNganh?.nganh?.ten}
      </Descriptions.Item>
      <Descriptions.Item label={'Lớp'} span={2}>
        {props?.record?.lopHanhChinhList?.[0]?.ten ?? ''}
      </Descriptions.Item>

      <Descriptions.Item label={'SĐT'} span={2}>
        {props?.record?.soDienThoai}
      </Descriptions.Item>
      <Descriptions.Item label={'Email'} span={2}>
        {props?.record?.email}
      </Descriptions.Item>

      <Descriptions.Item label={'Số CMT/CCCD'} span={2}>
        {props?.record?.cccd}
      </Descriptions.Item>
      <Descriptions.Item label={'Ngày cấp'} span={2}>
        {props?.record?.ngayCapCccd?.split('-')?.reverse()?.join('-')}
      </Descriptions.Item>
      <Descriptions.Item label={'Nơi cấp'} span={4}>
        {props?.record?.noiCapCccd}
      </Descriptions.Item>
      <Descriptions.Item label={'Nơi sinh'} span={4}>
        {[
          props.record?.xaPhuongNoiSinh,
          props.record?.quanHuyenNoiSinh,
          props.record?.tinhTpNoiSinh,
        ]
          .filter((item) => item !== '' && item !== null && item !== undefined)
          .join(', ')}
      </Descriptions.Item>
      <Descriptions.Item label={'Hộ khẩu thường trú'} span={4}>
        {[
          props.record?.soNhaTenDuongThuongTru,
          props.record?.xaPhuongThuongTru,
          props.record?.quanHuyenThuongTru,
          props.record?.tinhTpThuongTru,
        ]
          .filter((item) => item !== '' && item !== null && item !== undefined)
          .join(', ')}
      </Descriptions.Item>
    </Descriptions>
  );
};

export default ThongTinNguoiTaoDon;
