import React from 'react';
import { useAccess, useModel, history } from 'umi';
import {
  Card,
  Modal,
  Row,
  Col,
  Checkbox,
  Select,
  Button,
  Calendar as AntdCalendar,
  Popconfirm,
} from 'antd';
import { ELoaiSuKien } from '@/services/Calendar/constant';
import moment from 'moment';

const ModalViewDetailCalendar = (props: { visible: boolean; setVisible: any }) => {
  const { visible, setVisible } = props;
  const { record, setVisibleForm, deleteSuKienCaNhanModel, setEdit } = useModel('sukien');
  const access = useAccess();

  return (
    <Modal
      visible={visible}
      width="500px"
      title="Chi tiết lịch"
      destroyOnClose
      onCancel={() => {
        setVisible(false);
      }}
      footer={
        record?.loaiSuKien === ELoaiSuKien.CA_NHAN
          ? [
              <Button
                key="2"
                type="primary"
                onClick={() => {
                  setEdit(true);
                  setVisibleForm(true);
                  setVisible(false);
                }}
                style={{ marginLeft: '8px' }}
              >
                Chỉnh sửa
              </Button>,

              <Popconfirm
                key="3"
                title="Bạn có chắc chắn muốn xóa sự kiện này không?"
                onConfirm={() => {
                  deleteSuKienCaNhanModel(record?._id ?? '');
                  setVisible(false);
                }}
              >
                <Button key="3" danger>
                  Xóa sự kiện
                </Button>
              </Popconfirm>,
              <Button
                key="1"
                type="default"
                onClick={() => {
                  setVisible(false);
                }}
              >
                Đóng
              </Button>,
            ]
          : [
              <Button
                key="1"
                type="default"
                onClick={() => {
                  setVisible(false);
                }}
                style={{ marginLeft: '8px' }}
              >
                Đóng
              </Button>,
            ]
      }
      maskClosable
    >
      <div>
        <p>
          <b>Tên sự kiện: </b>
          {record?.loaiSuKien === ELoaiSuKien.LICH_HOC ? (
            <>
              {record?.info?.ten_hoc_phan ?? ''} - {record?.info?.lop_tin_chi_id[1] ?? ''}
            </>
          ) : (
            <>{record?.tenSuKien ?? ''}</>
          )}
        </p>
        {!['Cá nhân'].includes(record?.loaiSuKien ?? '') ? (
          <>
            {record?.info?.ten_hoc_phan && (
              <p>
                <b>Tên học phần: </b> {record?.info?.ten_hoc_phan}
              </p>
            )}
            {record?.info?.hoc_phan_id?.[1] && (
              <p>
                <b>Mã học phần: </b> {record?.info?.hoc_phan_id?.[1]}
              </p>
            )}

            <p>
              <b>Địa điểm: </b> {record?.diaDiem || 'Chưa cập nhật'}
            </p>
            <p>
              <b>Ghi chú: </b> {record?.ghiChu || 'Chưa cập nhật'}
            </p>
            {record?.info?.link_zoom && (
              <p>
                Link phòng zoom:{' '}
                <a target="_blank" href={record?.info?.link_zoom} rel="noreferrer">
                  Link
                </a>
              </p>
            )}
            {access.sinhVien && (
              <>
                {record?.info?.id_zoom && (
                  <p>
                    <b>ID phòng Zoom: </b> {record?.info?.id_zoom}
                  </p>
                )}
                {record?.info?.mat_khau_1 && (
                  <p>
                    <b>Mật khẩu phòng Zoom: </b> {record?.info?.mat_khau_1}
                  </p>
                )}
              </>
            )}
            {access.nhanVien && (
              <>
                {record?.info?.tai_khoan && (
                  <p>
                    <b>Tên đăng nhập Zoom: </b> {record?.info?.tai_khoan}
                  </p>
                )}
                {record?.info?.mat_khau && (
                  <p>
                    <b>Mật khẩu Zoom: </b> {record?.info?.mat_khau}
                  </p>
                )}
              </>
            )}
          </>
        ) : (
          <>
            <p>
              <b>Địa điểm: </b> {record?.diaDiem || 'Chưa cập nhật'}
            </p>
            <p>
              <b>Ghi chú: </b> {record?.ghiChu || 'Chưa cập nhật'}
            </p>
          </>
        )}
        <p>
          <b>Thời gian bắt đầu: </b>
          {record?.thoiGianBatDau
            ? moment(record?.thoiGianBatDau).format('HH:mm DD/MM/YYYY')
            : 'Chưa cập nhật'}
        </p>
        <p>
          <b>Thời gian kết thúc: </b>
          {record?.thoiGianKetThuc
            ? moment(record?.thoiGianKetThuc).format('HH:mm DD/MM/YYYY')
            : 'Chưa cập nhật'}
        </p>

        {record?.loaiSuKien === ELoaiSuKien.LICH_HOC && (
          <>
            {access.sinhVien && (
              <>
                <p>
                  <b>Giảng viên: </b> {record?.info?.ten_giang_vien ?? ' Chưa cập nhật'}
                </p>
                <p>
                  <b>Email: </b> {record?.info?.email || 'Chưa cập nhật'}
                </p>
                <p>
                  <b>Số điện thoại: </b> {record?.info?.dien_thoai || 'Chưa cập nhật'}
                </p>
              </>
            )}
            <Button
              type="link"
              onClick={() => {
                history.push(
                  `${access.sinhVien ? '/hoctap/loptinchi/' : '/loptinchi/danhsachlop/'}${
                    record?.info?.lop_tin_chi_id?.[0]
                  }`,
                );
              }}
            >
              Chi tiết lớp học
            </Button>
          </>
        )}
        {record?.loaiSuKien === ELoaiSuKien.LICH_THI && (
          <>
            <p>
              <b>Hình thức thi: </b> {record?.info?.hinh_thuc ?? ' Chưa cập nhật'}
            </p>
            <p>
              <b>Cán bộ coi thi: </b> {record?.info?.can_bo_coi_thi || 'Chưa cập nhật'}
            </p>
            <p>
              <b>Ghi chú: </b> {record?.info?.ghi_chu || 'Chưa cập nhật'}
            </p>
          </>
        )}
      </div>
    </Modal>
  );
};

export default ModalViewDetailCalendar;
