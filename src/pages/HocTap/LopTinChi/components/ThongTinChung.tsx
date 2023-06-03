import teacherIcon from '@/assets/teacher.png';
import { Avatar, Descriptions, Divider, List, Spin, Tabs } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import DanhSachSinhVien from './DanhSachSinhVien';
import ModalHocPhan from './DeCuongHocPhan/ModalHocPhan';

const ThongTinChung = (props: { id: string; isGiangVien: boolean }) => {
  const { isGiangVien } = props;
  const { loading, record, thongTinChung, idNhomLop, thongTinNhomLop, setIdNhomLop } =
    useModel('hoctap.loptinchi');
  const [visibleDeCuong, setVisibleDeCuong] = useState<boolean>(false);

  // useEffect(() => {
  //   if (props.id !== record.id) {
  //     getLopTinChiByIdLop(props.id);
  //   }

  //   getThongTinChungLopTinChi(record.id || props.id);
  //   getNhomLopTinChiByIdModel();

  //   return () => {
  //     setInfoMonHoc(undefined);
  //     setThongTinChung({} as any);
  //   };
  // }, [props.id]);

  // useEffect(() => {
  //   getInfoMonHocModel(record?.mon_hoc_ids?.[0]);
  // }, [record?.mon_hoc_ids?.[0]]);

  // useEffect(() => {
  //   getDanhSachSinhVienByIdNhomLopModel();
  // }, [idNhomLop]);

  return (
    <Spin spinning={loading}>
      <Descriptions column={{ xs: 1, md: 2 }} title="Thông tin lớp">
        <Descriptions.Item label="Học phần">
          <b>
            <a onClick={() => setVisibleDeCuong(true)}>{record?.hocPhan?.ten ?? ''}</a>
          </b>
        </Descriptions.Item>
        <Descriptions.Item label="Mã học phần">{record?.hocPhan?.ma ?? ''}</Descriptions.Item>
        <Descriptions.Item label="Số tín chỉ">
          {record?.hocPhan?.soTinChi ?? ''} tín chỉ
        </Descriptions.Item>
        <Descriptions.Item label="Sĩ số">{record?.siSo ?? 0} sinh viên</Descriptions.Item>
      </Descriptions>
      <>
        <h4 style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 16 }}>Giảng viên</h4>
        {record?.nhanSuList?.length ? (
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
            dataSource={record?.nhanSuList ?? []}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={item?.urlAnhDaiDien || teacherIcon} />}
                  title={<>Họ và tên: {item?.ten || '(Chưa cập nhật)'}</>}
                  description={
                    <>
                      <div>Email: {item?.email || '(Chưa cập nhật)'}</div>
                      <div>Số điện thoại: {item?.sdtCaNhan || '(Chưa cập nhật)'}</div>
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
              {/* <Button type="link" onClick={() => setModalVisible(true)}>
                (xem chi tiết)
              </Button> */}
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
        {/* {danhSachNhomLop?.map((item) => (
          <Tabs.TabPane tab={`Nhóm ${item.loai_nhom_lop} ${item.so_thu_tu_nhom}`} key={item.id} />
        ))} */}
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
                  title={<>Họ và tên: {item?.name || '(Chưa cập nhật)'}</>}
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

      <DanhSachSinhVien isGiangVien={isGiangVien} />

      {/* <Modal
        title="Vắng điểm danh"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        okButtonProps={{ hidden: true }}
        cancelText="Đóng"
      >
        <VangDiemDanh
          data={thongTinChung?.soBuoiVang?.concat(thongTinChung.soBuoiVangCoPhep) ?? []}
        />
      </Modal> */}

      <ModalHocPhan
        visible={visibleDeCuong}
        setVisible={setVisibleDeCuong}
        title="Chi tiết đề cương học phần"
      />
    </Spin>
  );
};

export default ThongTinChung;
