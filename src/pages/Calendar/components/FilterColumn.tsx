import { Row, Col, Checkbox, Select, Calendar as AntdCalendar } from 'antd';
import moment from 'moment';
import { useAccess, useModel } from 'umi';
import { Color, ELoaiSuKien } from '@/services/Calendar/constant';

const FilterColumn = (props: { date: any; setDate: any }) => {
  const { date, setDate } = props;
  const access = useAccess();
  const { setYear, selectValue, setSelectValue } = useModel('sukien');

  const pickDate = (val: moment.Moment) => {
    setDate(val.toDate());
    setYear(moment(val).year());
  };

  const changeLoaiSuKien = (checkedValue: any) => {
    setSelectValue(checkedValue as string[]);
  };

  return (
    <div>
      <AntdCalendar
        headerRender={({ value, onChange }) => {
          const start = 0;
          const end = 12;
          const monthOptions = [];

          const current = value.clone();
          const yearDate = value.clone();
          yearDate.add(20, 'days');
          const localeData = value.localeData();
          const months = [];
          for (let i = 0; i < 12; i++) {
            current.month(i);
            months.push(localeData.monthsShort(current));
          }

          for (let index = start; index < end; index++) {
            monthOptions.push(
              <Select.Option className="month-item" key={`${index}`} value={months[index]}>
                {months[index]}
              </Select.Option>,
            );
          }
          const month = value.month();

          const year1 = yearDate.year();
          const options = [];
          for (let i = 2020; i <= moment().year() + 1; i += 1) {
            options.push(
              <Select.Option key={i} value={i} className="year-item">
                {i}
              </Select.Option>,
            );
          }
          return (
            <div style={{ marginTop: 8, marginBottom: 8 }}>
              <Row gutter={8}>
                <Col span={12}>
                  <Select
                    style={{ width: '100%' }}
                    size="small"
                    dropdownMatchSelectWidth={false}
                    onChange={(newYear: any) => {
                      const now = value.clone().year(newYear);
                      onChange(now);
                    }}
                    value={String(year1)}
                  >
                    {options}
                  </Select>
                </Col>
                <Col span={12}>
                  <Select
                    style={{ width: '100%' }}
                    size="small"
                    dropdownMatchSelectWidth={false}
                    value={String(month)}
                    onChange={(selectedMonth) => {
                      const newValue = value.clone();
                      newValue.month(parseInt(selectedMonth, 10));
                      onChange(newValue);
                    }}
                  >
                    {monthOptions}
                  </Select>
                </Col>
              </Row>
            </div>
          );
        }}
        onChange={(val: any) => pickDate(val)}
        fullscreen={false}
        mode={'month'}
        value={moment(date)}
      />

      <Checkbox.Group value={selectValue} onChange={changeLoaiSuKien}>
        {access.sinhVienVaNhanVien ? (
          <>
            <Row>
              <Checkbox value={ELoaiSuKien.LICH_HOC}>
                <p
                  style={{
                    backgroundColor: Color[ELoaiSuKien.LICH_HOC],
                    color: 'white',
                    padding: '1px 6px',
                    borderRadius: 2,
                  }}
                >
                  {access.sinhVien ? ELoaiSuKien.LICH_HOC : ELoaiSuKien.LICH_GIANG_DAY}
                </p>
              </Checkbox>
            </Row>
            <Row>
              <Checkbox value={ELoaiSuKien.LICH_THI}>
                <p
                  style={{
                    backgroundColor: Color[ELoaiSuKien.LICH_THI],
                    color: 'white',
                    padding: '1px 6px',
                    borderRadius: 2,
                  }}
                >
                  {access.sinhVien ? ELoaiSuKien.LICH_THI : 'Lịch coi thi'}
                </p>
              </Checkbox>
            </Row>
          </>
        ) : null}
        <Row>
          <Checkbox value={ELoaiSuKien.CA_NHAN}>
            <p
              style={{
                backgroundColor: Color[ELoaiSuKien.CA_NHAN],
                color: 'white',
                padding: '1px 6px',
                borderRadius: 2,
              }}
            >
              Sự kiện cá nhân
            </p>
          </Checkbox>
        </Row>
        <Row>
          <Checkbox value={ELoaiSuKien.TAT_CA}>
            <p
              style={{
                backgroundColor: Color[ELoaiSuKien.TAT_CA],
                color: 'white',
                padding: '1px 6px',
                borderRadius: 2,
              }}
            >
              Sự kiện chung
            </p>
          </Checkbox>
        </Row>
      </Checkbox.Group>
    </div>
  );
};

export default FilterColumn;
