/* eslint-disable no-underscore-dangle */
import PDFViewer from '@/components/PDFViewer';
import TableBase from '@/components/OldTable';
import ThanhToan from '@/components/ThanhToan';
import Form from '@/pages/DichVuMotCuaV2/components/FormBieuMau';
import { TrangThaiDonDVMC } from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MenuOutlined,
  PrinterOutlined,
} from '@ant-design/icons';
import { Button, Divider, message, Modal, Popconfirm, Popover, Tabs, Tooltip } from 'antd';
import axios from 'axios';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useAccess, useModel } from 'umi';
import FormQuyTrinh from '../../components/FormQuyTrinh';
import TableLichSuTraKetQua from '../../components/TableLichSuTraKetQua';
import type { DichVuMotCuaV2 } from '@/services/DichVuMotCuaV2/typing';

const LichSuGuiDon = () => {
  const access = useAccess();
  const {
    page,
    limit,
    condition,
    getDonSinhVienModel,
    loading,
    setDanhSach,
    setLoaiDichVu,
    setRecord,
    sinhVienDeleteDonModel,
    visibleFormChinhSuaDon,
    setVisibleFormChinhSuaDon,
    setLoading,
  } = useModel('dichvumotcuav2');
  const [recordView, setRecordView] = useState<DichVuMotCuaV2.Don>();
  const [visibleViewInDon, setVisibleViewInDon] = useState<boolean>(false);
  const [type, setType] = useState<'edit' | 'view' | 'handle' | 'create'>('view');
  const { pathname } = window.location;
  const { getAllKyHocSinhVienModel, setDanhSach: setDanhSachKyHoc } = useModel('hocky');
  const { getAllNamHocSinhVienModel, setDanhSach: setDanhSachNamHoc } = useModel('namhoc');
  const { getAllLopTinChiSinhVienModel, setDanhSach: setDanhSachLopTinChi } =
    useModel('hoctap.loptinchi');
  const { getAllMonHocSinhVienModel, setDanhSachMonHoc } = useModel('hoctap.loptinchi');
  const [data, setData] = useState<any>();
  const [visibleForm, setVisibleForm] = useState<boolean>(false);

  useEffect(() => {
    setRecord({} as DichVuMotCuaV2.BieuMau);
    setLoaiDichVu(pathname?.includes('dichvumotcua') ? 'DVMC' : 'VAN_PHONG_SO');
    if (access.sinhVien) {
      getAllKyHocSinhVienModel();
      getAllNamHocSinhVienModel();
      getAllMonHocSinhVienModel();
      getAllLopTinChiSinhVienModel();
    }

    return () => {
      setDanhSach([]);
      setDanhSachLopTinChi([]);
      setDanhSachMonHoc([]);
      setDanhSachKyHoc([]);
      setDanhSachNamHoc([]);
    };
  }, []);

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

  const columns: IColumn<DichVuMotCuaV2.Don>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
    },
    {
      title: 'Loại đơn',
      dataIndex: ['thongTinDichVu', 'ten'],
      align: 'left',
    },
    {
      title: 'Ghi chú kết quả',
      dataIndex: 'ketQuaText',
      align: 'center',
      width: 200,
    },
    {
      title: 'File kết quả đính kèm',
      dataIndex: 'ketQuaDinhKem',
      align: 'center',
      width: 200,
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
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      align: 'center',
      width: 150,
      search: 'filterString',
      notRegex: true,
      render: (val) => <div>{TrangThaiDonDVMC?.[val] ?? 'Chưa cập nhật'}</div>,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      align: 'center',
      width: 150,
      render: (val) => <div>{moment(val).format('HH:mm DD/MM/YYYY')}</div>,
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 90,
      fixed: 'right',
      render: (record: DichVuMotCuaV2.Don) => {
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
                      handleInDon(record.maDon);
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
                      setRecordView(record);
                      setVisibleForm(true);
                      setType('view');
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
        widthDrawer="60%"
        title="Lịch sử gửi đơn"
        modelName="dichvumotcuav2"
        columns={columns}
        loading={loading}
        dependencies={[page, limit, condition]}
        getData={getDonSinhVienModel}
      />

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
        visible={visibleForm}
        bodyStyle={{ padding: 18 }}
        onCancel={() => {
          setVisibleForm(false);
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
    </>
  );
};

export default LichSuGuiDon;
