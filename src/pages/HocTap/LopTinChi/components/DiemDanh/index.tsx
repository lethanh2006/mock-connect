import TableBaseStatic from '@/components/Table/Table';
import type { BuoiHoc } from '@/services/LopTinChi/typings';
import type { IColumn } from '@/utils/interfaces';
import { getNameFile } from '@/utils/utils';
import { Button, Descriptions, Modal, Popconfirm, Row, Tabs } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import DanhSachSinhVienDiemDanh from './DanhSachSinhVien';
import FormNoiDungBuoiHoc from './FormNoiDungBuoiHoc';
import ThongTinBuoiHoc from './ThongTinBuoiHoc';

export default (props: { idLopTinChi: number; isGiangVien: boolean }) => {
  const {
    danhSach,
    setDanhSach,
    record,
    setRecord,
    getDanhSachBuoiHocByIdLopTinChiModel,
    setRecordDSSV,
    recordDSSV,
    khoiTaoDiemDanhByIdBuoiHocModel,
    giangVienDiemDanhModel,
    loading,
  } = useModel('diemdanh');
  const { getThongTinChungLopTinChi, record: recordLopTinChi } = useModel('hoctap.loptinchi');
  const [visibleDiemDanh, setVisibleDiemDanh] = useState<boolean>(false);
  const [recordBuoiHocGanNhat, setRecordBuoiHocGanNhat] = useState<BuoiHoc.Record | undefined>(
    undefined,
  );
  const [dataDiemDanh, setDataDiemDanh] = useState<BuoiHoc.SinhVienDiemDanh[]>();
  const { isGiangVien, idLopTinChi } = props;
  const [activeKey, setActiveKey] = useState('1');

  const listBuoiHocCoNhom = danhSach.filter(
    (buoiHoc) => Boolean(buoiHoc.nhom_lop_tin_chi_id) !== false,
  );

  useEffect(() => {
    setDataDiemDanh(recordDSSV?.danhSachDiemDanh);
  }, [recordDSSV?.danhSachDiemDanh?.length]);

  useEffect(() => {
    getDanhSachBuoiHocByIdLopTinChiModel(idLopTinChi).then((dsBuoiHoc) => {
      const buoiHoc = dsBuoiHoc.filter((item) => moment().isBefore(item.ngay_gio_ket_thuc))?.[0];
      setRecordBuoiHocGanNhat(buoiHoc);
    });

    return () => {
      setDanhSach([]);
    };
  }, [idLopTinChi]);

  const onCell = (rec: BuoiHoc.Record) => ({
    onClick: () => {
      setRecord(rec);
      if (isGiangVien) khoiTaoDiemDanhByIdBuoiHocModel(rec.id);
      setVisibleDiemDanh(true);
    },
    style: {
      cursor: 'pointer',
      backgroundColor: moment().format('YYYY-MM-DD') === rec.ngay_bd ? '#cc0d001f' : undefined,
    },
  });

  const columns: IColumn<BuoiHoc.Record>[] = [
    {
      dataIndex: 'index',
      title: 'STT',
      align: 'center',
      width: 60,
      onCell,
    },
    {
      dataIndex: 'tuan_hoc',
      title: 'Ngày học',
      width: 150,
      render: (s, rec) => (
        <>
          Tuần {rec?.tuan_hoc || ''},{' '}
          {rec?.thu_kieu_so !== 6
            ? `thứ ${typeof rec?.thu_kieu_so === 'number' ? rec?.thu_kieu_so + 2 : ''}`
            : 'chủ nhật'}
          , ngày {rec?.ngay_bd ? moment(rec.ngay_bd, 'YYYY-MM-DD').format('DD/MM/YYYY') : ''}
        </>
      ),
      align: 'center',
      onCell,
    },
    {
      dataIndex: 'ngay_gio_hoc',
      title: 'Thời gian',
      align: 'center',
      width: 80,
      render: (s, r) => (
        <>
          {r?.tiet_bd && `Tiết ${r.tiet_bd?.[1]}, `}
          {r?.ngay_gio_hoc && moment(r.ngay_gio_hoc, 'YYYY-MM-DD HH:mm:ss').format('HH:mm')} -{' '}
          {r?.ngay_gio_ket_thuc &&
            moment(r.ngay_gio_ket_thuc, 'YYYY-MM-DD HH:mm:ss').format('HH:mm')}
        </>
      ),
      onCell,
    },
    {
      dataIndex: 'phong_hoc',
      title: 'Phòng học',
      align: 'center',
      width: 80,
      onCell,
    },
    {
      dataIndex: ['nhom_lop_tin_chi_id', 1],
      title: 'Nhóm lớp',
      align: 'center',
      width: 130,
      onCell,
      hide: listBuoiHocCoNhom.length === 0,
    },
    {
      dataIndex: 'tong_so_sinh_vien',
      title: 'Trạng thái điểm danh',
      align: 'center',
      width: 80,
      render: (s, r) =>
        r.giang_vien_da_diem_danh ? (
          <>
            {r.diem_danh_buoi_hoc_ids.length - r.so_luong_vang} / {r.diem_danh_buoi_hoc_ids.length}
          </>
        ) : (
          <i style={{ color: '#a0a0a0' }}>Chưa điểm danh</i> //r.tong_so_sinh_vien
        ),
      onCell,
      hide: !isGiangVien,
    },
    // {
    //   dataIndex: 'giang_vien_da_diem_danh',
    //   title: 'Đã điểm danh',
    //   align: 'center',
    //   width: 60,
    //   render: (check) => <Checkbox checked={check} />,
    //   onCell,
    // },
  ];

  return (
    <>
      {recordBuoiHocGanNhat !== undefined ? (
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
      ) : null}

      <span style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 12 }}>Tất cả buổi học</span>
      <TableBaseStatic
        hasTotal
        data={danhSach.map((item, index) => ({ ...item, index: index + 1 }))}
        columns={columns}
        scroll={{ x: 700 }}
        otherProps={{ pagination: false, loading }}
      />

      <Modal
        footer={
          <Button
            onClick={() => {
              setVisibleDiemDanh(false);
              setRecordDSSV({} as BuoiHoc.ListSinhVien);
            }}
          >
            Đóng
          </Button>
        }
        width={800}
        destroyOnClose
        title="Thông tin buổi học"
        visible={visibleDiemDanh}
        onCancel={() => {
          setVisibleDiemDanh(false);
          setRecordDSSV({} as BuoiHoc.ListSinhVien);
        }}
      >
        <ThongTinBuoiHoc buoiHoc={record} title="" />

        <Tabs activeKey={activeKey} onChange={(val) => setActiveKey(val)}>
          <Tabs.TabPane tab="Nội dung bài học" key={'1'}>
            {isGiangVien ? (
              <FormNoiDungBuoiHoc
                getData={() => {
                  getDanhSachBuoiHocByIdLopTinChiModel(idLopTinChi);
                }}
              />
            ) : (
              <>
                <span style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 12 }}>
                  Tiêu đề bài học:{' '}
                </span>
                {record?.tieu_de_bai_hoc && record?.tieu_de_bai_hoc !== 'false'
                  ? record?.tieu_de_bai_hoc
                  : 'Chưa có dữ liệu'}
                <br />
                <span style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 12 }}>
                  Nội dung:{' '}
                </span>
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      record?.noi_dung_bai_hoc && record?.noi_dung_bai_hoc !== 'false'
                        ? record.noi_dung_bai_hoc
                        : 'Chưa có dữ liệu',
                  }}
                />
                <br />
                <span style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 12 }}>
                  Tập tin đính kèm:{' '}
                </span>
                {record?.url_bai_hoc && record?.url_bai_hoc.length > 0
                  ? record?.url_bai_hoc?.map((item) => (
                      <div key={item}>
                        <a href={item}>{getNameFile(item)}</a>
                      </div>
                    ))
                  : 'Chưa có dữ liệu'}
                <br />
              </>
            )}
          </Tabs.TabPane>

          {isGiangVien ? (
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
          ) : null}
        </Tabs>
      </Modal>
    </>
  );
};
