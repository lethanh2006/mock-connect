import TableBase from '@/components/Table';
import FormBieuMau from '@/pages/DichVuMotCuaV2/components/FormBieuMau';
import FormQuyTrinh from '@/pages/DichVuMotCuaV2/components/FormQuyTrinh';
import TableLichSuTraKetQua from '@/pages/DichVuMotCuaV2/components/TableLichSuTraKetQua';
import type { DichVuMotCuaV2 } from '@/services/DichVuMotCuaV2/typing';
import { ColorTrangThaiDonMotCua, TrangThaiDonDVMC } from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import { includes } from '@/utils/utils';
import { Modal, Select, Tabs, Tag } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const TableQuanLyDonAdmin = (props: {
  hideFilter?: boolean;
  type?: string;
  getDataThongKe?: any;
}) => {
  const {
    page,
    limit,
    condition,
    adminGetDonModel,
    loading,
    adminGetAllBieuMauModel,
    trangThaiQuanLyDon,
    danhSach,
    record,
    setRecord,
    setLoaiDichVu,
    recordDon,
    setRecordDon,
    setVisibleFormDon,
    visibleFormDon,
    setRecordDonThaoTac,
    // getDonThaoTacChuyenVienDieuPhoiModel,
  } = useModel('dichvumotcuav2');
  const [type, setType] = useState<'view' | 'handle' | 'create' | 'edit'>('view');

  useEffect(() => {
    setLoaiDichVu('VAN_PHONG_SO');
    adminGetAllBieuMauModel('VAN_PHONG_SO');
  }, []);

  const onCell = (rec: DichVuMotCuaV2.Don) => ({
    onClick: () => {
      // getDonThaoTacChuyenVienDieuPhoiModel(undefined, { idDon: rec?._id }, 1, 100);
      setRecordDon(rec);
      setVisibleFormDon(true);
      setType('view');
    },
    style: { cursor: 'pointer' },
  });

  const columns: IColumn<DichVuMotCuaV2.Don>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 60,
      onCell,
    },
    {
      title: 'Loại đơn',
      dataIndex: ['thongTinDichVu', 'ten'],
      align: 'center',
      width: 150,
      search: 'search',
      onCell,
    },
    {
      title: 'Người tạo',
      dataIndex: ['thongTinNguoiTao', 'hoTen'],
      width: 130,
      align: 'center',
      search: 'search',
      onCell,
    },
    {
      title: 'Mã cán bộ',
      dataIndex: ['thongTinNguoiTao', 'maSinhVien'],
      width: 100,
      align: 'center',
      search: 'search',
      onCell,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      align: 'center',
      width: 120,
      render: (val) => <div>{moment(val).format('HH:mm DD/MM/YYYY')}</div>,
      onCell,
    },
    // {
    //   title: 'Mã đơn',
    //   dataIndex: 'maDon',
    //   width: 100,
    //   align: 'center',
    //   search: 'search',
    //   onCell,
    // },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      align: 'center',
      width: 100,
      render: (val) => (
        <Tag
          color={
            TrangThaiDonDVMC?.[val] === TrangThaiDonDVMC.PROCESSING
              ? ColorTrangThaiDonMotCua.PROCESSING
              : TrangThaiDonDVMC?.[val] === TrangThaiDonDVMC.OK
              ? ColorTrangThaiDonMotCua.OK
              : ColorTrangThaiDonMotCua.NOT_OK
          }
        >
          {TrangThaiDonDVMC?.[val] ?? 'Chưa cập nhật'}
        </Tag>
      ),
      onCell,
    },
    {
      title: 'Cán bộ xử lý',
      render: (val, rec) =>
        rec.lichSuChinhSua.length
          ? `${rec.lichSuChinhSua.slice(-1)?.[0]?.tenNguoiSua} (${
              rec.lichSuChinhSua.slice(-1)?.[0]?.maNguoiSua
            })`
          : '--',
      width: 120,
      align: 'center',
      onCell,
      hide: trangThaiQuanLyDon === 'PROCESSING',
    },
    {
      title: 'Thời gian xử lý',
      render: (val, rec) =>
        rec.lichSuChinhSua.length
          ? moment(rec.lichSuChinhSua.slice(-1)?.[0]?.editDate).format('HH:mm DD/MM/YYYY')
          : '--',
      width: 120,
      align: 'center',
      onCell,
      hide: trangThaiQuanLyDon === 'PROCESSING',
    },
  ];

  return (
    <>
      <TableBase
        dataState="danhSachDon"
        modelName="dichvumotcuav2"
        scroll={{ x: 800 }}
        columns={columns}
        loading={loading}
        dependencies={[page, limit, condition, trangThaiQuanLyDon, record?._id]}
        getData={adminGetDonModel}
        hideCard
      >
        {props.hideFilter !== true && (
          <Select
            allowClear
            placeholder="Lọc theo loại dịch vụ"
            onChange={(val: string | undefined) => {
              setRecord(
                val
                  ? danhSach?.find((item) => item._id === val)
                  : ({
                      _id: {
                        $in: danhSach?.map((item) => item._id),
                      },
                    } as any),
              );
            }}
            showSearch
            value={typeof record?._id === 'string' ? record?._id : undefined}
            style={{ width: 300 }}
            filterOption={(value, option) => includes(option?.props.children, value)}
          >
            {danhSach?.map((item) => (
              <Select.Option key={item._id} value={item._id}>
                {item.ten}
              </Select.Option>
            ))}
          </Select>
        )}
      </TableBase>

      <Modal
        destroyOnClose
        width={800}
        footer={false}
        visible={visibleFormDon}
        onCancel={() => {
          setVisibleFormDon(false);
        }}
      >
        <Tabs
          onChange={() => {
            setRecordDonThaoTac(undefined);
          }}
        >
          <Tabs.TabPane tab="Quy trình" key={0}>
            <FormQuyTrinh
              type="view"
              idDon={recordDon?._id}
              record={recordDon?.thongTinDichVu?.quyTrinh}
              thoiGianTaoDon={recordDon?.createdAt}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Biểu mẫu" key={1}>
            <FormBieuMau
              hideCamKet
              infoNguoiTaoDon={recordDon?.thongTinNguoiTao}
              type={type}
              onCancel={() => {
                setVisibleFormDon(false);
              }}
              record={recordDon}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Lịch sử trả kết quả" key={3}>
            <TableLichSuTraKetQua data={recordDon?.lichSuChinhSua ?? []} />
          </Tabs.TabPane>
        </Tabs>
      </Modal>
    </>
  );
};

export default TableQuanLyDonAdmin;
