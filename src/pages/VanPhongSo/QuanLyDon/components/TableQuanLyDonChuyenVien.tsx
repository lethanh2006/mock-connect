/* eslint-disable no-underscore-dangle */
import TableBase from '@/components/Table/index';
import ThanhToan from '@/components/ThanhToan';
import Form from '@/pages/DichVuMotCuaV2/components/FormBieuMau';
import { ColorTrangThaiDonMotCua, MaDichVuVps, TrangThaiDonDVMC } from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import { includes } from '@/utils/utils';
import {
  CopyOutlined,
  DeleteOutlined,
  FileDoneOutlined,
  FileTextOutlined,
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import {
  Button,
  Divider,
  Dropdown,
  Menu,
  message,
  Modal,
  Popconfirm,
  Select,
  Tabs,
  Tag,
  Tooltip,
} from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import type { DichVuMotCuaV2 } from '@/services/DichVuMotCuaV2/typing';
import FormQuyTrinh from '@/pages/DichVuMotCuaV2/components/FormQuyTrinh';
import TableLichSuTraKetQua from '@/pages/DichVuMotCuaV2/components/TableLichSuTraKetQua';

const TableQuanLyDon = (props: { hideFilter?: boolean }) => {
  const {
    chuyenVienDieuPhoiGetDonModel,
    chuyenVienXuLyGetDonModel,
    getDonThaoTacChuyenVienDieuPhoiModel,
    getDonThaoTacChuyenVienXuLyModel,
    page,
    limit,
    condition,
    loading,
    trangThaiQuanLyDon,
    danhSach,
    record,
    setRecord,
    visibleFormDon,
    setVisibleFormDon,
    recordDon,
    setRecordDonThaoTac,
    setRecordDon,
    exportDonModel,
    setTotal,
    setDanhSachDon,
    isDonCanXuLy,
    setIsDonCanXuLy,
    adminDeleteDonModel,
    typeTraKetQua,
    updateTrangThaiNhanKetQuaModel,
    chuyenVienDieuPhoiGetDonVpsModel,
    chuyenVienXuLyGetDonVpsModel,
    setCondition,
  } = useModel('dichvumotcuav2');

  const [type, setType] = useState<'handle' | 'view' | 'create' | 'edit'>('handle');

  const { pathname } = window.location;

  const onClickMenuExport = (
    idDon: string,
    item: { key: 'word' | 'pdf' },
    mauExport: 'MAU_DON' | 'TRA_LOI',
    tenDon: string,
  ) => {
    exportDonModel({
      idDon,
      mauExport,
      exportType: item.key,
      tenDon,
    });
  };

  useEffect(() => {
    return () => {
      setTotal(0);
      setDanhSachDon([]);
    };
  }, []);

  const handleDon = (recordDonColumn: DichVuMotCuaV2.Don) => {
    if (pathname?.includes('quanlydondieuphoi'))
      getDonThaoTacChuyenVienDieuPhoiModel(undefined, { idDon: recordDonColumn?._id }, 1, 100);
    else getDonThaoTacChuyenVienXuLyModel(undefined, { idDon: recordDonColumn?._id }, 1, 100);
    setRecordDon(recordDonColumn);
    setVisibleFormDon(true);
    setType('view');
  };

  const onCell = (recordDonColumn: DichVuMotCuaV2.Don) => ({
    onClick: () => {
      handleDon(recordDonColumn);
    },
    style: { cursor: 'pointer' },
  });

  const columns: IColumn<DichVuMotCuaV2.Don>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
      onCell,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      align: 'center',
      width: 120,
      render: (val) => (
        <span title={moment(val).format('DD/MM/YYYY HH:mm:ss')}>{moment(val).fromNow()}</span>
      ),
      onCell,
    },
    {
      title: 'Loại đơn',
      dataIndex: ['thongTinDichVu', 'ten'],
      align: 'center',
      width: 200,
      onCell,
    },
    {
      title: 'Người tạo',
      dataIndex: ['thongTinNguoiTao', 'hoTen'],
      width: 120,
      align: 'center',
      onCell,
      search: 'search',
      key: 'thongTinNguoiTao.hoTen',
      // notRegex: true,
    },
    {
      title: 'Mã nhân viên',
      dataIndex: ['thongTinNguoiTao', 'maSinhVien'],
      width: 150,
      align: 'center',
      onCell,
      search: 'search',
      key: 'thongTinNguoiTao.maSinhVien',
      // notRegex: true,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      align: 'center',
      width: 120,
      notRegex: true,
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
      title: 'Trạng thái thanh toán',
      dataIndex: 'trangThaiThanhToan',
      width: 120,
      align: 'center',
      render: (val) => <div>{val || 'Dịch vụ không tính phí'}</div>,
      onCell,
    },

    {
      title: 'Thao tác',
      align: 'center',
      width: 170,
      fixed: 'right',
      render: (recordDonColumn: DichVuMotCuaV2.Don) => {
        return (
          <>
            <Tooltip title="Xuất mẫu đơn">
              <Dropdown
                overlay={
                  <Menu
                    onClick={(item: any) =>
                      onClickMenuExport(
                        recordDonColumn?._id ?? '',
                        item,
                        'MAU_DON',
                        `BieuMau_${recordDonColumn?.thongTinDichVu?.ten}_${recordDonColumn?.thongTinNguoiTao?.maSinhVien}_${recordDonColumn?.thongTinNguoiTao?.hoTen}`,
                      )
                    }
                  >
                    <Menu.Item key="word">Tải về</Menu.Item>
                    <Menu.Item key="pdf">In mẫu</Menu.Item>
                  </Menu>
                }
              >
                <Button
                  shape="circle"
                  loading={loading}
                  icon={<FileTextOutlined />}
                  type="primary"
                />
              </Dropdown>
            </Tooltip>
            <Divider type="vertical" />
            <Tooltip title="Xuất mẫu trả kết quả">
              <Dropdown
                overlay={
                  <Menu
                    onClick={(item: any) =>
                      onClickMenuExport(
                        recordDonColumn?._id ?? '',
                        item,
                        'TRA_LOI',
                        `KetQua_${recordDonColumn?.thongTinDichVu?.ten}_${recordDonColumn?.thongTinNguoiTao?.maSinhVien}_${recordDonColumn?.thongTinNguoiTao?.hoTen}`,
                      )
                    }
                  >
                    <Menu.Item key="word">Tải về</Menu.Item>
                    <Menu.Item key="pdf">In mẫu</Menu.Item>
                  </Menu>
                }
              >
                <Button
                  shape="circle"
                  loading={loading}
                  icon={<FileDoneOutlined />}
                  type="primary"
                />
              </Dropdown>
            </Tooltip>
            {trangThaiQuanLyDon === 'PROCESSING' && (
              <>
                <Divider type="vertical" />
                <Tooltip title="Xóa đơn" placement="bottom">
                  <Popconfirm
                    onConfirm={async () => {
                      await adminDeleteDonModel(
                        recordDonColumn?._id ?? '',
                        pathname?.includes('quanlydondieuphoi') ? 'dieuphoi' : 'tiepnhan',
                      );
                    }}
                    title="Bạn có chắc chắn xóa đơn này?"
                  >
                    <Button shape="circle">
                      <DeleteOutlined />
                    </Button>
                  </Popconfirm>
                </Tooltip>
              </>
            )}
          </>
        );
      },
    },
  ];

  return (
    <TableBase
      columns={columns}
      dependencies={[
        page,
        limit,
        condition,
        trangThaiQuanLyDon,
        // record?._id,
        // danhSach,
        // isDonCanXuLy,
      ]}
      modelName="dichvumotcuav2"
      dataState="danhSachDon"
      scroll={{ x: 1350 }}
      loading={loading}
      getData={() => {
        if (pathname?.includes('quanlydondieuphoi')) {
          chuyenVienDieuPhoiGetDonVpsModel();
        } else {
          chuyenVienXuLyGetDonVpsModel();
        }
      }}
    >
      {props.hideFilter !== true && (
        <Select
          placeholder="Lọc theo loại dịch vụ"
          defaultValue={MaDichVuVps.MUON_OTO}
          onChange={(val: any | undefined) => {
            setCondition({ ...condition, 'thongTinDichVu.maDichVu': val });
          }}
          showSearch
          filterOption={(value, option) => includes(option?.props.children, value)}
          value={typeof record?._id === 'string' ? record?._id : undefined}
          style={{ width: '300px' }}
        >
          {danhSach?.map((item: any) => (
            <Select.Option key={item.maDichVu} value={item.maDichVu}>
              {item.ten}
            </Select.Option>
          ))}
        </Select>
      )}

      <Modal
        destroyOnClose
        width="900px"
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
            <Form
              hideCamKet
              infoNguoiTaoDon={recordDon?.thongTinNguoiTao}
              type={type}
              onCancel={() => {
                setVisibleFormDon(false);
              }}
              record={recordDon}
            />
          </Tabs.TabPane>
          {recordDon?.identityCode && (
            <Tabs.TabPane tab="Thông tin thanh toán" key={2}>
              <ThanhToan
                identityCode={recordDon?.identityCode}
                trangThaiThanhToan={recordDon?.trangThaiThanhToan}
              />
            </Tabs.TabPane>
          )}
          <Tabs.TabPane tab="Lịch sử trả kết quả" key={3}>
            <TableLichSuTraKetQua data={recordDon?.lichSuChinhSua ?? []} />
          </Tabs.TabPane>
        </Tabs>
      </Modal>
    </TableBase>
  );
};

export default TableQuanLyDon;
