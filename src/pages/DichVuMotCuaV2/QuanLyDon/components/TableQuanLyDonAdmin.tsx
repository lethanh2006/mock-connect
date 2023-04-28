/* eslint-disable no-underscore-dangle */
import TableBase from '@/components/OldTable';
import ThanhToan from '@/components/ThanhToan';
import Form from '@/pages/DichVuMotCuaV2/components/FormBieuMau';
import type { DichVuMotCuaV2 } from '@/services/DichVuMotCuaV2/typing';
import { ColorTrangThaiDonMotCua, TrangThaiDonDVMC } from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import { includes, useCheckAccess } from '@/utils/utils';
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  FileDoneOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import {
  Button,
  Divider,
  Dropdown,
  Menu,
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
import FormQuyTrinh from '../../components/FormQuyTrinh';
import TableLichSuTraKetQua from '../../components/TableLichSuTraKetQua';

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
    visibleFormBieuMau,
    adminGetAllBieuMauModel,
    setVisibleFormBieuMau,
    trangThaiQuanLyDon,
    danhSach,
    record,
    setRecord,
    loaiDichVu,
    setLoaiDichVu,
    exportDonModel,
    adminDeleteDonModel,
    setRecordDon,
    updateTrangThaiNhanKetQuaModel,
    typeTraKetQua,
  } = useModel('dichvumotcuav2');
  const { setIdDichVu, adminGetTongSoDonDVMCModel } = useModel('dashboard');

  const [recordView, setRecordView] = useState<DichVuMotCuaV2.Don>();
  const [type, setType] = useState<'view' | 'handle' | 'create' | 'edit'>('view');
  const { pathname } = window.location;
  const isDVMC = pathname?.includes('dichvumotcua') ?? false;

  useEffect(() => {
    setLoaiDichVu(isDVMC ? 'DVMC' : 'VAN_PHONG_SO');
    adminGetAllBieuMauModel(isDVMC ? 'DVMC' : 'VAN_PHONG_SO');
  }, []);

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

  const onCell = (recordDon: DichVuMotCuaV2.Don) => ({
    onClick: () => {
      setRecordView(recordDon);
      setRecordDon(recordDon);
      setVisibleFormBieuMau(true);
      setType('view');
    },
    style: { cursor: 'pointer' },
  });

  const canDelete = useCheckAccess('don_dvmc_thao-tac:delete');

  const columns: IColumn<DichVuMotCuaV2.Don>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
      onCell,
    },
    {
      title: 'Loại đơn',
      dataIndex: ['thongTinDichVu', 'ten'],
      align: 'center',
      width: 200,
      search: 'search',
      onCell,
    },
    {
      title: 'Người tạo',
      dataIndex: ['thongTinNguoiTao', 'hoTen'],
      width: 200,
      align: 'center',
      search: 'search',
      onCell,
    },
    {
      title: 'Mã nhân viên',
      dataIndex: ['thongTinNguoiTao', 'maSinhVien'],
      width: 150,
      align: 'center',
      search: 'search',
      onCell,
    },
    {
      title: 'Mã đơn',
      dataIndex: 'maDon',
      width: 150,
      align: 'center',
      hide: isDVMC ? true : false,
      search: 'search',
      onCell,
    },
    {
      title: 'Bước',
      width: 150,
      align: 'center',
      dataIndex: 'idBuocHienTai',
      onCell,
      hide: !isDVMC ? true : false,
      render: (val, recordRender) => {
        return (
          <div>
            {recordRender?.thongTinDichVu?.quyTrinh?.danhSachBuoc?.find((item) => item._id === val)
              ?.ten ?? ''}
          </div>
        );
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      align: 'center',
      width: 120,
      // search: 'filterString',
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
      width: 150,
      align: 'center',
      render: (val) => <div>{val || 'Dịch vụ không tính phí'}</div>,
      onCell,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      align: 'center',
      width: 150,
      render: (val) => <div>{moment(val).format('HH:mm DD/MM/YYYY')}</div>,
      onCell,
    },

    {
      title: 'Thao tác',
      align: 'center',
      width: 170,
      fixed: 'right',
      render: (recordDon: DichVuMotCuaV2.Don) => {
        return (
          <>
            <Tooltip title="Xuất mẫu đơn">
              <Dropdown
                overlay={
                  <Menu
                    onClick={(item: any) =>
                      onClickMenuExport(
                        recordDon?._id ?? '',
                        item,
                        'MAU_DON',
                        `BieuMau_${recordDon?.thongTinDichVu?.ten}_${recordDon?.thongTinNguoiTao?.maSinhVien}_${recordDon?.thongTinNguoiTao?.hoTen}`,
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
                        recordDon?._id ?? '',
                        item,
                        'TRA_LOI',
                        `KetQua_${recordDon?.thongTinDichVu?.ten}_${recordDon?.thongTinNguoiTao?.maSinhVien}_${recordDon?.thongTinNguoiTao?.hoTen}`,
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

            {/* <Tooltip title="Chi tiết">
              <Button
                onClick={() => {
                  setRecordView(recordDon);
                  setVisibleFormBieuMau(true);
                  setType('view');
                }}
                shape="circle"
                icon={<EyeOutlined />}
              />
            </Tooltip> */}
            {trangThaiQuanLyDon === 'PROCESSING' && (
              <>
                <Divider type="vertical" />
                <Tooltip title="Xóa đơn" placement="bottom">
                  <Popconfirm
                    disabled={!canDelete}
                    onConfirm={async () => {
                      await adminDeleteDonModel(recordDon?._id ?? '');
                      adminGetTongSoDonDVMCModel();
                      if (loaiDichVu === 'VAN_PHONG_SO') {
                        props?.getDataThongKe();
                      }
                    }}
                    title="Bạn có chắc chắn xóa đơn này?"
                  >
                    <Button disabled={!canDelete} shape="circle">
                      <DeleteOutlined />
                    </Button>
                  </Popconfirm>
                </Tooltip>
              </>
            )}

            {typeTraKetQua === 'CHUA_TRA_KQ' && (
              <>
                <Divider type="vertical" />
                <Tooltip title="Xác nhận đã trả đơn">
                  <Popconfirm
                    title="Bạn có chắc muốn thay đổi trạng thái trả kết quả không?"
                    onConfirm={() => updateTrangThaiNhanKetQuaModel(recordDon?._id ?? '', true)}
                  >
                    <Button icon={<CheckOutlined />} shape="circle" />
                  </Popconfirm>
                </Tooltip>
              </>
            )}
            {typeTraKetQua === 'DA_TRA_KQ' && (
              <>
                <Divider type="vertical" />
                <Tooltip title="Xác nhận lại chưa trả đơn">
                  <Popconfirm
                    title="Bạn có chắc muốn thay đổi trạng thái trả kết quả không?"
                    onConfirm={() => updateTrangThaiNhanKetQuaModel(recordDon?._id ?? '', false)}
                  >
                    <Button icon={<CloseOutlined />} shape="circle" />
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
    <>
      <TableBase
        dataState="danhSachDon"
        widthDrawer="60%"
        modelName="dichvumotcuav2"
        scroll={{ x: 1300 }}
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
              setIdDichVu(val);
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
            style={{ width: '400px' }}
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
        width="820px"
        footer={false}
        visible={visibleFormBieuMau}
        bodyStyle={{ padding: 18 }}
        onCancel={() => {
          setVisibleFormBieuMau(false);
        }}
      >
        <Tabs>
          <Tabs.TabPane tab="Quy trình" key={0}>
            <FormQuyTrinh
              type="view"
              idDon={recordView?._id}
              record={recordView?.thongTinDichVu?.quyTrinh}
              thoiGianTaoDon={recordView?.createdAt}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Biểu mẫu" key={1}>
            <Form
              hideCamKet
              infoNguoiTaoDon={recordView?.thongTinNguoiTao}
              type={type}
              record={recordView}
            />
          </Tabs.TabPane>
          {recordView?.identityCode && (
            <Tabs.TabPane tab="Thông tin thanh toán" key={2}>
              <ThanhToan
                identityCode={recordView?.identityCode}
                trangThaiThanhToan={recordView?.trangThaiThanhToan}
              />
            </Tabs.TabPane>
          )}
          <Tabs.TabPane tab="Lịch sử trả kết quả" key={3}>
            <TableLichSuTraKetQua data={recordView?.lichSuChinhSua ?? []} />
          </Tabs.TabPane>
        </Tabs>
      </Modal>
    </>
  );
};

export default TableQuanLyDonAdmin;
