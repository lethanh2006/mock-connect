import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Card, Modal, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { history, useModel } from 'umi';
import FormBieuMau from '../../components/FormBieuMau';
import { type IColumn } from '@/components/Table/typing';

const GuiDon = () => {
  const {
    record,
    setRecord,
    visibleFormBieuMau,
    setVisibleFormBieuMau,
    loading,
    setPage,
    condition,
    setDanhSach,
    danhSach,
  } = useModel('dichvumotcua');
  const { getSettingByKeyModel } = useModel('setting');
  const { initialState } = useModel('@@initialState');
  const { pathname } = window.location;
  const isDVMC = pathname?.includes('dichvumotcua') ?? false;
  const [total, setTotal] = useState();

  useEffect(() => {
    setDanhSach([
      {
        _id: '63f0a1ee003dad9775b24556',
        ten: 'Đăng ký cấp lại thẻ sinh viên',
        fileMau: {},
        fileTraLoi: {},
        phamVi: 'Hình thức đào tạo',
        thongTinThuTuc: {
          choPhepGuiNhieuLan: false,
          yeuCauTraPhi: false,
          tinhTienTheoSoLuong: false,
        },
        thoiHanBatDauThaoTac: 'Bắt đầu thao tác',
        thongTinHoSo: '',
        thongTinQuyTrinh: '',
        thongTinYeuCau: '',
        hinhThucDaoTaoId: 8,
        traKetQua: false,
        cauHinhBieuMau: [
          {
            fileType: [],
            isRequired: false,
            relatedElement: [],
            dataSource: [],
            type: 'TEXT_INPUT',
            label: 'ss',
            _id: 'jf_04JEeB17SBSvw9FKYZ',
          },
        ],
        quyTrinh: {
          danhSachBuoc: [
            {
              danhSachThaoTac: [
                {
                  nguoiDieuPhoiMacDinh: false,
                  tenThaoTac: 'Tiếp nhận',
                  loaiDoiTuongXuLy: 'Đơn vị cụ thể',
                  soNgayXuLy: 5,
                  idDonVi: 92,
                  tenDonVi: 'Học viện',
                  _id: 'Rb8qpsMXflR4vYZIkep37',
                },
              ],
              ten: 'Bước 1',
              _id: 'rilAmTV_fNrgtNd6R44Il',
            },
          ],
          _id: '63f0a1ee003dad9775b24555',
        },
        loaiDichVu: 'DVMC',
        trangThai: true,
        createdAt: '2023-02-18T10:01:18.331Z',
        updatedAt: '2023-04-25T07:00:00.022Z',
        __v: 0,
        soLanSuDung: 0,
      },
    ]);
    // return () => {
    //   setDanhSach([]);
    //   setRecord({} as DichVuMotCua.BieuMau);
    //   getSettingByKeyModel('HDTT');
    //   setPage(1);
    // };
  }, []);

  const columns: IColumn<DichVuMotCua.BieuMau>[] = [
    {
      title: 'Dịch vụ',
      dataIndex: 'ten',
      filterType: 'string',
      width: 250,
    },
    {
      title: 'Loại dịch vụ',
      dataIndex: ['thongTinThuTuc', 'yeuCauTraPhi'],
      width: 100,
      render: (val) => (val ? 'Dịch vụ trả phí' : 'Dịch vụ không tính phí'),
    },
    {
      title: 'Mô tả',
      dataIndex: 'moTa',
      filterType: 'string',
      width: 250,
      render: (val) => (
        <ExpandText
          style={{ marginBottom: 0 }}
          ellipsis={{ rows: 3, expandable: true, symbol: <span>Xem tiếp</span> }}
        >
          {val}
        </ExpandText>
      ),
    },
    {
      title: 'Thao tác',
      width: 60,
      fixed: 'right',
      align: 'center',
      render: (recordBieuMau: DichVuMotCua.BieuMau) => (
        <Tooltip title="Sử dụng dịch vụ">
          <Button
            onClick={() => history.push(`/dich-vu-mot-cua/sinh-vien/tao-don/${recordBieuMau?._id}`)}
            shape="circle"
            type="primary"
            icon={<EditOutlined />}
          />
        </Tooltip>
      ),
    },
  ];
  return (
    <Card title={'Gửi đơn dịch vụ một cửa'}>
      <TableBase
        modelName="dichvumotcua"
        columns={columns}
        getData={() => {
          // getAllBieuMauModel(isDVMC ? 'DVMC' : 'VAN_PHONG_SO').then((res) => setTotal(res.length));
        }}
        hideCard
        buttons={{ create: false }}
        otherButtons={[
          <Button
            icon={<ArrowLeftOutlined />}
            key={1}
            onClick={() => history.push('/dich-vu-mot-cua/sinh-vien')}
          >
            Lịch sử gửi đơn
          </Button>,
        ]}
      />
    </Card>
  );
};

export default GuiDon;
