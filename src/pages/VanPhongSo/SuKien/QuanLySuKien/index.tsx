import { messages } from '@/pages/Calendar/constants';
import type { SuKien } from '@/services/sukien/typings';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, Drawer, Modal, Popconfirm, Row } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useAccess, useModel } from 'umi';
import {
  colorLichTuan,
  colorLichTuanSolid,
  ETrangThaiLichTuan,
} from '../../QuanLyLichTuan/constants';
import FormSuKien from './components/Form';
import ModalDetailSuKien from './components/ModalDetailSuKien';

const kieuXoa = {
  xoaSingle: 'xoaSingle',
  xoaAll: 'xoaAll',
  xoaFuture: 'xoaFuture',
};

const tmp: any = Calendar;
const DnDCalendar = withDragAndDrop(tmp);

const index = () => {
  const {
    getSuKienPageableModel,
    deleteSuKienModel,
    setEdit,
    record,
    setRecord,
    setVisibleForm,
    danhSach,
    visibleForm,
    putSuKienAdminModel,
    visible,
    setVisible,
  } = useModel('sukien');
  const {
    getLopHanhChinhAdminModel,
    condition: condLopHanhChinh,
    getAllHinhThucDaoTaoModel,
  } = useModel('lophanhchinh');
  const { getAllNganhModel } = useModel('nganh');
  const { adminGetLopTinChi, condition: condLopTinChi } = useModel('loptinchi');
  const { getKhoaHocModel } = useModel('khoahoc');
  const { getAllDonViModel } = useModel('donvi');
  const { conditionNguoiDungCuThe, getUserMetaDataFilterModel, setConditionNguoiDungCuThe } =
    useModel('user');

  const localizer = momentLocalizer(moment);
  const access = useAccess();

  const isQuanLyVps = access.adminAccessFilter({ maChucNang: 'quan-ly-su-kien' });
  // const [view, setView] = useState<string>('week');

  useEffect(() => {
    getSuKienPageableModel();
  }, []);

  useEffect(() => {
    if (access.admin || isQuanLyVps) {
      getUserMetaDataFilterModel(1, 100);
    }
  }, [conditionNguoiDungCuThe]);

  useEffect(() => {
    adminGetLopTinChi(100);
  }, [condLopTinChi]);

  useEffect(() => {
    if (access.admin || isQuanLyVps) {
      getLopHanhChinhAdminModel({ page: 1, limit: 100 });
    }
  }, [condLopHanhChinh]);

  useEffect(() => {
    getAllHinhThucDaoTaoModel();
    getAllDonViModel();
    getAllNganhModel();
    getKhoaHocModel({ pageParam: 1, limitParam: 1000 });
    return () => {
      setConditionNguoiDungCuThe({});
    };
  }, []);

  const themMoiSuKien = (event?: any) => {
    // const weekStartNumber = moment(event?.start, 'DD-MM-YYYY').week();
    // const weekCurrentNumber = moment().week();

    setRecord({
      thoiGianBatDau: event?.start?.toISOString(),
      thoiGianKetThuc: event?.end?.toISOString(),
    } as SuKien.Record);
    setVisibleForm(true);
    setEdit(false);
  };

  const handleSelect = (event: any) => {
    themMoiSuKien(event);
  };

  const dataSuKien = danhSach?.map((event: any) => {
    return {
      ...event,
      start: moment(event?.thoiGianBatDau).toDate(),
      end: moment(event?.thoiGianKetThuc).toDate(),
      title: event?.tenSuKien,
      desc: event?.diaDiem,
    };
  });

  const eventPropGetter = () => {
    return {
      style: {
        backgroundColor: colorLichTuan[ETrangThaiLichTuan.DA_DUYET],
        border: `1px solid ${colorLichTuanSolid[ETrangThaiLichTuan.DA_DUYET]}`,
      },
    };
  };

  const moveEvent = (event: any) => {
    const ngayBatDau = event.start.toISOString();
    const ngayKetThuc = event.end.toISOString();
    const kieuUpdate = 'updateSingle';
    delete event?.event?.end;
    delete event?.event?.start;
    putSuKienAdminModel(
      event?.event?._id,
      {
        ...event?.event,
        thoiGianBatDau: ngayBatDau,
        thoiGianKetThuc: ngayKetThuc,
      },
      kieuUpdate,
    );
  };

  return (
    <Card style={{ height: '100%' }} bordered={true} title="Quản lý sự kiện">
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setRecord({} as SuKien.Record);
              setVisibleForm(true);
            }}
          >
            Thêm mới
          </Button>
        </Col>
        <Col span={24}>
          <DnDCalendar
            localizer={localizer}
            selectable
            events={dataSuKien}
            defaultView={Views.WEEK}
            scrollToTime={new Date(1970, 1, 1, 6)}
            defaultDate={new Date()}
            onEventDrop={moveEvent}
            onEventResize={moveEvent}
            onSelectEvent={(event: any) => {
              setVisible(true);
              setRecord(event);
            }}
            onSelectSlot={handleSelect}
            messages={messages}
            views={['month', 'week']}
            style={{ height: 600 }}
            min={moment('0000', 'HHmm').toDate()}
            max={moment('2359', 'HHmm').toDate()}
            popup
            eventPropGetter={eventPropGetter}
            showMultiDayTimes
          />
        </Col>
      </Row>

      <Drawer
        visible={visibleForm}
        width={700}
        // onOk={() => {
        //   setVisibleForm(false);
        //   setConditionNguoiDungCuThe({});
        //   setEdit(false);
        // }}
        onClose={() => {
          setVisibleForm(false);
          setConditionNguoiDungCuThe({});
          setEdit(false);
        }}
        destroyOnClose
        bodyStyle={{ padding: 0 }}
        footer={false}
      >
        <FormSuKien />
      </Drawer>
      <Modal
        zIndex={99}
        title="Chi tiết sự kiện"
        visible={visible}
        width={700}
        onOk={() => setVisible(false)}
        onCancel={() => {
          setVisible(false);
          setRecord({} as SuKien.Record);
        }}
        destroyOnClose
        footer={[
          <>
            <Button
              type="primary"
              onClick={() => {
                setEdit(true);
                setVisibleForm(true);
                setVisible(false);
              }}
            >
              Chỉnh sửa
            </Button>
            {record && record?.lapLai ? (
              <Popconfirm
                title={[
                  <Popconfirm
                    title="Bạn có chắc muốn xóa sự kiện này không?"
                    onConfirm={() => deleteSuKienModel(record?._id, kieuXoa.xoaSingle)}
                    key="1"
                  >
                    <Button danger>Xóa sự kiện hiện tại</Button>&nbsp;
                  </Popconfirm>,
                  <Popconfirm
                    title="Bạn có chắc muốn xóa sự kiện này không?"
                    onConfirm={() => deleteSuKienModel(record?._id, kieuXoa.xoaAll)}
                    key="2"
                  >
                    <Button type="primary">Xóa tất cả</Button>&nbsp;
                  </Popconfirm>,
                  <Popconfirm
                    title="Bạn có chắc muốn xóa sự kiện này không?"
                    onConfirm={() => deleteSuKienModel(record?._id, kieuXoa.xoaFuture)}
                    key="3"
                  >
                    <Button danger>Xóa sự kiện này trong tương lai</Button>
                  </Popconfirm>,
                ]}
                icon={false}
                okButtonProps={{ hidden: true }}
              >
                <Button danger>Xóa sự kiện</Button>
              </Popconfirm>
            ) : (
              <Popconfirm
                title="Bạn có chắc muốn xóa sự kiện này không?"
                onConfirm={() => {
                  deleteSuKienModel(record?._id ?? '');
                }}
                style={{ marginLeft: '10px' }}
              >
                <Button danger>Xóa sự kiện </Button>
              </Popconfirm>
            )}
            <Button
              type="default"
              onClick={() => {
                setVisible(false);
                setRecord({} as SuKien.Record);
              }}
            >
              Đóng
            </Button>
          </>,
        ]}
      >
        <ModalDetailSuKien />
      </Modal>
    </Card>
  );
};

export default index;
