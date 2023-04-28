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
import { CloseOutlined, DeleteOutlined, EyeOutlined, MenuOutlined } from '@ant-design/icons';
import { Button, Divider, Modal, Popconfirm, Popover, Tag, Tooltip, Tabs } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useAccess, useModel } from 'umi';
import FormTao from './components/FormTao';
import FormQuyTrinh from '@/pages/DichVuMotCuaV2/components/FormQuyTrinh';
import TableLichSuTraKetQua from '@/pages/DichVuMotCuaV2/components/TableLichSuTraKetQua';

const DonMuonPhongHop = () => {
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
    record,
    // exportDonModel,
    visibleFormDon,
    setVisibleFormDon,
    setRecordDonThaoTac,
    getDonThaoTacChuyenVienDieuPhoiModel,
    setCondition,
  } = useModel('dichvumotcuav2');
  const { putMeHuyMuonPhongModel } = useModel('quantriphonghop');
  const [visible, setVisible] = useState<boolean>(false);
  const { initialState } = useModel('@@initialState');
  const [type, setType] = useState<'handle' | 'view' | 'create' | 'edit'>('handle');

  const access = useAccess();
  const canCreateDon = access.accessFilter({ maChucNang: 'don-van-phong-so:create' });
  const isQuanLy = access.adminAccessFilter({ maChucNang: 'quan-ly-muon-phong-hop' });
  const isCVDieuPhoi = access.accessFilter({ maChucNang: 'don-dvmc-thao-tac:read-all' });

  useEffect(() => {
    setCondition({ ...condition, 'thongTinDichVu.maDichVu': MaDichVuVps.MUON_PHONG_HOC });
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
    },
    {
      title: 'Đơn vị',
      dataIndex: ['thongTinNguoiTao', 'maDonVi'],
      align: 'center',
      width: 120,
      onCell,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      align: 'center',
      width: 120,
      render: (val) => <p>{moment(val).format('HH:mm DD/MM/YYYY')}</p>,
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
      title: 'Phòng họp',
      align: 'center',
      hide: trangThaiQuanLyDon !== 'OK',
      render: (val, rec) =>
        `Phòng ${rec.thongTinMuonPhong?.soPhong} (Nhà ${rec.thongTinMuonPhong?.toaNha})`,
      width: 150,
    },
    {
      title: 'Ngày giờ mượn',
      dataIndex: ['thongTinDichVu'],
      align: 'center',
      width: 120,
      render: (val) =>
        val?.cauHinhBieuMau?.map((item: any) =>
          item?.label === 'Ngày giờ mượn' ? moment(item?.value).format('HH:mm DD/MM/YYYY') : '',
        ),
      onCell,
    },
    {
      title: 'Ngày giờ trả',
      dataIndex: ['thongTinDichVu'],
      align: 'center',
      width: 120,
      render: (val) =>
        val?.cauHinhBieuMau?.map((item: any) =>
          item?.label === 'Ngày giờ trả' ? moment(item?.value).format('HH:mm DD/MM/YYYY') : '',
        ),
      onCell,
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 90,
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
                {!isQuanLy && rec?.thongTinMuonPhong?.trangThai === ETrangThaiDonVps.DA_DUYET && (
                  <>
                    <Divider type="vertical" />
                    <Tooltip title="Huỷ đơn mượn phòng">
                      <Popconfirm
                        title="Bạn có chắc muốn hủy đơn này không?"
                        onConfirm={() => {
                          putMeHuyMuonPhongModel({
                            trangThai: ETrangThaiDonVps.DA_HUY,
                            id: rec?.thongTinMuonPhong?.idDon ?? '',
                          });
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
                          disabled={rec?.trangThai !== 'PROCESSING'}
                          onConfirm={() => {
                            nhanVienDeleteDonModel(record?._id ?? '').then(() =>
                              isQuanLy
                                ? adminGetDonVpsModel(MaDichVuVps.MUON_PHONG_HOC)
                                : getDonSinhVienModel(MaDichVuVps.MUON_PHONG_HOC),
                            );
                          }}
                        >
                          <Button danger shape="circle" icon={<DeleteOutlined />} />
                        </Popconfirm>
                      </Tooltip>
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
            ? adminGetDonVpsModel(MaDichVuVps.MUON_PHONG_HOC)
            : getDonSinhVienModel(MaDichVuVps.MUON_PHONG_HOC)
        }
        loading={loading}
        hideCard
        hascreate={canCreateDon}
        dependencies={[page, limit, condition, trangThaiQuanLyDon]}
        modelName="dichvumotcuav2"
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
        width="900px"
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

export default DonMuonPhongHop;
