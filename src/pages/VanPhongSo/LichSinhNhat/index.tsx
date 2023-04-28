import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Card, Col, Empty, Row, Spin, Tabs } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import BirthDayView from './components/BirthDayView';
import CalendarView from './components/CalendarView';
import ModalLichSinhNhat from './components/ModalLichSinhNhat';

const LichSinhNhat = () => {
  const { listCurrentDay, month, setMonth, getModel, loading } = useModel('lichsinhnhat');
  const [viewType, setViewType] = useState<'MONTH' | 'DAY'>('MONTH');
  const [startDate, setStartDate] = useState<any>(moment().startOf('week'));
  const [dataTheoNgay, setDataTheoNgay] = useState<LichSinhNhat.Record[][]>([]);
  const [allData, setAllData] = useState<any>({});
  const startDay = startDate?.format('DD/MM');
  const endDay = startDate.clone()?.add(6, 'day')?.format('DD/MM');

  const getDanhSachTheoNgay = (data: any) => {
    const da: LichSinhNhat.Record[][] = [];
    for (let index = 0; index < 7; index++) {
      const date = startDate.clone().add(index, 'day');
      const m = date.month() + 1;
      const d = date.format('DD');
      const sinhNhatTrongNgay: LichSinhNhat.Record[] =
        data?.[m]?.filter((item: LichSinhNhat.Record) => item.ngaySinh.slice(-2) === d) ?? [];

      if (sinhNhatTrongNgay.length) da.push(sinhNhatTrongNgay);
    }
    setDataTheoNgay(da);
  };

  const getData = async () => {
    const m1 = startDate.month() + 1;
    const m2 = startDate.clone().add(6, 'day').month() + 1;
    let data = allData;
    if (!Object.keys(allData).includes(m1.toString()))
      await getModel(m1, true).then((res) => (data = { ...data, [m1]: res }));
    if (m1 !== m2 && !Object.keys(allData).includes(m2.toString()))
      await getModel(m2, true).then((res) => (data = { ...data, [m2]: res }));
    setAllData(data);
    getDanhSachTheoNgay(data);
  };

  useEffect(() => {
    return () => setMonth(moment().month() + 1);
  }, []);

  useEffect(() => {
    getModel(month);
  }, [month]);

  useEffect(() => {
    // Get lịch tuần khi xem theo tuần
    getData();
  }, [startDay]);

  return (
    <>
      <Row gutter={[12, 12]}>
        <Col span={24}>
          <Card title="Lịch sinh nhật hôm nay" bodyStyle={{ maxHeight: '400px', overflow: 'auto' }}>
            <Spin spinning={loading}>
              {listCurrentDay && listCurrentDay?.length ? (
                <BirthDayView dataTheoNgay={listCurrentDay} />
              ) : (
                <Empty description="Không có lịch sinh nhật trong ngày hôm nay!" />
              )}
            </Spin>
          </Card>
        </Col>

        <Col span={24}>
          <Card title="Lịch sinh nhật sắp tới" bodyStyle={{ paddingTop: 0 }}>
            <Tabs
              onChange={(key: any) => {
                if (key === 'MONTH') setMonth(moment().month() + 1);
                setViewType(key);
              }}
              activeKey={viewType}
              defaultActiveKey="MONTH"
            >
              <Tabs.TabPane tab="Theo tháng" key="MONTH" />
              <Tabs.TabPane tab="Theo tuần" key="WEEK" />
            </Tabs>
            {viewType === 'MONTH' ? (
              <CalendarView />
            ) : (
              <>
                <div
                  style={{
                    marginBottom: 16,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 24,
                    textAlign: 'center',
                  }}
                >
                  <Button onClick={() => setStartDate(startDate.clone().subtract(7, 'day'))}>
                    <LeftOutlined /> Tuần trước
                  </Button>
                  <span>
                    Tuần: {startDay} - {endDay}
                  </span>
                  <Button onClick={() => setStartDate(startDate.clone().add(7, 'day'))}>
                    Tuần sau <RightOutlined />
                  </Button>
                </div>
                <Spin spinning={loading}>
                  {dataTheoNgay && dataTheoNgay?.length > 0 ? (
                    <>
                      {dataTheoNgay?.map((item: LichSinhNhat.Record[]) => (
                        <BirthDayView dataTheoNgay={item} key={item[0].maDinhDanh} />
                      ))}
                    </>
                  ) : (
                    <Empty description="Không có lịch sinh nhật trong thời gian này!" />
                  )}
                </Spin>
              </>
            )}

            {/* <div style={{ marginTop: '15px' }}>
              Ghi chú:
              <Badge
                style={{ marginRight: '8px', marginLeft: '25px' }}
                color={colorLichSinhNhat[0]}
              />
              Lãnh đạo Học viện
              <Badge
                style={{ marginRight: '8px', marginLeft: '25px' }}
                color={colorLichSinhNhat[1]}
              />
              Lãnh đạo Phòng, khoa, trung tâm, viện,...
              <Badge
                style={{ marginRight: '8px', marginLeft: '25px' }}
                color={colorLichSinhNhat[2]}
              />
              Giảng viên, cán bộ khác
            </div> */}
          </Card>
        </Col>
      </Row>

      <ModalLichSinhNhat />
    </>
  );
};

export default LichSinhNhat;
