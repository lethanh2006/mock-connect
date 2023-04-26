import { Card, Modal, Row, Col, Button } from 'antd';
import moment from 'moment';
import mm from 'moment-timezone';
import { useEffect, useState } from 'react';
import type { DateRange } from 'react-big-calendar';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useAccess, useModel } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
import FormLichCaNhan from './components/FormLichCaNhan';
import ModalViewDetailCalendar from './components/ModalViewDetail';
import FilterColumn from './components/FilterColumn';
import { Color, messages } from '@/services/Calendar/constant';
mm.tz.setDefault('Asia/Ho_Chi_Minh');

export default (props: { type?: string }) => {
  const eventPropGetter = (event: { title: string; loaiSuKien?: string }) => ({
    style: { backgroundColor: Color?.[event?.loaiSuKien ?? ''] },
  });

  const isDashboard = props?.type === 'dashboard';
  const access = useAccess();

  const eventCustom = ({ event }: any) => {
    const { title, loaiSuKien, diaDiem } = event;
    return (
      <div style={{ width: '100%', fontSize: 13 }}>
        {access.nhanVien && loaiSuKien === 'Lịch học' ? 'Lịch dạy' : `${loaiSuKien || ''}`}:{' '}
        {`${title || 'Chưa cập nhật'}`} <br />
        {`Địa điểm: ${diaDiem || 'Chưa cập nhật'}`}
      </div>
    );
  };
  const localizer = momentLocalizer(moment);
  const {
    danhSach: danhSachSuKien,
    visibleForm,
    setVisibleForm,
    setYear,
    setRecord,
    setEdit,
  } = useModel('sukien');
  const [date, setDate] = useState(new Date());
  const [visibleDetail, setVisibleDetail] = useState<boolean>(false);
  const [visibleXemThem, setVisibleXemThem] = useState<boolean>(false);
  const [eventsRecord, setEventRecord] = useState<SuKien.IRecord[]>([]);
  const [dateXemThem, setDateXemThem] = useState<any>();

  // useEffect(() => {
  //   if (access.sinhVienVaNhanVien)
  //     setSelectValue([
  //       ELoaiSuKien.LICH_HOC,
  //       ELoaiSuKien.LICH_THI,
  //       ELoaiSuKien.CA_NHAN,
  //       ELoaiSuKien.TAT_CA,
  //     ]);
  //   else setSelectValue([ELoaiSuKien.CA_NHAN, ELoaiSuKien.TAT_CA]);
  // }, []);

  // useEffect(() => {
  //   getSuKienSinhVienByNamModel({
  //     year: Number(moment(date).format('YYYY')),
  //     selectValue,
  //   });
  // }, [selectValue, year]);

  const dataCalendar: { title: string; [x: string]: unknown }[] | undefined = [];
  danhSachSuKien?.forEach((x: SuKien.IRecord) =>
    dataCalendar.push({
      ...x,
      title: x?.tenSuKien ?? '',
      start: moment(x?.thoiGianBatDau).toDate(),
      end: moment(x?.thoiGianKetThuc).toDate(),
    }),
  );

  const handleSelect = (event?: any) => {
    if (isDashboard) return;
    setRecord({
      thoiGianBatDau: event?.start?.toISOString(),
      thoiGianKetThuc: event?.end?.toISOString(),
    } as SuKien.IRecord);
    setVisibleForm(true);
  };

  return (
    <Card title="Lịch" bordered>
      <Row gutter={[12, 12]}>
        <Col
          span={24}
          md={isDashboard ? 0 : 8}
          xl={isDashboard ? 0 : 6}
          style={isDashboard ? { display: 'none' } : { display: 'block' }}
        >
          <Button
            type="primary"
            block
            onClick={() => {
              setRecord({} as SuKien.IRecord);
              setVisibleForm(true);
            }}
          >
            <PlusOutlined /> Thêm sự kiện
          </Button>

          {/* Bộ lọc */}
          <FilterColumn date={date} setDate={setDate} />
          {/*  */}
        </Col>
        <Col span={24} md={isDashboard ? 24 : 16} xl={isDashboard ? 24 : 18}>
          <Calendar
            formats={{
              dayHeaderFormat: 'dddd DD/MM/YYYY',
              dayRangeHeaderFormat: (range: DateRange) => {
                return `${moment(range.start).format('DD/MM/YYYY')} - ${moment(range.end).format(
                  'DD/MM/YYYY',
                )}`;
              },
            }}
            localizer={localizer}
            events={dataCalendar}
            defaultView={Views.WEEK}
            onNavigate={(newDate: Date) => {
              setDate(newDate);
              setYear(moment(newDate).year());
            }}
            selectable
            scrollToTime={new Date(1970, 1, 1, 6)}
            defaultDate={new Date()}
            date={date}
            messages={messages}
            views={['month', 'week', 'day']}
            style={{ height: isDashboard ? 592 : 700, overflow: 'auto' }}
            min={moment('0000', 'HHmm').toDate()}
            max={moment('2359', 'HHmm').toDate()}
            eventPropGetter={eventPropGetter}
            onSelectSlot={handleSelect}
            onSelectEvent={(rec: any) => {
              setRecord(rec);
              setVisibleDetail(true);
            }}
            components={{
              event: (event: any) => eventCustom(event),
            }}
            popup
            onShowMore={(events, d) => {
              setEventRecord(events);
              setDateXemThem(d);
              setVisibleXemThem(true);
            }}
          />
        </Col>
      </Row>

      <Modal
        visible={visibleForm}
        bodyStyle={{ padding: 0 }}
        width="500px"
        destroyOnClose
        onCancel={() => {
          setVisibleForm(false);
          setEdit(false);
        }}
        footer={null}
        maskClosable
      >
        <FormLichCaNhan />
      </Modal>

      {/* Modal xem chi tiết lịch */}
      {visibleDetail ? (
        <ModalViewDetailCalendar visible={visibleDetail} setVisible={setVisibleDetail} />
      ) : null}
      {/*  */}

      <Modal
        visible={visibleXemThem}
        title={moment(dateXemThem).format('dddd, DD/MM/YYYY')}
        width="500px"
        destroyOnClose
        onCancel={() => {
          setVisibleXemThem(false);
        }}
        footer={null}
        maskClosable
      >
        <div>
          {eventsRecord?.map((item: SuKien.IRecord) => {
            return (
              <div
                key={item._id}
                style={{
                  backgroundColor: Color?.[item?.loaiSuKien ?? ''],
                  color: 'white',
                  padding: '5px',
                  marginBottom: '10px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  setRecord(item);
                  setVisibleXemThem(false);
                  setVisibleDetail(true);
                }}
              >
                {item?.loaiSuKien} - {item?.tenSuKien}
              </div>
            );
          })}
        </div>
      </Modal>
    </Card>
  );
};
