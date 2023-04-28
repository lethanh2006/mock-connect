import { messages } from '@/pages/Calendar/constants';
import { Spin } from 'antd';
import moment from 'moment';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useModel } from 'umi';
import { colorLichSinhNhat } from '../constants';
const tmp: any = Calendar;
const DnDCalendar = withDragAndDrop(tmp);

const CalendarView = () => {
  const { year, danhSach, setRecord, setVisibleModal, loading, setMonth, setYear } =
    useModel('lichsinhnhat');
  const localizer = momentLocalizer(moment);

  const dataLichSinhNhat: any[] = danhSach?.map((event) => {
    return {
      ...event,
      start: moment(event?.ngaySinh).set('year', year).toDate(),
      end: moment(event?.ngaySinh).set('year', year).toDate(),
      loai: 'lichsinhnhat',
      title: `${event?.hoTen ?? ''} - ${event?.donVi ?? ''}`,
      desc: event?.hoTen ?? '',
      allDay: true,
    };
  });

  const eventPropGetter = (event: any) => {
    return {
      style: {
        backgroundColor: colorLichSinhNhat[0],
      },
    };
  };

  return (
    <Spin spinning={loading}>
      <DnDCalendar
        onNavigate={(newDate) => {
          setMonth(moment(newDate).month() + 1);
          setYear(moment(newDate).year());
        }}
        localizer={localizer}
        selectable
        events={dataLichSinhNhat}
        defaultView={Views.MONTH}
        scrollToTime={new Date(1970, 1, 1, 6)}
        defaultDate={new Date()}
        onSelectEvent={(event: any) => {
          setRecord(event);
          setVisibleModal(true);
        }}
        messages={messages}
        views={['month']}
        style={{ height: 594 }}
        min={moment('0000', 'HHmm').toDate()}
        max={moment('2359', 'HHmm').toDate()}
        popup
        eventPropGetter={eventPropGetter}
      />
    </Spin>
  );
};

export default CalendarView;
