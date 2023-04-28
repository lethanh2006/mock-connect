import TableBase from '@/components/Table';
import FormBieuMau from '@/pages/DichVuMotCuaV2/components/FormBieuMau';
import type { DichVuMotCuaV2 } from '@/services/DichVuMotCuaV2/typing';
import { ColorTrangThaiDonMotCua, MaDichVuVps, TrangThaiDonDVMC } from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import { EyeOutlined, MenuOutlined } from '@ant-design/icons';
import { Button, Modal, Popover, Tag, Tooltip, Tabs } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useAccess, useModel } from 'umi';
import FormTao from './components/FormTao';
import FormQuyTrinh from '@/pages/DichVuMotCuaV2/components/FormQuyTrinh';
import TableLichSuTraKetQua from '@/pages/DichVuMotCuaV2/components/TableLichSuTraKetQua';

const DonBaoCaoSuCo = () => {
  const {
    getDonSinhVienModel,
    page,
    limit,
    condition,
    loading,
    recordDon,
    setRecordDon,
    adminGetDonVpsModel,
    trangThaiQuanLyDon,
    // exportDonModel,
    visibleFormDon,
    setVisibleFormDon,
    setRecordDonThaoTac,
    getDonThaoTacChuyenVienDieuPhoiModel,
    setCondition,
  } = useModel('dichvumotcuav2');
  const [visible, setVisible] = useState<boolean>(false);
  const { initialState } = useModel('@@initialState');

  const access = useAccess();
  const canCreateDon = access.accessFilter({ maChucNang: 'don-van-phong-so:create' });
  const isQuanLy = access.adminAccessFilter({ maChucNang: 'quan-tri-vps' });
  const isCVDieuPhoi = access.accessFilter({ maChucNang: 'don-dvmc-thao-tac:read-all' });

  const [type, setType] = useState<'handle' | 'view' | 'create' | 'edit'>('handle');

  useEffect(() => {
    setCondition({ ...condition, 'thongTinDichVu.maDichVu': MaDichVuVps.BAO_CAO_SU_CO });
  }, []);

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
        // getCsvcByIdModel(rec?.idCoSoVatChat?._id ?? '').then(() => {
        // });
      }
    },
    style: { cursor: 'pointer' },
  });

  const onCancelFormDon = () => {
    setVisibleFormDon(false);
    setRecordDon({});
  };

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
      width: 230,
      search: 'search',
      onCell,
      render: (val) => <>{val ?? ''}</>,
    },
    {
      title: 'Đơn vị',
      dataIndex: ['thongTinNguoiTao', 'maDonVi'],
      align: 'center',
      width: 120,
      onCell,
      render: (val) => <>{val ?? ''}</>,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      align: 'center',
      width: 150,
      render: (val) => <>{moment(val).format('HH:mm DD/MM/YYYY')}</>,
      onCell,
    },
    {
      title: 'Trạng thái đơn',
      dataIndex: 'trangThai',
      align: 'center',
      width: 150,
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
      title: 'Thao tác',
      align: 'center',
      width: 90,
      fixed: 'right',
      render: (rec) => {
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
            ? adminGetDonVpsModel(MaDichVuVps.BAO_CAO_SU_CO)
            : getDonSinhVienModel(MaDichVuVps.BAO_CAO_SU_CO)
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

export default DonBaoCaoSuCo;
