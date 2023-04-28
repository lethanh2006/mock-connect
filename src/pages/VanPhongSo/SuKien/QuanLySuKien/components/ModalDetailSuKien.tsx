import { Divider, Tag, Typography } from 'antd';
import { useModel } from 'umi';
import moment from 'moment';

const ModalDetailSuKien = () => {
  const { record } = useModel('sukien');
  return (
    <>
      <Typography.Paragraph>
        <b>Tên sự kiện: </b> {record?.tenSuKien}
      </Typography.Paragraph>
      {/* <Typography.Paragraph>
        <b>Loại sự kiện: </b> <Tag color="green">{record?.loaiSuKien}</Tag>
      </Typography.Paragraph> */}
      <Typography.Paragraph>
        <b>Thời gian bắt đầu: </b> {moment(record?.thoiGianBatDau).format('HH:mm DD/MM/YYYY')}
      </Typography.Paragraph>
      <Typography.Paragraph>
        <b>Thời gian Kết thúc: </b> {moment(record?.thoiGianKetThuc).format('HH:mm DD/MM/YYYY')}
      </Typography.Paragraph>
      <Typography.Paragraph>
        <b>Địa điểm: </b> {record?.diaDiem ?? ''}
      </Typography.Paragraph>
      <Typography.Paragraph>
        <b>Lặp lại sự kiện:</b>{' '}
        <Tag color="green">
          {record?.kieuLapSuKien
            ? record?.kieuLapSuKien === 'Ngay'
              ? 'Lặp theo ngày'
              : record?.kieuLapSuKien === 'Tuan'
              ? 'Lặp theo tuần'
              : record?.kieuLapSuKien === 'Thang'
              ? 'Lặp theo tháng'
              : 'Lặp theo năm'
            : 'Không lặp'}
        </Tag>
      </Typography.Paragraph>

      <Divider style={{ margin: '12px 0' }} />
      <Typography.Paragraph>
        <b style={{ fontSize: '16px' }}>Đối tượng áp dụng: </b>
        {record?.loaiDoiTuong?.find((item) => item === 'Tất cả')}
      </Typography.Paragraph>
      {record && record?.roles?.length > 0 && (
        <Typography.Paragraph>
          <b>Vai trò:</b>{' '}
          <ul>
            {record?.roles?.map((item) => (
              <li key={item ?? ''}>
                {item === 'can_bo_qlkh'
                  ? 'Cán bộ quản lý khoa học'
                  : item === 'ke_toan'
                  ? 'Kế toán'
                  : item === 'lanh_dao'
                  ? 'Lãnh đạo'
                  : item === 'nhan_vien'
                  ? 'Nhân viên'
                  : item === 'quan_tri'
                  ? 'Quản trị'
                  : 'Sinh viên'}
              </li>
            ))}
          </ul>
        </Typography.Paragraph>
      )}
      {record && record?.dataLopTinChi?.length > 0 && (
        <Typography.Paragraph>
          <b>Lớp tín chỉ:</b>{' '}
          <ul>
            {record?.dataLopTinChi?.map((item) => (
              <li key={item.id ?? ''}>{item?.ten_lop_tin_chi}</li>
            ))}
          </ul>
        </Typography.Paragraph>
      )}
      {record && record?.dataDonVi?.length > 0 && (
        <Typography.Paragraph>
          <b>Đơn vị:</b>{' '}
          <ul>
            {record?.dataDonVi?.map((item) => (
              <li key={item.id ?? ''}>{item?.ten_don_vi}</li>
            ))}
          </ul>
        </Typography.Paragraph>
      )}
      {record && record?.dataKhoa?.length > 0 && (
        <Typography.Paragraph>
          <b>Khóa: </b>{' '}
          <ul>
            {record?.dataKhoa?.map((item) => (
              <li key={item.id ?? ''}>{item?.display_name}</li>
            ))}
          </ul>
        </Typography.Paragraph>
      )}
      {record && record?.dataLopHanhChinh?.length > 0 && (
        <Typography.Paragraph>
          <b>Lớp hành chính:</b>{' '}
          <ul>
            {record?.dataLopHanhChinh?.map((item) => (
              <li key={item.id ?? ''}>{item?.ten_lop_hanh_chinh}</li>
            ))}
          </ul>
        </Typography.Paragraph>
      )}
      {record && record?.dataNganh?.length > 0 && (
        <Typography.Paragraph>
          <b>Ngành học:</b>{' '}
          <ul>
            {record?.dataNganh?.map((item) => (
              <li key={item.id ?? ''}>{item?.ten_nganh}</li>
            ))}
          </ul>
        </Typography.Paragraph>
      )}

      {record && record?.dataUser?.length > 0 && (
        <Typography.Paragraph>
          <b>Người dùng cụ thể:</b>{' '}
          <ul>
            {record?.dataUser?.map((item) => (
              <li key={item.code ?? ''}>{item?.name}</li>
            ))}
          </ul>
        </Typography.Paragraph>
      )}
      <Divider style={{ margin: '12px 0' }} />

      <Typography.Paragraph>
        <b>Ghi chú:</b> {record?.ghiChu ?? 'Không có'}
      </Typography.Paragraph>
    </>
  );
};

export default ModalDetailSuKien;
