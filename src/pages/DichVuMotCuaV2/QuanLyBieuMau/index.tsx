import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/OldTable';
import FormView from '@/pages/DichVuMotCuaV2/components/FormBieuMau';
import type { DichVuMotCuaV2 } from '@/services/DichVuMotCuaV2/typing';
import type { IColumn } from '@/utils/interfaces';
import { useCheckAccess } from '@/utils/utils';
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Modal, Popconfirm, Switch, Tabs, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useAccess, useModel } from 'umi';
import FormQuyTrinh from '../components/FormQuyTrinh';
import Form from './components/Form';

const QuanLyBieuMau = () => {
  const {
    page,
    limit,
    condition,
    getBieuMauAdminModel,
    loading,
    setRecord,
    setEdit,
    setVisibleForm,
    deleteBieuMauAdminModel,
    setCurrent,
    setLoaiDichVu,
    setDanhSach,
    phamVi,
    putTrangThaiBieuMauModel,
  } = useModel('dichvumotcuav2');
  const { getAllDonViModel } = useModel('donvi');
  const { getProductByCodeModel } = useModel('thanhtoan');
  const { getAllHinhThucDaoTaoModel, danhSachHinhThucDaoTao } = useModel('hoctap.lophanhchinh');
  const access = useAccess();
  const [recordView, setRecordView] = useState<DichVuMotCuaV2.Don>();
  const [visible, setVisible] = useState<boolean>(false);

  const isCreate = useCheckAccess('dvmc-thao-tac:create');
  const isUpdate = useCheckAccess('dvmc-thao-tac:update');
  const isDelete = useCheckAccess('dvmc-thao-tac:delete');
  const { pathname } = window.location;
  const isDVMC = pathname?.includes('dichvumotcua') ?? false;

  useEffect(() => {
    setLoaiDichVu(isDVMC ? 'DVMC' : 'VAN_PHONG_SO');
    getAllHinhThucDaoTaoModel();
    getAllDonViModel();
    return () => {
      setRecord({} as DichVuMotCuaV2.BieuMau);
      setDanhSach([]);
    };
  }, []);

  const columns: IColumn<DichVuMotCuaV2.BieuMau>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
    },
    {
      title: 'Tên dịch vụ',
      dataIndex: 'ten',
      search: 'search',
      width: 200,
    },
    {
      title: 'Yêu cầu trả phí',
      dataIndex: ['thongTinThuTuc', 'yeuCauTraPhi'],
      // search: 'filter',
      width: 120,
      align: 'center',
      hide: !isDVMC,
      render: (val) => <div>{val ? 'Có' : 'Không'}</div>,
    },
    {
      title: 'Tính theo số lượng',
      dataIndex: ['thongTinThuTuc', 'tinhTienTheoSoLuong'],
      // search: 'search',
      width: 120,
      align: 'center',
      hide: !isDVMC,

      render: (val) => <div>{val ? 'Có' : 'Không'}</div>,
    },
    {
      title: 'Mô tả',
      dataIndex: 'moTa',
      search: 'search',
      width: 170,
      align: 'center',
      render: (val) => (
        <ExpandText
          style={{ marginBottom: 0 }}
          ellipsis={{ rows: 2, expandable: true, symbol: <span>Xem tiếp</span> }}
        >
          {val}
        </ExpandText>
      ),
      // render: (val) => <div>{val ? 'Có' : 'Không'}</div>,
    },
    {
      title: 'Hình thức đào tạo',
      width: 120,
      dataIndex: 'hinhThucDaoTaoId',
      align: 'center',
      hide: !access.admin,
      render: (val, record) => (
        <div>
          {record?.phamVi === 'Tất cả'
            ? 'Tất cả'
            : danhSachHinhThucDaoTao?.find((item) => item.id === val)?.display_name}
        </div>
      ),
    },

    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      align: 'center',
      width: 100,
      render: (val, record) => (
        <Switch
          checkedChildren="Mở"
          unCheckedChildren="Mở"
          checked={val}
          onChange={() => {
            putTrangThaiBieuMauModel(record._id);
          }}
        />
      ),
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 160,
      fixed: 'right',
      render: (record: DichVuMotCuaV2.BieuMau) => {
        return (
          <>
            <Tooltip title="Xem trước">
              <Button
                onClick={() => {
                  setRecord(record);
                  setRecordView({ thongTinDichVu: { ...record } } as any);
                  setVisible(true);
                }}
                shape="circle"
                icon={<EyeOutlined />}
              />
            </Tooltip>

            <Divider type="vertical" />
            <Tooltip title="Chỉnh sửa">
              <Button
                disabled={!isUpdate}
                onClick={() => {
                  // if (record?.thongTinThuTuc?.maLePhi) {
                  //   getProductByCodeModel(record?.thongTinThuTuc?.maLePhi);
                  // }
                  setRecord(record);
                  setEdit(true);
                  setVisibleForm(true);

                  setCurrent(isDVMC ? 0 : 1);
                }}
                shape="circle"
                type="primary"
                icon={<EditOutlined />}
              />
            </Tooltip>

            <Divider type="vertical" />
            <Tooltip title="Xóa">
              <Popconfirm
                disabled={!isDelete}
                onConfirm={() => {
                  deleteBieuMauAdminModel(record._id);
                }}
                title="Bạn có chắc chắn muốn xóa?"
              >
                <Button disabled={!isDelete} icon={<DeleteOutlined />} shape="circle" />
              </Popconfirm>
            </Tooltip>
          </>
        );
      },
    },
  ];

  const isLargeScreen = useMediaQuery({
    query: '(min-width: 992px)',
  });

  return (
    <>
      <TableBase
        widthDrawer={!isLargeScreen ? '80%' : '60%'}
        formType="Drawer"
        otherProps={{ scroll: { x: 1100 } }}
        title="Quản lý dịch vụ"
        modelName="dichvumotcuav2"
        columns={columns}
        loading={loading}
        dependencies={[page, limit, condition, phamVi]}
        getData={() => getBieuMauAdminModel(isDVMC ? 'DVMC' : 'VAN_PHONG_SO')}
        Form={Form}
      >
        {isCreate && (
          <Button
            onClick={() => {
              setVisibleForm(true);
              setEdit(false);
              setRecord({} as DichVuMotCuaV2.BieuMau);
              setCurrent(isDVMC ? 0 : 1);
            }}
            type="primary"
            icon={<PlusOutlined />}
          >
            Thêm mới
          </Button>
        )}
      </TableBase>

      <Modal
        destroyOnClose
        width="800px"
        footer={false}
        visible={visible}
        onCancel={() => {
          setVisible(false);
        }}
      >
        <Tabs>
          <Tabs.TabPane tab="Quy trình" key={0}>
            <FormQuyTrinh type="view" record={recordView?.thongTinDichVu?.quyTrinh} />
          </Tabs.TabPane>

          <Tabs.TabPane tab="Biểu mẫu" key={1}>
            <FormView
              onCancel={() => {
                setVisible(false);
              }}
              type="view"
              record={recordView}
            />
          </Tabs.TabPane>
        </Tabs>
      </Modal>
    </>
  );
};

export default QuanLyBieuMau;
