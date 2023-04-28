import TableBase from '@/components/Table';
import FormBieuMau from '@/pages/DichVuMotCuaV2/components/FormBieuMau';
import type { DichVuMotCuaV2 } from '@/services/DichVuMotCuaV2/typing';
import {
  ColorTrangThaiDonMotCua,
  ETrangThaiDonVps,
  MaDichVuVps,
  TrangThaiDonDVMC,
} from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EyeOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import { Button, Divider, Modal, Popconfirm, Popover, Tag, Tooltip, Tabs } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { useAccess, useModel } from 'umi';
import FormTao from './components/FormTao';
import FormQuyTrinh from '@/pages/DichVuMotCuaV2/components/FormQuyTrinh';
import { useEffect } from 'react';
import TableLichSuTraKetQua from '@/pages/DichVuMotCuaV2/components/TableLichSuTraKetQua';

const DonMuonXe = () => {
  const {
    getDonSinhVienModel,
    page,
    limit,
    condition,
    loading,
    recordDon,
    setRecordDon,
    nhanVienDeleteDonModel,
    adminGetDonVpsModel,
    trangThaiQuanLyDon,
    // exportDonModel,
    visibleFormDon,
    setVisibleFormDon,
    setRecordDonThaoTac,
    getDonThaoTacChuyenVienDieuPhoiModel,
    setCondition,
  } = useModel('dichvumotcuav2');
  const { putMeHuyMuonXeModel, putTrangThaiDonMuonXeModel } = useModel('quantrixecong');
  const [type, setType] = useState<'handle' | 'view' | 'create' | 'edit'>('handle');
  const [visible, setVisible] = useState<boolean>(false);
  const { initialState } = useModel('@@initialState');

  const access = useAccess();
  const canCreateDon = access.accessFilter({ maChucNang: 'don-van-phong-so:create' });
  const isQuanLy = access.adminAccessFilter({ maChucNang: 'quan-ly-muon-xe-cong' });
  const isCVDieuPhoi = access.accessFilter({ maChucNang: 'don-dvmc-thao-tac:read-all' });

  useEffect(() => {
    setCondition({ ...condition, 'thongTinDichVu.maDichVu': MaDichVuVps.MUON_OTO });
  }, []);

  const handleDon = (recordDonColumn: DichVuMotCuaV2.Don) => {
    getDonThaoTacChuyenVienDieuPhoiModel(undefined, { idDon: recordDonColumn?._id }, 1, 100);
    setRecordDon(recordDonColumn);
    setVisibleFormDon(true);
    setType('view');
  };

  const onCell = (rec: DichVuMotCuaV2.Don) => ({
    onClick: () => {
      if (isCVDieuPhoi) {
        handleDon(rec);
      } else {
        setRecordDon(rec);
        setVisible(true);
      }
    },
    style: { cursor: 'pointer' },
  });

  const onCancelFormDon = () => {
    setVisibleFormDon(false);
    setRecordDon({});
  };

  // const onClickMenuExport = (
  //   idDon: string,
  //   item: { key: 'word' | 'pdf' },
  //   mauExport: 'MAU_DON' | 'TRA_LOI',
  //   tenDon: string,
  // ) => {
  //   exportDonModel({
  //     idDon,
  //     mauExport,
  //     exportType: item.key,
  //     tenDon,
  //   });
  // };

  const columns: IColumn<DichVuMotCuaV2.Don>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 60,
      onCell,
    },
    {
      title: 'Tên đơn',
      dataIndex: ['thongTinDichVu', 'ten'],
      align: 'center',
      width: 150,
      onCell,
    },
    {
      title: 'Người tạo',
      dataIndex: ['thongTinNguoiTao', 'hoTen'],
      align: 'center',
      width: 120,
      search: 'search',
      onCell,
      render: (val) => <>{val ?? ''}</>,
    },
    {
      title: 'Đơn vị',
      dataIndex: ['thongTinNguoiTao', 'maDonVi'],
      align: 'center',
      width: 100,
      onCell,
      render: (val) => <>{val ?? ''}</>,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      align: 'center',
      width: 120,
      render: (val) => <>{moment(val).format('HH:mm DD/MM/YYYY')}</>,
      onCell,
    },
    {
      title: 'Trạng thái đơn',
      dataIndex: 'trangThai',
      align: 'center',
      width: 120,
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
      title: 'Thông tin mượn xe',
      hide: trangThaiQuanLyDon !== 'OK',
      children: [
        {
          title: 'Biển số xe',
          align: 'center',
          dataIndex: 'bienSoXe',
          search: 'search',
          width: 120,
          render: (val: any) => <>{val ?? ''}</>,
        },
        {
          title: 'Trạng thái mượn xe',
          align: 'center',
          dataIndex: 'thongTinMuonXe',
          width: 120,
          render: (val: any) => (
            <>
              {val ? (
                <Tag
                  color={
                    val?.trangThai == ETrangThaiDonVps.DA_DUYET
                      ? 'green'
                      : val?.trangThai == ETrangThaiDonVps.DA_TRA_XE
                      ? '#299b8c'
                      : val?.trangThai === ETrangThaiDonVps.DANG_MUON
                      ? '#72c9f1'
                      : 'red'
                  }
                >
                  {val?.trangThai ?? ''}
                </Tag>
              ) : (
                ''
              )}
            </>
          ),
          onCell,
        },
        {
          title: 'Thời gian thao tác',
          dataIndex: 'thongTinMuonXe',
          align: 'center',
          width: 120,
          render: (val: any) => (
            <>{val ? moment(val?.updatedAt).format('HH:mm DD/MM/YYYY') : '--'}</>
          ),
          onCell,
        },
      ],
    },
    {
      title: 'Thời gian mượn',
      dataIndex: ['thongTinDichVu'],
      align: 'center',
      width: 120,
      render: (val) =>
        val?.cauHinhBieuMau?.map((item: any) =>
          item?.label === 'Thời gian đi' ? moment(item?.value).format('HH:mm DD/MM/YYYY') : '',
        ),
      onCell,
    },
    {
      title: 'Thời gian trả',
      dataIndex: ['thongTinDichVu'],
      align: 'center',
      width: 120,
      render: (val) =>
        val?.cauHinhBieuMau?.map((item: any) =>
          item?.label === 'Thời gian về' ? moment(item?.value).format('HH:mm DD/MM/YYYY') : '',
        ),
      onCell,
    },

    {
      title: 'Thao tác',
      align: 'center',
      width: 80,
      fixed: 'right',
      render: (val, rec) => {
        return (
          <Popover
            placement="left"
            content={
              <>
                {/* <Tooltip title="Xuất mẫu đơn">
                  <Dropdown
                    overlay={
                      <Menu
                        onClick={(item: any) =>
                          onClickMenuExport(
                            rec?._id ?? '',
                            item,
                            'MAU_DON',
                            `BieuMau_${rec?.thongTinDichVu?.ten}_${rec?.thongTinNguoiTao?.maSinhVien}_${rec?.thongTinNguoiTao?.hoTen}`,
                          )
                        }
                      >
                        <Menu.Item key="word">Tải về</Menu.Item>
                        <Menu.Item key="pdf">In mẫu</Menu.Item>
                      </Menu>
                    }
                  >
                    <Button shape="circle" icon={<FileTextOutlined />} />
                  </Dropdown>
                </Tooltip>
                <Divider type="vertical" /> */}
                <Tooltip title="Xem đơn">
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<EyeOutlined />}
                    onClick={() => {
                      setRecordDon(rec);
                      setVisible(true);
                    }}
                  />
                </Tooltip>
                {!isQuanLy && rec?.thongTinMuonXe?.trangThai === ETrangThaiDonVps.DA_DUYET && (
                  <>
                    <Divider type="vertical" />
                    <Tooltip title="Hủy thông tin mượn xe">
                      <Popconfirm
                        title="Bạn có chắc muốn hủy thông tin này không?"
                        onConfirm={() => {
                          putMeHuyMuonXeModel({
                            trangThai: ETrangThaiDonVps.DA_HUY,
                            id: rec?.thongTinMuonXe?.idDon ?? '',
                          }).then(() =>
                            isQuanLy
                              ? adminGetDonVpsModel(MaDichVuVps.MUON_OTO)
                              : getDonSinhVienModel(MaDichVuVps.MUON_OTO),
                          );
                        }}
                      >
                        <Button danger shape="circle" icon={<CloseOutlined />} />
                      </Popconfirm>
                    </Tooltip>
                  </>
                )}
                {canCreateDon &&
                  rec?.trangThai === 'PROCESSING' &&
                  rec.thongTinNguoiTao?._id == initialState?.currentUser?.user_id[0] && (
                    <>
                      <Divider type="vertical" />
                      <Tooltip title="Xóa đơn">
                        <Popconfirm
                          title="Bạn có chắc muốn xóa đơn này không?"
                          onConfirm={() => {
                            nhanVienDeleteDonModel(rec?._id ?? '').then(() =>
                              isQuanLy
                                ? adminGetDonVpsModel(MaDichVuVps.MUON_OTO)
                                : getDonSinhVienModel(MaDichVuVps.MUON_OTO),
                            );
                          }}
                        >
                          <Button danger shape="circle" icon={<DeleteOutlined />} />
                        </Popconfirm>
                      </Tooltip>
                    </>
                  )}

                {isQuanLy && rec?.thongTinMuonXe?.trangThai === ETrangThaiDonVps.DA_DUYET && (
                  <>
                    <Divider type="vertical" />
                    <Tooltip title="Hủy đơn">
                      <Popconfirm
                        title="Bạn có chắc muốn hủy đơn này không?"
                        onConfirm={() =>
                          putTrangThaiDonMuonXeModel({
                            trangThai: ETrangThaiDonVps.DA_HUY,
                            id: rec?.thongTinMuonXe?.idDon ?? '',
                          }).then(() => adminGetDonVpsModel(MaDichVuVps.MUON_OTO))
                        }
                      >
                        <Button danger shape="circle" icon={<CloseOutlined />} />
                      </Popconfirm>
                    </Tooltip>
                    <>
                      <Divider type="vertical" />
                      <Tooltip title="Nhận lại xe">
                        <Popconfirm
                          title="Bạn có chắc muốn nhận xe này không?"
                          onConfirm={() => {
                            putTrangThaiDonMuonXeModel({
                              trangThai: ETrangThaiDonVps.DA_TRA_XE,
                              id: rec?.thongTinMuonXe?.idDon ?? '',
                            }).then(() => adminGetDonVpsModel(MaDichVuVps.MUON_OTO));
                          }}
                        >
                          <Button type="primary" shape="circle" icon={<CheckOutlined />} />
                        </Popconfirm>
                      </Tooltip>
                    </>
                  </>
                )}
              </>
            }
          >
            <Button icon={<MenuOutlined />} type="primary" />
          </Popover>
        );
      },
    },
  ];

  return (
    <div>
      <TableBase
        columns={columns}
        getData={() =>
          isQuanLy
            ? adminGetDonVpsModel(MaDichVuVps.MUON_OTO)
            : getDonSinhVienModel(MaDichVuVps.MUON_OTO)
        }
        loading={loading}
        dependencies={[page, limit, condition, trangThaiQuanLyDon]}
        modelName="dichvumotcuav2"
        hideCard
        hascreate={canCreateDon}
        dataState="danhSachDon"
        formType="Drawer"
        widthDrawer={800}
        Form={FormTao}
      />
      <Modal
        width={1000}
        bodyStyle={{ padding: 0 }}
        destroyOnClose
        onCancel={() => {
          setVisible(false);
        }}
        okButtonProps={{ hidden: true }}
        cancelText="Đóng"
        visible={visible}
      >
        <FormBieuMau type="view" infoNguoiTaoDon={initialState?.currentUser} record={recordDon} />
      </Modal>

      <Modal
        destroyOnClose
        width={800}
        footer={false}
        visible={visibleFormDon}
        onCancel={onCancelFormDon}
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
              onCancel={onCancelFormDon}
              record={recordDon}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Lịch sử trả kết quả" key={3}>
            <TableLichSuTraKetQua data={recordDon?.lichSuChinhSua ?? []} />
          </Tabs.TabPane>
        </Tabs>
      </Modal>
    </div>
  );
};

export default DonMuonXe;
