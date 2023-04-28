import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import Form from '@/pages/DichVuMotCua/components/FormBieuMau';
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MenuOutlined,
  PlusOutlined,
  PrinterOutlined,
} from '@ant-design/icons';
import { Button, Divider, message, Modal, Popconfirm, Popover, Tabs, Tag, Tooltip } from 'antd';
import axios from 'axios';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { history, useAccess, useModel } from 'umi';

const LichSuGuiDon = () => {
  const access = useAccess();
  const {
    page,
    limit,
    condition,
    getDonSinhVienModel,
    loading,
    visibleFormBieuMau,
    setVisibleFormBieuMau,
    setDanhSach,
    setLoaiDichVu,
    setRecord,
    sinhVienDeleteDonModel,
    visibleFormChinhSuaDon,
    setVisibleFormChinhSuaDon,
    setLoading,
    danhSach,
    getAllBieuMauModel,
  } = useModel('dichvumotcua');
  const [recordView, setRecordView] = useState<DichVuMotCua.Don>();
  const [visibleViewInDon, setVisibleViewInDon] = useState<boolean>(false);
  const [type, setType] = useState<'edit' | 'view' | 'handle' | 'create'>('view');
  const { pathname } = window.location;
  // const { getAllKyHocSinhVienModel, setDanhSach: setDanhSachKyHoc } = useModel('kyhoc');
  // const { getAllNamHocSinhVienModel, setDanhSach: setDanhSachNamHoc } = useModel('namhoc');
  const {
    getAllLopTinChiSinhVienModel,
    setDanhSach: setDanhSachLopTinChi,
    getAllMonHocSinhVienModel,
    setDanhSachMonHoc,
  } = useModel('hoctap.loptinchi');
  const [data, setData] = useState<any>();
  const isDVMC = pathname?.includes('dichvumotcua') ?? false;

  // useEffect(() => {
  //   setRecord({} as DichVuMotCua.BieuMau);
  //   setLoaiDichVu(isDVMC ? 'DVMC' : 'VAN_PHONG_SO');
  //   getAllBieuMauModel(isDVMC ? 'DVMC' : 'VAN_PHONG_SO');
  //   if (access.sinhVien) {
  //     getAllKyHocSinhVienModel();
  //     getAllNamHocSinhVienModel();
  //     getAllMonHocSinhVienModel();
  //     getAllLopTinChiSinhVienModel();
  //   }

  //   return () => {
  //     setDanhSach([]);
  //     setDanhSachLopTinChi([]);
  //     setDanhSachMonHoc([]);
  //     setDanhSachKyHoc([]);
  //     setDanhSachNamHoc([]);
  //   };
  // }, []);

  // const handleInDon = (maDon: string) => {
  //   setLoading(true);
  //   axios
  //     .get(
  //       `https://dhs.ptit.edu.vn/odoo-user-service/don-dvmc/public/ma-don/${maDon.trim()}/export/word/`,
  //     )
  //     .then((res) => {
  //       fetch(res?.data?.url, {
  //         method: 'GET', // specifying the method request
  //         // body: JSON.stringify(request), // specifying the body
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //       })
  //         .then((response) => {
  //           if (response.ok) {
  //             // checks if the response is with status 200 (successful)
  //             return response.blob().then((blob) => {
  //               // const name = "Report.pdf";
  //               // saveAs(blob, name);
  //               setData(blob);
  //               setVisibleViewInDon(true);
  //               window.scrollTo({ top: 0, behavior: 'smooth' });
  //               setLoading(false);
  //             });
  //           } else {
  //             setLoading(false);
  //             message.error('Đã có lỗi xảy ra, vui lòng thử lại sau');
  //             return null;
  //           }
  //         })
  //         .catch(function () {
  //           setLoading(false);
  //           message.error('Đã có lỗi xảy ra, vui lòng thử lại sau');
  //         });
  //     })
  //     .catch((error) => {
  //       const { response } = error;
  //       message.error(
  //         response?.status === 404
  //           ? 'Không tìm thấy đơn'
  //           : 'Đã có lỗi xảy ra, vui lòng thử lại sau',
  //       );
  //       setLoading(false);
  //     });
  // };

  const columns: IColumn<DichVuMotCua.Don>[] = [
    {
      title: 'Loại đơn',
      dataIndex: ['thongTinDichVu', 'ten'],
      width: 180,
    },
    {
      title: 'Ghi chú kết quả',
      dataIndex: 'ketQuaText',
      width: 120,
    },
    {
      title: 'File kết quả đính kèm',
      dataIndex: 'ketQuaDinhKem',
      width: 120,
      render: (val: string[]) => (
        <div>
          {val?.map((item, index) => (
            <>
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
    //   dataIndex: 'trangThai',
    //   width: 80,
    //   search: 'filterString',
    //   notRegex: true,
    //   render: (val) => (
    //     <Tag color={val === 'OK' ? 'green' : val === 'NOT_OK' ? 'red' : 'yellow'}>
    //       {TrangThaiDonDVMC?.[val] ?? 'Chưa cập nhật'}
    //     </Tag>
    //   ),
    // },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      width: 100,
      render: (val) => <div>{moment(val).format('HH:mm DD/MM/YYYY')}</div>,
    },
    {
      title: 'Thao tác',
      width: 60,
      fixed: 'right',
      render: (record: DichVuMotCua.Don) => {
        return (
          <Popover
            placement="left"
            content={
              <>
                <Tooltip title="Xem biểu mẫu và in đơn">
                  <Button
                    onClick={() => {
                      if (!record.maDon) {
                        message.error('Mã đơn không tồn tại');
                        return;
                      }
                      // handleInDon(record.maDon);
                    }}
                    shape="circle"
                    icon={<PrinterOutlined />}
                  />
                </Tooltip>
                <Divider type="vertical" />
                <Tooltip title="Chi tiết">
                  <Button
                    type="primary"
                    onClick={() => {
                      setRecord(
                        danhSach?.find((item) => item?._id === record?.thongTinDichVu?._id),
                      );
                      setRecordView(record);
                      setType('view');
                      setVisibleFormBieuMau(true);
                    }}
                    shape="circle"
                    icon={<EyeOutlined />}
                  />
                </Tooltip>
                <Divider type="vertical" />
                <Tooltip title="Chỉnh sửa">
                  <Button
                    disabled={record?.trangThai !== 'PROCESSING'}
                    onClick={() => {
                      setVisibleFormChinhSuaDon(true);
                      setRecordView(record);
                      setType('edit');
                    }}
                    shape="circle"
                    icon={<EditOutlined />}
                  />
                </Tooltip>
                <Divider type="vertical" />
                <Tooltip title="Xóa đơn">
                  <Popconfirm
                    disabled={record?.trangThai !== 'PROCESSING'}
                    title="Bạn có chắc chắn muốn xóa đơn này?"
                    onConfirm={() => {
                      sinhVienDeleteDonModel(record?._id ?? '');
                    }}
                  >
                    <Button
                      type="primary"
                      danger
                      disabled={record?.trangThai !== 'PROCESSING'}
                      shape="circle"
                      icon={<DeleteOutlined />}
                    />
                  </Popconfirm>
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
    <>
      <TableBase
        dataState="danhSachDon"
        widthDrawer={800}
        title="Dịch vụ một cửa"
        modelName="dichvumotcua"
        columns={columns}
        // getData={getDonSinhVienModel}
        buttons={{ create: false }}
        otherButtons={[
          <Button
            key={1}
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => history.push('/dich-vu-mot-cua/sinh-vien/tao-don')}
          >
            Tạo đơn
          </Button>,
        ]}
      />

      {/* <Modal
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
      </Modal> */}
    </>
  );
};

export default LichSuGuiDon;
