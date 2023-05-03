import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { type LopTinChi } from '@/services/LopTinChi/typings';
import { getNameFile } from '@/utils/utils';
import { Button, Modal, Tabs } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import FormNoiDungBuoiHoc from './components/FormNoiDungBuoiHoc';
import ThongTinBuoiHoc from './components/ThongTinBuoiHoc';

const DanhSachBuoiHoc = (props: { idLopTinChi: string; isGiangVien: boolean }) => {
  const { isGiangVien, idLopTinChi } = props;
  const {
    sinhVienGetThoiKhoaBieuModel,
    setListTkbSinhVien,
    listTkbSinhVien,
    recordBuoiHoc,
    setRecordBuoiHoc,
    loading,
  } = useModel('hoctap.loptinchi');
  const [visibleThongTin, setVisibleThongTin] = useState<boolean>(false);
  // const [recordBuoiHocGanNhat, setRecordBuoiHocGanNhat] = useState<BuoiHoc.Record | undefined>(
  //   undefined,
  // );
  // const [dataDiemDanh, setDataDiemDanh] = useState<BuoiHoc.SinhVienDiemDanh[]>();
  const [activeKey, setActiveKey] = useState('1');

  // const listBuoiHocCoNhom = listTkbSinhVien.filter(
  //   (buoiHoc) => Boolean(buoiHoc.nhom_lop_tin_chi_id) !== false,
  // );

  // useEffect(() => {
  //   setDataDiemDanh(recordDSSV?.danhSachDiemDanh);
  // }, [recordDSSV?.danhSachDiemDanh?.length]);

  useEffect(() => {
    sinhVienGetThoiKhoaBieuModel(idLopTinChi);

    return () => {
      setListTkbSinhVien([]);
    };
  }, [idLopTinChi]);

  const onCell = (rec: LopTinChi.IBuoiHoc) => ({
    onClick: () => {
      setRecordBuoiHoc(rec);
      // if (isGiangVien) khoiTaoDiemDanhByIdBuoiHocModel(rec.id);
      setVisibleThongTin(true);
    },
    style: {
      cursor: 'pointer',
      backgroundColor: moment().format('DD/MM/YYYY') === rec.ngay ? '#cc0d001f' : undefined,
    },
  });

  const columns: IColumn<LopTinChi.IBuoiHoc>[] = [
    {
      dataIndex: 'index',
      title: 'STT',
      width: 60,
      align: 'center',
      onCell,
    },
    {
      title: 'Ngày học',
      dataIndex: 'ngay',
      width: 150,
      render: (val) =>
        val ? (
          <>
            Tuần {moment(val).week()}, thứ {moment(val).day()}, ngày{' '}
            {moment(val).format('DD/MM/YYYY')}
          </>
        ) : null,
      onCell,
    },
    {
      title: 'Thời gian',
      dataIndex: 'tietBatDau',
      width: 80,
      render: (val, rec) => (
        <>
          {rec?.tietBatDau?.timeBatDau.slice(0, -3)} - {rec?.tietKetThuc?.timeKetThuc.slice(0, -3)}
        </>
      ),
      onCell,
    },
    {
      title: 'Phòng học',
      dataIndex: 'phongHoc',
      width: 80,
      onCell,
      render: (val) => (val ? val : 'Chưa cập nhật'),
    },
    // {
    //   dataIndex: ['nhom_lop_tin_chi_id', 1],
    //   title: 'Nhóm lớp',
    //   width: 130,
    //   onCell,
    //   hide: listBuoiHocCoNhom.length === 0,
    // },
    // {
    //   dataIndex: 'tong_so_sinh_vien',
    //   title: 'Trạng thái điểm danh',
    //   width: 80,
    //   render: (s, r) =>
    //     r.giang_vien_da_diem_danh ? (
    //       <>
    //         {r.diem_danh_buoi_hoc_ids.length - r.so_luong_vang} / {r.diem_danh_buoi_hoc_ids.length}
    //       </>
    //     ) : (
    //       <i style={{ color: '#a0a0a0' }}>Chưa điểm danh</i> //r.tong_so_sinh_vien
    //     ),
    //   onCell,
    //   hide: !isGiangVien,
    // },
    // {
    //   dataIndex: 'giang_vien_da_diem_danh',
    //   title: 'Đã điểm danh',

    //   width: 60,
    //   render: (check) => <Checkbox checked={check} />,
    //   onCell,
    // },
  ];

  return (
    <>
      {/* {recordBuoiHocGanNhat !== undefined ? (
        <>
          <ThongTinBuoiHoc buoiHoc={recordBuoiHocGanNhat} title="Buổi học gần nhất" />
          <Button
            onClick={() => {
              setRecord(recordBuoiHocGanNhat);
              if (isGiangVien) khoiTaoDiemDanhByIdBuoiHocModel(recordBuoiHocGanNhat.id);
              setVisibleDiemDanh(true);
            }}
            style={{ marginBottom: 24 }}
          >
            Chi tiết
          </Button>
          <br />
        </>
      ) : null} */}

      <span style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 12 }}>Tất cả buổi học</span>
      <TableStaticData
        hasTotal
        data={listTkbSinhVien.map((item, index) => ({ ...item, index: index + 1 }))}
        columns={columns}
        otherProps={{ pagination: false, loading }}
      />

      <Modal
        footer={
          <Button
            onClick={() => {
              setVisibleThongTin(false);
              // setRecordDSSV({} as BuoiHoc.ListSinhVien);
            }}
          >
            Đóng
          </Button>
        }
        width={800}
        destroyOnClose
        title="Thông tin buổi học"
        visible={visibleThongTin}
        onCancel={() => {
          setVisibleThongTin(false);
          // setRecordDSSV({} as BuoiHoc.ListSinhVien);
        }}
      >
        <ThongTinBuoiHoc buoiHoc={recordBuoiHoc} />

        <Tabs activeKey={activeKey} onChange={(val) => setActiveKey(val)}>
          <Tabs.TabPane tab="Nội dung bài học" key={'1'}>
            {isGiangVien ? (
              <div>
                <FormNoiDungBuoiHoc />
              </div>
            ) : (
              <>
                <span style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 12 }}>
                  Tiêu đề bài học:{' '}
                </span>
                {recordBuoiHoc?.tieuDeBaiHoc && recordBuoiHoc?.tieuDeBaiHoc !== 'false'
                  ? recordBuoiHoc?.tieuDeBaiHoc
                  : 'Chưa có dữ liệu'}
                <br />
                <span style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 12 }}>
                  Nội dung:{' '}
                </span>
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      recordBuoiHoc?.noiDungBaiHoc && recordBuoiHoc?.noiDungBaiHoc !== 'false'
                        ? recordBuoiHoc.noiDungBaiHoc
                        : 'Chưa có dữ liệu',
                  }}
                />
                <br />
                <span style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 12 }}>
                  Tập tin đính kèm:{' '}
                </span>
                {recordBuoiHoc?.urlBaiHoc && recordBuoiHoc?.urlBaiHoc.length > 0
                  ? recordBuoiHoc?.urlBaiHoc?.map((item) => (
                      <div key={item}>
                        <a href={item}>{getNameFile(item)}</a>
                      </div>
                    ))
                  : 'Chưa có dữ liệu'}
                <br />
              </>
            )}
          </Tabs.TabPane>

          {/* {isGiangVien ? (
            <Tabs.TabPane tab="Điểm danh" key={'2'}>
              <Descriptions column={{ xs: 1, md: 3 }} title="Thông tin điểm danh">
                <Descriptions.Item label="Có mặt">
                  <b>{dataDiemDanh?.filter((item) => item.trang_thai === 'Có mặt').length}</b>
                </Descriptions.Item>
                <Descriptions.Item label="Vắng có phép">
                  <b>{dataDiemDanh?.filter((item) => item.trang_thai === 'Vắng có phép').length}</b>
                </Descriptions.Item>
                <Descriptions.Item label="Vắng không phép">
                  <b>
                    {dataDiemDanh?.filter((item) => item.trang_thai === 'Vắng không phép').length}
                  </b>
                </Descriptions.Item>
              </Descriptions>

              <DanhSachSinhVienDiemDanh data={dataDiemDanh ?? []} setData={setDataDiemDanh} />

              <Row justify="center">
                <Popconfirm
                  title="Xác nhận lưu danh sách điểm danh sinh viên?"
                  onConfirm={async () => {
                    await giangVienDiemDanhModel({ danhSachDiemDanh: dataDiemDanh ?? [] });
                    getDanhSachBuoiHocByIdLopTinChiModel(idLopTinChi);
                    setVisibleDiemDanh(false);
                    setRecordDSSV({} as BuoiHoc.ListSinhVien);

                    getThongTinChungLopTinChi(recordLopTinChi.id);
                  }}
                >
                  <Button loading={loading} type="primary">
                    Lưu điểm danh
                  </Button>
                </Popconfirm>
              </Row>
            </Tabs.TabPane>
          ) : null} */}
        </Tabs>
      </Modal>
    </>
  );
};

export default DanhSachBuoiHoc;
