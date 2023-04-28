import type { LichTuan } from '@/services/LichTuan/typings';
import { useCheckAccess } from '@/utils/utils';
import { CheckOutlined, DeleteOutlined, EditOutlined, StopOutlined } from '@ant-design/icons';
import { Button, Collapse, Modal, Popconfirm, Tag, Typography } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';
import { colorLichTuanSolid, ETrangThaiLichTuan } from './constants';
import { ColorTrangThaiDonMotCua } from '@/utils/constants';

const ModalDetailLichTuan = (props: {
  loaiLichTuan: 'chinhthuc' | 'nhap';
  showModalLichTuan: boolean;
  setShowModalLichTuan: any;
  setVisibleModal: any;
}) => {
  const { initialState } = useModel('@@initialState');
  const { getModel, getBanChinhThucModel, setEdit, delModel, updModel, setRecord, record } =
    useModel('lichtuan');
  const { showModalLichTuan, setShowModalLichTuan, setVisibleModal } = props;
  const isAccept = useCheckAccess('lich-tuan:create'); //quyền quản lý lịch tuần

  const chinhSuaLichTuan = () => {
    setEdit(true);
    setVisibleModal(true);
  };

  const xoaLichTuan = () => {
    delModel(record?._id);
    setShowModalLichTuan(false);
    getBanChinhThucModel();
    getModel();
    setRecord({} as LichTuan.Record);
  };

  const handleDuyet = (trangThai: ETrangThaiLichTuan) => {
    updModel(record?._id ?? '', {
      trangThai,
      _id: record?._id,
    } as LichTuan.Record);
    setShowModalLichTuan(false);
    setRecord({} as LichTuan.Record);
  };

  return (
    <Modal
      zIndex={99}
      title="Lịch tuần Học viện"
      onCancel={() => {
        setShowModalLichTuan(false);
        setRecord({} as LichTuan.Record);
      }}
      width={600}
      visible={showModalLichTuan}
      destroyOnClose
      footer={
        props.loaiLichTuan === 'chinhthuc' ? null : (
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            {isAccept && record?.chuaPhatHanh ? (
              <>
                {record?.trangThai &&
                [ETrangThaiLichTuan.CHO_DUYET, ETrangThaiLichTuan.KHONG_DUYET].includes(
                  record.trangThai,
                ) ? (
                  <Button
                    onClick={() => handleDuyet(ETrangThaiLichTuan.DA_DUYET)}
                    style={{
                      backgroundColor: colorLichTuanSolid?.[ETrangThaiLichTuan.DA_DUYET],
                      border: `1px solid ${colorLichTuanSolid?.[ETrangThaiLichTuan.DA_DUYET]}`,
                      color: '#fff',
                    }}
                    icon={<CheckOutlined />}
                  >
                    Duyệt
                  </Button>
                ) : null}
                {record?.trangThai &&
                  [ETrangThaiLichTuan.DA_DUYET, ETrangThaiLichTuan.CHO_DUYET].includes(
                    record?.trangThai ?? '',
                  ) && (
                    <Button
                      onClick={() => handleDuyet(ETrangThaiLichTuan.KHONG_DUYET)}
                      style={{
                        backgroundColor: colorLichTuanSolid?.[ETrangThaiLichTuan.KHONG_DUYET],
                        border: `1px solid ${colorLichTuanSolid?.[ETrangThaiLichTuan.KHONG_DUYET]}`,
                        color: '#fff',
                      }}
                      icon={<StopOutlined />}
                    >
                      Không duyệt
                    </Button>
                  )}
              </>
            ) : null}

            {(initialState?.currentUser?.user_id?.[0] == record?.info?.nguoiTao?.userId &&
              [ETrangThaiLichTuan.CHO_DUYET].includes(record?.trangThai ?? '')) ||
            isAccept ? (
              <>
                <Button icon={<EditOutlined />} onClick={() => chinhSuaLichTuan()}>
                  Sửa
                </Button>
                <Popconfirm title="Bạn có chắc chắn muốn xóa?" onConfirm={() => xoaLichTuan()}>
                  <Button icon={<DeleteOutlined />} danger>
                    Xóa
                  </Button>
                </Popconfirm>
              </>
            ) : null}
          </div>
        )
      }
    >
      <div>
        {record?.chiTietThayDoi?.length && props.loaiLichTuan !== 'chinhthuc' ? (
          <Typography.Paragraph>
            <Collapse>
              {record?.chiTietThayDoi?.map((item, index: number) => (
                <>
                  {item?.array?.length ? (
                    <Collapse.Panel
                      header={`Người thay đổi: ${item?.nguoiSua?.name ?? ''} (${
                        item?.nguoiSua?.maDinhDanh ?? 'Chưa xác định'
                      }) - ${
                        item?.nguoiSua?.thoiGian
                          ? moment(item?.nguoiSua?.thoiGian).format('HH:mm DD/MM/YYYY')
                          : null
                      }`}
                      key={index}
                    >
                      Lịch tuần này đã được <b>{item?.nguoiSua?.name ?? ''}</b> chỉnh sửa những
                      thông tin sau:
                      <ul>
                        {item?.array?.map((element: any) => (
                          <li key={element.value}>{element.value ?? ''}</li>
                        ))}
                      </ul>
                    </Collapse.Panel>
                  ) : null}
                </>
              ))}
            </Collapse>
          </Typography.Paragraph>
        ) : null}
        <Typography.Paragraph>
          <b>Thời gian:</b> {moment(record?.thoiGianBatDau).format('HH:mm DD/MM/YYYY')}
          {record?.thoiGianKetThuc
            ? ` - ${moment(record?.thoiGianKetThuc).format('HH:mm DD/MM/YYYY')}`
            : ''}
        </Typography.Paragraph>

        <Typography.Paragraph>
          <b>Nội dung công việc:</b> {record?.noiDungCongViec ?? ''}
        </Typography.Paragraph>
        <Typography.Paragraph>
          <b>{record?.chuTri?.[0]?.id === -1 ? 'Chủ trì cuộc họp' : 'Lãnh đạo Học viện'}:</b>
          <ul>
            {record?.chuTri?.map((item) => {
              return (
                <li key={item?.id ?? ''}>
                  {item?.ten} {item?.chucDanh ? ` - ${item?.chucDanh}` : ''}
                </li>
              );
            })}
          </ul>
        </Typography.Paragraph>
        <div>
          <b>Thành phần tham dự</b>

          {record?.thanhPhanThamDu?.length ? (
            <Typography.Paragraph>
              Phòng ban:
              <ul>
                {record?.thanhPhanThamDu?.map((item: string) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Typography.Paragraph>
          ) : null}
          {record?.thanhPhanNguoiThamDu?.length ? (
            <Typography.Paragraph>
              Cá nhân:
              <ul>
                {record?.thanhPhanNguoiThamDu?.map((item: LichTuan.User) => (
                  <li key={item?.id ?? ''}>
                    {`${item.ten} (${item.maDinhDanh} - ${item?.tenDonVi})`}
                  </li>
                ))}
              </ul>
            </Typography.Paragraph>
          ) : null}
          <Typography.Paragraph>
            Khác: {record?.thanhPhanThamDuKhac || 'Không có'}
          </Typography.Paragraph>
        </div>
        <Typography.Paragraph>
          <b>Địa điểm:</b> {record?.diaDiem?.value || 'Không có'}
        </Typography.Paragraph>
        <Typography.Paragraph>
          <b>Đơn vị chủ trì:</b> {record?.donViChuanBi?.value || 'Không có'}
        </Typography.Paragraph>
        <>
          {record?.donViPhoiHop?.length || record?.donViPhoiHopKhac !== '' ? (
            <>
              <b>Đơn vị phối hợp</b>
              {record?.donViPhoiHop?.length ? (
                <Typography.Paragraph>
                  Trong học viện:
                  <ul>
                    {record?.donViPhoiHop?.map((item: string) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </Typography.Paragraph>
              ) : null}
              <Typography.Paragraph>
                Khác: {record?.donViPhoiHopKhac || 'Không có'}
              </Typography.Paragraph>
            </>
          ) : null}
        </>
        <Typography.Paragraph>
          <b>Ghi chú:</b> {record?.ghiChu || 'Không có'}
        </Typography.Paragraph>
        <Typography.Paragraph>
          <b>Trạng thái phát hành:</b>{' '}
          {record?.chuaPhatHanh ? (
            <Tag color={ColorTrangThaiDonMotCua.PENDING}>Chưa phát hành</Tag>
          ) : (
            <Tag color={ColorTrangThaiDonMotCua.OK}>Đã phát hành</Tag>
          )}
        </Typography.Paragraph>
        <Typography.Paragraph>
          <b>Người tạo:</b>{' '}
          {[
            record?.info?.nguoiTao?.fullname,
            record?.info?.nguoiTao?.code,
            record?.info?.nguoiTao?.donVi?.ten,
          ]
            ?.filter((item) => item !== undefined && item !== '')
            ?.join(' - ')}
        </Typography.Paragraph>
      </div>
    </Modal>
  );
};

export default ModalDetailLichTuan;
