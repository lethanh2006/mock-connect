/* eslint-disable no-underscore-dangle */
import TableBase from '@/components/OldTable';
import ThanhToan from '@/components/ThanhToan';
import Form from '@/pages/DichVuMotCuaV2/components/FormBieuMau';
import type { DichVuMotCuaV2 } from '@/services/DichVuMotCuaV2/typing';
import { ColorTrangThaiDonMotCua, TrangThaiDonDVMC } from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import { includes } from '@/utils/utils';
import {
  CheckOutlined,
  CloseOutlined,
  CopyOutlined,
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
  message,
} from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import FormQuyTrinh from '../../components/FormQuyTrinh';
import TableLichSuTraKetQua from '../../components/TableLichSuTraKetQua';

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
  } = useModel('dichvumotcuav2');
  const {
    setIdDichVu,
    chuyenVienDieuPhoiGetTongSoDonDVMCModel,
    chuyenVienXuLyGetTongSoDonDVMCModel,
  } = useModel('dashboard');

  const [type, setType] = useState<'handle' | 'view' | 'create' | 'edit'>('handle');

  const { pathname } = window.location;
  const isDVMC = pathname?.includes('dichvumotcua') ?? false;

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

  const getData = () => {
    if (arrPathName?.includes('quanlydondieuphoi'))
      chuyenVienDieuPhoiGetDonModel(isDVMC ? 'DVMC' : 'VAN_PHONG_SO');
    else chuyenVienXuLyGetDonModel(isDVMC ? 'DVMC' : 'VAN_PHONG_SO');
  };

  const onCell = (recordDonColumn: DichVuMotCuaV2.Don) => ({
    onClick: () => {
      // getCsvcByIdModel(recordDonColumn?.idCoSoVatChat ?? '');
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
      title: 'Mã sinh viên',
      dataIndex: ['thongTinNguoiTao', 'maSinhVien'],
      width: 150,
      align: 'center',
      onCell,
      search: 'search',
      key: 'thongTinNguoiTao.maSinhVien',
      // notRegex: true,
    },
    {
      title: 'Địa chỉ nhận đơn',
      width: 200,
      align: 'center',
      hide: isDVMC ? false : true,
      // onCell,
      render: (recordTemp: DichVuMotCuaV2.Don) => {
        let isNhanTaiTruong = true;
        const blockNhanDon = recordTemp?.thongTinDichVu?.cauHinhBieuMau?.find(
          (item) => item.label === 'Phương thức nhận đơn',
        );
        let diaChiNhanDon = '';
        if (blockNhanDon?.value === 'Nhận tại trường') diaChiNhanDon = 'Nhận tại trường';
        else {
          const valueChuyenPhatNhanh = blockNhanDon?.dataSource
            ?.find((item) => item.label === 'Chuyển phát nhanh')
            ?.relatedElement?.find((item) => item.type === 'DON_VI_HANH_CHINH')?.value;
          diaChiNhanDon = [
            valueChuyenPhatNhanh?.soNhaTenDuong,
            valueChuyenPhatNhanh?.tenPhuongXa,
            valueChuyenPhatNhanh?.tenQuanHuyen,
            valueChuyenPhatNhanh?.tenTinh,
          ]
            ?.filter((item) => item !== null && item !== undefined && item !== '')
            ?.join(', ');
          if (diaChiNhanDon) isNhanTaiTruong = false;
        }
        return (
          <div>
            {isNhanTaiTruong === false && (
              <Tooltip title="Sao chép địa chỉ">
                <CopyOutlined
                  onClick={() => {
                    navigator.clipboard.writeText(diaChiNhanDon);
                    message.success('Đã copy địa chỉ');
                  }}
                  style={{ marginRight: 8, fontSize: 18 }}
                />
              </Tooltip>
            )}
            {diaChiNhanDon}
          </div>
        );
      },
    },
    {
      title: 'Bước',
      width: 150,
      onCell,
      align: 'center',
      hide: !isDVMC ? true : false,
      dataIndex: 'idBuocHienTai',
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
            {/* <Tooltip title="Chi tiết">
              <Button
                onClick={() => {
                  handleDon(recordDonColumn);
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
                    onConfirm={async () => {
                      await adminDeleteDonModel(
                        recordDonColumn?._id ?? '',
                        pathname?.includes('quanlydondieuphoi') ? 'dieuphoi' : 'tiepnhan',
                      );
                      if (pathname?.includes('quanlydondieuphoi')) {
                        chuyenVienDieuPhoiGetTongSoDonDVMCModel(isDonCanXuLy);
                      } else {
                        chuyenVienXuLyGetTongSoDonDVMCModel(isDonCanXuLy);
                      }
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
            {typeTraKetQua === 'CHUA_TRA_KQ' && (
              <>
                <Divider type="vertical" />
                <Tooltip title="Xác nhận đã trả đơn">
                  <Popconfirm
                    title="Bạn có chắc muốn thay đổi trạng thái trả kết quả không?"
                    onConfirm={() =>
                      updateTrangThaiNhanKetQuaModel(recordDonColumn?._id ?? '', true, getData)
                    }
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
                    onConfirm={() =>
                      updateTrangThaiNhanKetQuaModel(recordDonColumn?._id ?? '', false, getData)
                    }
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
    <TableBase
      columns={columns}
      dependencies={[
        page,
        limit,
        condition,
        trangThaiQuanLyDon,
        record?._id,
        danhSach,
        isDonCanXuLy,
      ]}
      modelName="dichvumotcuav2"
      dataState="danhSachDon"
      scroll={{ x: 1350 }}
      loading={loading}
      getData={() => {
        if (pathname?.includes('quanlydondieuphoi')) {
          if (isDVMC) chuyenVienDieuPhoiGetDonModel(isDVMC ? 'DVMC' : 'VAN_PHONG_SO');
          else chuyenVienDieuPhoiGetDonVpsModel();
        } else {
          if (isDVMC) chuyenVienXuLyGetDonModel('DVMC');
          else chuyenVienXuLyGetDonVpsModel();
        }
      }}
    >
      {trangThaiQuanLyDon === 'PROCESSING' && (
        <Select
          onChange={(val) => {
            setIsDonCanXuLy(val);
            if (pathname?.includes('quanlydondieuphoi')) {
              chuyenVienDieuPhoiGetTongSoDonDVMCModel(val);
            } else {
              chuyenVienXuLyGetTongSoDonDVMCModel(val);
            }
          }}
          style={{ marginRight: 8, width: 150 }}
          value={isDonCanXuLy}
        >
          <Select.Option key={0} value={0}>
            Tất cả đơn
          </Select.Option>
          <Select.Option key={1} value={1}>
            Đơn cần xử lý
          </Select.Option>
        </Select>
      )}
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
          filterOption={(value, option) => includes(option?.props.children, value)}
          value={typeof record?._id === 'string' ? record?._id : undefined}
          style={{ width: '400px' }}
        >
          {danhSach?.map((item) => (
            <Select.Option key={item._id} value={item._id}>
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
