/* eslint-disable no-nested-ternary */
import { Descriptions } from 'antd';
import moment from 'moment';
import { useModel, useAccess } from 'umi';

const ThongTinNguoiTaoDon = (props: {
  record?: Login.Profile;
  thongTinNguoiTaoAdmin?: { hoTen: string; maDonVi: string; maSinhVien: string };
}) => {
  const { loaiDichVu, recordDon } = useModel('dichvumotcuav2');
  const access = useAccess();

  return (
    <Descriptions>
      <Descriptions.Item>
        Họ và tên:{' '}
        {props?.record?.name || props?.record?.hoTen || props?.thongTinNguoiTaoAdmin?.hoTen || ''}
      </Descriptions.Item>
      {loaiDichVu === 'DVMC' && (
        <Descriptions.Item>
          Ngày sinh:{' '}
          {props?.record?.ngay_sinh
            ? moment(props?.record?.ngay_sinh)?.format('DD-MM-YYYY')
            : props?.record?.ngaySinh !== 'false'
            ? props?.record?.ngaySinh?.split('-')?.reverse()?.join('-')
            : ''}
        </Descriptions.Item>
      )}
      <Descriptions.Item>
        {loaiDichVu === 'DVMC' ? 'Mã sinh viên' : 'Mã cán bộ'}:{' '}
        {props?.record?.ma_dinh_danh ||
          props?.record?.maSinhVien ||
          props?.thongTinNguoiTaoAdmin?.maSinhVien ||
          ''}
      </Descriptions.Item>
      <Descriptions.Item>
        {loaiDichVu === 'DVMC' ? 'Khoa' : 'Đơn vị'}:{' '}
        {props?.record?.ten_don_vi
          ? props?.record?.ten_don_vi
          : props?.record?.tenDonVi && props?.record?.tenDonVi !== 'false'
          ? props?.record?.tenDonVi
          : props?.record?.maDonVi && props?.record?.maDonVi !== 'false'
          ? props?.record?.maDonVi
          : props?.record?.don_vi_id
          ? props?.record?.don_vi_id[1]
          : props?.thongTinNguoiTaoAdmin?.maDonVi ?? ''}
      </Descriptions.Item>
      {loaiDichVu === 'DVMC' && (
        <>
          <Descriptions.Item>
            Lớp: {props?.record?.lop_hanh_chinh_id?.[1] || props?.record?.tenLopHanhChinh || ''}
          </Descriptions.Item>
          <Descriptions.Item>
            Chuyên ngành: {props?.record?.ten_nganh || props?.record?.tenNganh || ''}
          </Descriptions.Item>
          {!access.sinhVien && (
            <>
              <Descriptions.Item>
                Khóa: {recordDon?.thongTinNguoiTao?.khoaNganh?.[1] ?? ''}
              </Descriptions.Item>
              <Descriptions.Item>
                Hình thức đào tạo: {recordDon?.thongTinNguoiTao?.hinhThucDaoTaoId?.[1] ?? ''}
              </Descriptions.Item>
            </>
          )}
          <Descriptions.Item>SĐT: {props?.record?.soDienThoai}</Descriptions.Item>
          <Descriptions.Item>Email: {props?.record?.email}</Descriptions.Item>
        </>
      )}
    </Descriptions>
  );
};

export default ThongTinNguoiTaoDon;
