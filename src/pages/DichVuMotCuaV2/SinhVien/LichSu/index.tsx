import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/OldTable';
import PDFViewer from '@/components/PDFViewer';
import ThanhToan from '@/pages/CongNo/ThanhToan';
import Form from '@/pages/DichVuMotCuaV2/components/FormBieuMau';
import { TrangThaiDonDVMC } from '@/services/DVMC/DichVuMotCuaV2/constant';
import { type DichVuMotCuaV2 } from '@/services/DVMC/DichVuMotCuaV2/typing';
import type { IColumn } from '@/utils/interfaces';
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MenuOutlined,
  PaperClipOutlined,
  PlusOutlined,
  PrinterOutlined,
  QuestionOutlined,
} from '@ant-design/icons';
import { Button, Divider, Modal, Popconfirm, Popover, Tabs, Tag, Tooltip, message } from 'antd';
import axios from 'axios';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { history, useModel } from 'umi';
import FormGuiPhanHoi from '../../QuanLyDon/components/FormGuiPhanHoi';
import FormQuyTrinh from '../../components/FormQuyTrinh';

const LichSuGuiDon = () => {
  const {
    page,
    limit,
    condition,
    getDonSinhVienModel,
    loading,
    visibleFormBieuMau,
    setVisibleFormBieuMau,
    setDanhSach,
    setRecord,
    sinhVienDeleteDonModel,
    visibleFormChinhSuaDon,
    setVisibleFormChinhSuaDon,
    setLoading,
    danhSach,
    getAllBieuMauModel,
  } = useModel('dvmc.dichvumotcuav2');

  // const { getMyProfileModel, record } = useModel('sinhvien');

  const { setVisibleForm, visibleForm } = useModel('tienich.phanhoi');

  const [recordView, setRecordView] = useState<DichVuMotCuaV2.Don>();
  const [visibleViewInDon, setVisibleViewInDon] = useState<boolean>(false);
  const [type, setType] = useState<'edit' | 'view' | 'handle' | 'create'>('view');
  // const { getAllKyHocSinhVienModel, setDanhSach: setDanhSachKyHoc } = useModel('hocky');
  const { setDanhSach: setDanhSachNamHoc } = useModel('daotao.namhoc');
  // const { getAllLopTinChiSinhVienModel, setDanhSach: setDanhSachLopTinChi } =
  //   useModel('hoctap.loptinchi');
  // const { getAllMonHocSinhVienModel, setDanhSachMonHoc } = useModel('hoctap.loptinchi');
  const [data, setData] = useState<any>();

  useEffect(() => {
    // getMyProfileModel();
    setRecord({} as DichVuMotCuaV2.BieuMau);
    // setLoaiDichVu('DVMC');
    getAllBieuMauModel('DVMC');
    // if (access.sinhVien) {
    // getAllKyHocSinhVienModel();
    // getAllNamHocSinhVienModel();
    // getAllMonHocSinhVienModel();
    // getAllLopTinChiSinhVienModel();
    // }

    return () => {
      setDanhSach([]);
      // setDanhSachLopTinChi([]);
      // setDanhSachMonHoc([]);
      // setDanhSachKyHoc([]);
      setDanhSachNamHoc([]);
    };
  }, []);

  const handlePreviewDon = (recordTemp: DichVuMotCuaV2.Don) => {
    setRecord(danhSach?.find((item) => item?._id === recordTemp?.thongTinDichVu?._id));
    setRecordView(recordTemp);
    setType('view');
    setVisibleFormBieuMau(true);
  };

  const handleInDon = (maDon: string) => {
    setLoading(true);
    axios
      .get(
        `https://dhs.ptit.edu.vn/odoo-user-service/don-dvmc/public/ma-don/${maDon.trim()}/export/word/`,
      )
      .then((res) => {
        fetch(res?.data?.url, {
          method: 'GET', // specifying the method request
          // body: JSON.stringify(request), // specifying the body
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((response) => {
            if (response.ok) {
              // checks if the response is with status 200 (successful)
              return response.blob().then((blob) => {
                // const name = "Report.pdf";
                // saveAs(blob, name);
                setData(blob);
                setVisibleViewInDon(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setLoading(false);
              });
            } else {
              setLoading(false);
              message.error('Đã có lỗi xảy ra, vui lòng thử lại sau');
              return null;
            }
          })
          .catch(function () {
            setLoading(false);
            message.error('Đã có lỗi xảy ra, vui lòng thử lại sau');
          });
      })
      .catch((error) => {
        const { response } = error;
        message.error(
          response?.status === 404
            ? 'Không tìm thấy đơn'
            : 'Đã có lỗi xảy ra, vui lòng thử lại sau',
        );
        setLoading(false);
      });
  };

  const onCell = (recordDon: DichVuMotCuaV2.Don) => ({
    onClick: () => {
      handlePreviewDon(recordDon);
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
      width: 180,
      onCell,
    },
    {
      title: 'Ghi chú kết quả',
      dataIndex: 'ketQuaText',
      width: 120,
      onCell,
      render: (val) => (
        <ExpandText
          style={{ marginBottom: 0 }}
          ellipsis={{ rows: 2, expandable: true, symbol: <span>Xem tiếp</span> }}
        >
          {val}
        </ExpandText>
      ),
    },
    {
      title: 'Nội dung phản hồi',
      dataIndex: 'noiDungPhanHoi',
      align: 'center',
      width: 120,
      onCell,
    },
    {
      title: 'Nội dung trả lời phản hồi',
      dataIndex: 'noiDungTraLoiPhanHoi',
      align: 'center',
      width: 120,
      onCell,
    },
    {
      title: 'File kết quả đính kèm',
      dataIndex: 'ketQuaDinhKem',
      width: 120,
      render: (val: string[]) => (
        <div>
          {val?.map((item, index) => (
            <>
              <PaperClipOutlined />{' '}
              <a href={item} target="_blank" rel="noreferrer">
                File kết quả {index + 1}
              </a>
              <br />
            </>
          ))}
        </div>
      ),
    },
    // {
    //   title: 'Trạng thái',
    //   width: 120,
    //   align: 'center',
    //   dataIndex: ['daTraLoiPhanHoi'],
    //   search: 'filterString',
    //   notRegex: true,
    //   key: 'daTraLoiPhanHoi',
    //   render: (val) => (
    //     <Tag color={!val ? '#dc3545' : '#28a745'}>{val ? 'Đã trả lời' : 'Chưa trả lời'}</Tag>
    //   ),
    // },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      align: 'center',
      width: 100,
      search: 'filterString',
      notRegex: true,
      render: (val: 'OK' | 'NOT_OK' | 'PROCESSING') => (
        <Tag color={val === 'OK' ? 'green' : val === 'NOT_OK' ? 'red' : 'yellow'}>
          {TrangThaiDonDVMC?.[val] ?? 'Chưa cập nhật'}
        </Tag>
      ),
      onCell,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      width: 100,
      render: (val) => <div>{moment(val).format('HH:mm DD/MM/YYYY')}</div>,
      align: 'center',
      onCell,
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 60,
      fixed: 'right',
      render: (recordTemp: DichVuMotCuaV2.Don) => {
        return (
          <Popover
            placement="left"
            content={
              <>
                <Tooltip title="Xem biểu mẫu và in đơn">
                  <Button
                    shape="circle"
                    onClick={() => {
                      if (!recordTemp.maDon) {
                        message.error('Mã đơn không tồn tại');
                        return;
                      }
                      handleInDon(recordTemp.maDon);
                    }}
                    icon={<PrinterOutlined />}
                  />
                </Tooltip>

                <Divider type="vertical" />
                <Tooltip title="Chi tiết">
                  <Button
                    shape="circle"
                    onClick={() => {
                      handlePreviewDon(recordTemp);
                    }}
                    icon={<EyeOutlined />}
                  />
                </Tooltip>

                <Divider type="vertical" />
                <Tooltip title="Gửi phản hồi">
                  <Button
                    // disabled={recordTemp?.daTraLoiPhanHoi || recordTemp.noiDungPhanHoi || false}
                    shape="circle"
                    disabled={recordTemp?.trangThai !== 'PROCESSING'}
                    onClick={() => {
                      setVisibleForm(true);
                      setRecordView(recordTemp);
                    }}
                    icon={<QuestionOutlined />}
                  />
                </Tooltip>

                <Divider type="vertical" />
                <Tooltip title="Chỉnh sửa">
                  <Button
                    type="primary"
                    shape="circle"
                    disabled={recordTemp?.trangThai !== 'PROCESSING'}
                    onClick={() => {
                      setVisibleFormChinhSuaDon(true);
                      setRecordView(recordTemp);
                      setType('edit');
                    }}
                    icon={<EditOutlined />}
                  />
                </Tooltip>

                <Divider type="vertical" />
                <Tooltip title="Xóa đơn">
                  <Popconfirm
                    disabled={recordTemp?.trangThai !== 'PROCESSING'}
                    title="Bạn có chắc chắn muốn xóa đơn này?"
                    onConfirm={() => {
                      sinhVienDeleteDonModel(recordTemp?._id ?? '');
                    }}
                  >
                    <Button
                      shape="circle"
                      danger
                      disabled={recordTemp?.trangThai !== 'PROCESSING'}
                      icon={<DeleteOutlined />}
                    />
                  </Popconfirm>
                </Tooltip>
              </>
            }
          >
            <Button icon={<MenuOutlined />} type="link" />
          </Popover>
        );
      },
    },
  ];

  return (
    <>
      <TableBase
        dataState="danhSachDon"
        widthDrawer={800}
        title="Dịch vụ một cửa"
        modelName="dvmc.dichvumotcuav2"
        columns={columns}
        loading={loading}
        dependencies={[page, limit, condition]}
        getData={getDonSinhVienModel}
        scroll={{ x: 800 }}
      >
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => history.push('/dich-vu-mot-cua-sinh-vien/tao-don')}
        >
          Tạo đơn
        </Button>
      </TableBase>

      <Modal
        destroyOnClose
        width="850px"
        footer={false}
        visible={visibleFormChinhSuaDon}
        onCancel={() => {
          setVisibleFormChinhSuaDon(false);
        }}
      >
        <Form
          onCancel={() => {
            setVisibleFormChinhSuaDon(false);
          }}
          hideCamKet
          infoNguoiTaoDon={recordView?.thongTinNguoiTao}
          type={type}
          record={recordView}
        />
      </Modal>

      <Modal
        destroyOnClose
        width="850px"
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
        </Tabs>
      </Modal>
      <Modal
        visible={visibleViewInDon}
        onCancel={() => {
          setVisibleViewInDon(false);
        }}
        footer={[
          <Button
            onClick={() => {
              document?.getElementById('printButton')?.click();
            }}
            key={'print'}
            type="primary"
          >
            In đơn
          </Button>,
          <Button
            onClick={() => {
              setVisibleViewInDon(false);
            }}
            key={'close'}
          >
            Đóng
          </Button>,
        ]}
        destroyOnClose
        width={1200}
      >
        <PDFViewer data={data} />
      </Modal>
      <Modal
        bodyStyle={{ padding: 0 }}
        visible={visibleForm}
        onCancel={() => {
          setVisibleForm(false);
        }}
        footer={false}
        destroyOnClose
        width={600}
      >
        <FormGuiPhanHoi record={recordView} />
      </Modal>
    </>
  );
};

export default LichSuGuiDon;
