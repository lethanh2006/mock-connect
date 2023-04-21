import teacherIcon from '@/assets/teacher.png';
import { Avatar, Button, Descriptions, Divider, List, Modal, Spin, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import DanhSachSinhVien from './DanhSachSinhVien';
import VangDiemDanh from './VangDiemDanh';

const ThongTinChung = (props: { id: number; isGiangVien: boolean }) => {
  const { isGiangVien } = props;
  const {
    loading,
    record,
    getThongTinChungLopTinChi,
    thongTinChung,
    setThongTinChung,
    getLopTinChiByIdLop,
    danhSachNhomLop,
    getNhomLopTinChiByIdModel,
    idNhomLop,
    thongTinNhomLop,
    getDanhSachSinhVienByIdNhomLopModel,
    setIdNhomLop,
    infoMonHoc,
    setInfoMonHoc,
    getInfoMonHocModel,
  } = useModel('hoctap.loptinchi');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (props.id !== record.id) {
      getLopTinChiByIdLop(props.id);
    }

    getThongTinChungLopTinChi(record.id || props.id);
    getNhomLopTinChiByIdModel();

    return () => {
      setInfoMonHoc(undefined);
      setThongTinChung({} as any);
    };
  }, [props.id]);

  useEffect(() => {
    getInfoMonHocModel(record?.mon_hoc_ids?.[0]);
  }, [record?.mon_hoc_ids?.[0]]);

  useEffect(() => {
    getDanhSachSinhVienByIdNhomLopModel();
  }, [idNhomLop]);

  return (
    <Spin spinning={loading}>
      <Descriptions column={{ xs: 1, md: 2 }} title="Thông tin lớp">
        <Descriptions.Item label="Học phần">
          <b>{infoMonHoc?.ten_hoc_phan ?? ''}</b>
        </Descriptions.Item>
        <Descriptions.Item label="Mã học phần">
          <b>{infoMonHoc?.ma_hoc_phan_moi ?? ''}</b>
        </Descriptions.Item>
        <Descriptions.Item label="Số tín chỉ">
          <b>{infoMonHoc?.so_tin_chi ?? ''} tín chỉ</b>
        </Descriptions.Item>
        <Descriptions.Item label="Sĩ số">
          <b>{thongTinChung?.sinhVienList?.length ?? 0} sinh viên</b>
        </Descriptions.Item>
      </Descriptions>
      <>
        <h4 style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 16 }}>Giảng viên</h4>
        {thongTinChung.giangVienList?.length ? (
          <List
            grid={{
              xs: 1,
              xl: 3,
              sm: 2,
              lg: 3,
              md: 2,
              xxl: 4,
            }}
            itemLayout="horizontal"
            dataSource={thongTinChung.giangVienList ?? [thongTinChung?.giangVien ?? {}]}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={item?.avatar_path || teacherIcon} />}
                  title={
                    <>
                      Họ và tên: <b>{item?.name || '(Chưa cập nhật)'}</b>
                    </>
                  }
                  description={
                    <>
                      <div>Email: {item?.email || '(Chưa cập nhật)'}</div>
                      <div>Số điện thoại: {item?.so_dien_thoai || '(Chưa cập nhật)'}</div>
                    </>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <div style={{ marginBottom: 24 }}>Không có thông tin giảng viên</div>
        )}

        {!isGiangVien && (
          <>
            <h4 style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 12 }}>
              Thông tin điểm danh của bạn
            </h4>
            <p style={{ paddingBottom: 2 }}>
              Vắng có phép: {thongTinChung?.soBuoiVangCoPhep?.length ?? 0}
              <Divider type="vertical" />
              Vắng không phép: {thongTinChung?.soBuoiVang?.length ?? 0}
              <Button type="link" onClick={() => setModalVisible(true)}>
                (xem chi tiết)
              </Button>
            </p>
          </>
        )}
      </>

      <Tabs
        onChange={(val: string) => {
          setIdNhomLop(Number(val));
        }}
      >
        <Tabs.TabPane tab="Danh sách sinh viên" key={-1} />
        {danhSachNhomLop?.map((item) => (
          <Tabs.TabPane tab={`Nhóm ${item.loai_nhom_lop} ${item.so_thu_tu_nhom}`} key={item.id} />
        ))}
      </Tabs>

      {idNhomLop !== -1 &&
      thongTinNhomLop.giangVienList?.length &&
      thongTinChung.giangVienList?.length !== thongTinNhomLop.giangVienList.length ? (
        <>
          <h4 style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 16 }}>
            Giảng viên phụ trách nhóm lớp
          </h4>

          <List
            grid={{
              xs: 1,
              xl: 3,
              sm: 2,
              lg: 3,
              md: 2,
              xxl: 4,
            }}
            itemLayout="horizontal"
            dataSource={thongTinNhomLop.giangVienList}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={item?.avatar_path || teacherIcon} />}
                  title={
                    <>
                      Họ và tên: <b>{item?.name || '(Chưa cập nhật)'}</b>
                    </>
                  }
                  description={
                    <>
                      <div>Email: {item?.email || '(Chưa cập nhật)'}</div>
                      <div>Số điện thoại: {item?.so_dien_thoai || '(Chưa cập nhật)'}</div>
                    </>
                  }
                />
              </List.Item>
            )}
          />
        </>
      ) : null}

      <DanhSachSinhVien
        loading={loading}
        data={
          idNhomLop === -1 ? thongTinChung?.sinhVienList ?? [] : thongTinNhomLop?.sinhVienList ?? []
        }
        isGiangVien={isGiangVien}
        idLopTinChi={record.id}
      />

      <Modal
        title="Vắng điểm danh"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        okButtonProps={{ hidden: true }}
        cancelText="Đóng"
      >
        <VangDiemDanh
          data={thongTinChung?.soBuoiVang?.concat(thongTinChung.soBuoiVangCoPhep) ?? []}
        />
      </Modal>
    </Spin>
  );
};

export default ThongTinChung;
