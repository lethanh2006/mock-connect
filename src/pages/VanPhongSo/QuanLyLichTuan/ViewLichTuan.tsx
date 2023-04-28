import { messages } from '@/pages/Calendar/constants';
import type { LichTuan } from '@/services/LichTuan/typings';
import rules from '@/utils/rules';
import { useCheckAccess } from '@/utils/utils';
import { ExportOutlined, ImportOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Drawer, Dropdown, Form, Menu, message, Modal, Row } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useModel } from 'umi';
import UploadOne from '../QuanLyOto/components/UploadFileOne';
import { colorLichTuan, ETrangThaiLichTuan } from './constants';
import FormLichTuan from './FormLichTuan';
import ModalDetailLichTuan from './ModalDetailLichTuan';
import ModalPhatHanhLichTuan from './ModalPhatHanhLichTuan';

const tmp: any = Calendar;
const DnDCalendar = withDragAndDrop(tmp);

const ViewLichTuan = (props: any) => {
  const {
    getModel,
    getBanChinhThucModel,
    danhSach,
    danhSachChinhThuc,
    setEdit,
    updModel,
    setRecord,
    record,
    loading,
    exportLichTuanModel,
    previewPhatHanhLichTuanModel,
    setVisiblePreview,
    importLichTuanModel,
  } = useModel('lichtuan');
  const { getAllPhongKhaDungModel } = useModel('quantriphonghop');

  const localizer = momentLocalizer(moment);
  const [visibleModal, setVisibleModal] = useState(false);
  const [showModalLichTuan, setShowModalLichTuan] = useState(false);
  const [view, setView] = useState<string>('week');
  const [week, setWeek] = useState<number>(moment(new Date()).week());
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [visible, setVisible] = useState<boolean>(false);
  const isCreate = useCheckAccess('lich-tuan:dang-ky'); // quyền đăng ký lịch tuần
  const isAccept = useCheckAccess('lich-tuan:create'); //quyền quản lý lịch tuần
  const [form] = Form.useForm();

  useEffect(() => {
    if (props.loaiLichTuan === 'nhap') {
      getModel();
      getAllPhongKhaDungModel({
        thoiGianBd: moment(record?.thoiGianBatDau).toISOString(),
        thoiGianKt: moment(record?.thoiGianBatDau).toISOString(),
      });
    } else if (props.loaiLichTuan === 'chinhthuc') {
      getBanChinhThucModel();
    }
  }, []);

  const onCancelModel = () => {
    setVisibleModal(false);
  };

  let lichTuanFinal: any[] = [];
  if (props.loaiLichTuan === 'nhap') {
    lichTuanFinal = danhSach.filter((item: LichTuan.Record) => !item?.daXoa);
  } else if (props.loaiLichTuan === 'chinhthuc') {
    lichTuanFinal = danhSachChinhThuc?.map((item: LichTuan.Record) => ({
      ...item,
      chuaPhatHanh: false,
    }));
  }
  const dataLichTuan = lichTuanFinal?.map((event) => {
    return {
      ...event,
      start: moment(event?.thoiGianBatDau).toDate(),
      end: moment(event?.thoiGianKetThuc).toDate(),
      loai: 'lichtuan',
      // title: (
      //   <div>
      //     {event?.chuaPhatHanh === false && <CheckCircleOutlined style={{ marginRight: 4 }} />}
      //     {`Lịch tuần: ${event?.noiDungCongViec ?? ''}`}
      //   </div>
      // ),
      title: `${event?.noiDungCongViec} - ${event?.chuTri
        ?.map((item: any) => item.ten)
        .join(', ')}`,
      desc: event?.diaDiem,
    };
  });

  // fill lịch tuần bằng với tuần hiện tại, giống nhau thì push vào mảng mới để check
  const recordLichTuan: LichTuan.Record[] = [];
  if (danhSach) {
    danhSach?.map((item: LichTuan.Record) => {
      if (item.tuan == week && item.trangThai == ETrangThaiLichTuan.DA_DUYET) {
        recordLichTuan.push(item);
      }
    });
  }

  const eventPropGetter = (event: any) => {
    return {
      style: {
        backgroundColor: !event.chuaPhatHanh
          ? colorLichTuan[ETrangThaiLichTuan.DA_PHAT_HANH]
          : colorLichTuan?.[event?.trangThai],
        border: `1px solid ${colorLichTuan?.[event?.trangThai]}`,
      },
    };
  };

  const themMoiSuKien = (event?: any) => {
    const weekCurrentNumber = moment().week();
    if (weekCurrentNumber > week) {
      message.info('Không được tạo lịch trong tuần đã qua!');
    } else {
      setRecord({
        thoiGianBatDau: event?.start?.toISOString(),
        thoiGianKetThuc: event?.end?.toISOString(),
      } as LichTuan.Record);
      setVisibleModal(true);
      setEdit(false);
    }
  };

  const handleSelect = (event: any) => {
    if (props.loaiLichTuan === 'chinhthuc') return;
    themMoiSuKien(event);
  };

  const moveEvent = (event: any) => {
    if (event?.event?.trangThai !== ETrangThaiLichTuan.CHO_DUYET && !isAccept) return;
    const ngayBatDau = event.start.toISOString();
    const ngayKetThuc = event.end.toISOString();
    if (props.loaiLichTuan === 'chinhthuc') return;
    updModel(event?.event?._id, {
      _id: event.event?._id,
      noiDungCongViec: event.event?.noiDungCongViec,
      thoiGianBatDau: ngayBatDau,
      thoiGianKetThuc: ngayKetThuc,
      diaDiem: event.event?.diaDiem,
      chuTri: event.event?.chuTri,
      thanhPhanThamDu: event.event?.thanhPhanThamDu,
      donViChuanBi: event.event?.donViChuanBi,
      donViPhoiHop: event.event?.donViPhoiHop,
      ghiChu: event.event?.ghiChu,
    } as LichTuan.Record);
  };

  const onFinishHandle = async (values: any) => {
    values.file = values?.file?.fileList?.[0]?.originFileObj;
    importLichTuanModel(week, year, values).then(() => {
      setVisible(false);
    });
    form.resetFields();
  };

  return (
    <div>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          {props.loaiLichTuan === 'chinhthuc' && isAccept && (
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item
                    key="1"
                    onClick={() => exportLichTuanModel(props.loaiLichTuan, week, year, 'Word')}
                  >
                    Xuất file Word
                  </Menu.Item>
                  <Menu.Item
                    key="2"
                    onClick={() => exportLichTuanModel(props.loaiLichTuan, week, year, 'Excel')}
                  >
                    Xuất file Excel
                  </Menu.Item>
                </Menu>
              }
              placement="bottomLeft"
              disabled={view === 'month'}
            >
              <Button icon={<ExportOutlined />} type="primary" disabled={view === 'month'}>
                Xuất lịch tuần
              </Button>
            </Dropdown>
          )}
          {props?.loaiLichTuan === 'nhap' && (
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {isCreate && (
                <Button
                  type="primary"
                  onClick={() => {
                    setRecord({} as LichTuan.Record);
                    setEdit(false);
                    setVisibleModal(true);
                  }}
                  icon={<PlusOutlined />}
                >
                  {isAccept ? 'Thêm mới cuộc họp' : 'Đăng ký lịch tuần'}
                </Button>
              )}
              {/* {isCreate && isAccept ? (
                <Dropdown
                  overlay={
                    <Menu>
                      <Menu.Item key="1" onClick={downLoadTemplateModel}>
                        Tải mẫu
                      </Menu.Item>
                      <Menu.Item key="2" onClick={() => setVisible(true)}>
                        Import lịch tuần
                      </Menu.Item>
                    </Menu>
                  }
                  placement="bottomLeft"
                >
                  <Button icon={<ImportOutlined />}>Import lịch</Button>
                </Dropdown>
              ) : null} */}
              {isAccept && (
                <>
                  <Dropdown
                    overlay={
                      <Menu>
                        <Menu.Item
                          key="1"
                          onClick={() =>
                            exportLichTuanModel(props.loaiLichTuan, week, year, 'Word')
                          }
                        >
                          Xuất file Word
                        </Menu.Item>
                        <Menu.Item
                          key="2"
                          onClick={() =>
                            exportLichTuanModel(props.loaiLichTuan, week, year, 'Excel')
                          }
                        >
                          Xuất file Excel
                        </Menu.Item>
                      </Menu>
                    }
                    placement="bottomLeft"
                    disabled={view === 'month'}
                  >
                    <Button icon={<ExportOutlined />} disabled={view === 'month'}>
                      Xuất lịch (bản nháp)
                    </Button>
                  </Dropdown>
                  <Button
                    icon={<ExportOutlined />}
                    disabled={
                      view === 'month' ||
                      recordLichTuan?.length === 0 ||
                      !recordLichTuan?.find((item) => item.chuaPhatHanh === true || item?.daXoa)
                    }
                    onClick={() => {
                      previewPhatHanhLichTuanModel(week, year);
                      setVisiblePreview(true);
                    }}
                  >
                    Phát hành lịch
                  </Button>
                </>
              )}
            </div>
          )}
        </Col>

        <Col span={24}>
          <DnDCalendar
            onView={(viewType) => {
              setView(viewType);
            }}
            onNavigate={(newDate) => {
              const weekCurrent: number = moment(newDate).week();
              const yearCurrent: number = moment(newDate).year();
              setWeek(weekCurrent);
              setYear(yearCurrent);
            }}
            localizer={localizer}
            selectable={props.loaiLichTuan === 'nhap'}
            resizable={props.loaiLichTuan === 'nhap'}
            events={dataLichTuan}
            defaultView={Views.WEEK}
            scrollToTime={new Date(1970, 1, 1, 6)}
            defaultDate={new Date()}
            onEventDrop={moveEvent}
            onEventResize={moveEvent}
            onSelectEvent={(event: any) => {
              setShowModalLichTuan(true);
              setRecord(event);
            }}
            onSelectSlot={handleSelect}
            messages={messages}
            views={['month', 'week']}
            style={{ height: 594 }}
            min={moment('0000', 'HHmm').toDate()}
            max={moment('2359', 'HHmm').toDate()}
            popup
            eventPropGetter={eventPropGetter}
            // dayLayoutAlgorithm="no-overlap"
          />
        </Col>
      </Row>

      <Drawer
        width={700}
        visible={visibleModal}
        destroyOnClose
        bodyStyle={{ padding: 0 }}
        onClose={() => {
          // setRecord({} as LichTuan.Record);
          setVisibleModal(false);
          setEdit(false);
        }}
        closeIcon
      >
        <FormLichTuan onCancel={onCancelModel} />
      </Drawer>

      <ModalDetailLichTuan
        loaiLichTuan={props.loaiLichTuan}
        showModalLichTuan={showModalLichTuan}
        setShowModalLichTuan={setShowModalLichTuan}
        setVisibleModal={setVisibleModal}
      />

      {/* Phát hành lịch tuần */}
      {props.loaiLichTuan === 'nhap' ? <ModalPhatHanhLichTuan week={week} year={year} /> : null}

      <Modal
        title="Import lịch tuần"
        visible={visible}
        onCancel={() => {
          setVisible(false);
          form.resetFields();
        }}
        onOk={() => form.validateFields().then(onFinishHandle)}
        okText="Nhập dữ liệu"
        okButtonProps={{ loading, icon: <ImportOutlined /> }}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="file"
            label="Nhập danh sách lịch tuần từ file Excel"
            rules={[...rules.fileRequired]}
          >
            <UploadOne />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ViewLichTuan;
