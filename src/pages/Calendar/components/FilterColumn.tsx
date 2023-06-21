import { ColorSuKien, ELoaiSuKien } from '@/services/SuKien/constant';
import { Calendar as AntdCalendar, Checkbox, Col, Row, Select } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { useModel } from 'umi';

const FilterColumn = (props: { date: Date; setDate: (val: Date) => void }) => {
  const { date, setDate } = props;
  const { selectSuKiens, setSelectSuKiens } = useModel('sukien');

  const pickDate = (val: moment.Moment) => setDate(val.toDate());

  const changeLoaiSuKien = (checkedValue: any) => {
    setSelectSuKiens(checkedValue as ELoaiSuKien[]);
  };

  return (
    <div>
      <AntdCalendar
        headerRender={({ value, onChange }) => (
          <div style={{ marginTop: 12, marginBottom: 8 }}>
            <Row gutter={8}>
              <Col span={12}>
                <Select
                  style={{ width: '100%' }}
                  size="small"
                  onChange={(newYear: any) => {
                    const now = value.clone().year(newYear);
                    onChange(now);
                  }}
                  value={value.year()}
                  options={_.range(2023, moment().year() + 1).map((y) => ({
                    key: y,
                    value: y,
                    label: y,
                  }))}
                />
              </Col>
              <Col span={12}>
                <Select
                  style={{ width: '100%' }}
                  size="small"
                  value={value.month()}
                  onChange={(selectedMonth) => {
                    const newValue = value.clone();
                    newValue.month(selectedMonth);
                    onChange(newValue);
                  }}
                  options={_.range(0, 12).map((m) => ({
                    key: m,
                    value: m,
                    label: `Tháng ${m + 1}`,
                  }))}
                />
              </Col>
            </Row>
          </div>
        )}
        onChange={(val: any) => pickDate(val)}
        fullscreen={false}
        mode={'month'}
        value={moment(date)}
      />

      <Checkbox.Group value={selectSuKiens} onChange={changeLoaiSuKien}>
        {/* {access.sinhVienVaNhanVien ? (
          <> */}
        <Row>
          <Checkbox value={ELoaiSuKien.LICH_HOC}>
            <p
              style={{
                backgroundColor: ColorSuKien[ELoaiSuKien.LICH_HOC],
                color: 'white',
                padding: '2px 6px',
                borderRadius: 2,
              }}
            >
              {ELoaiSuKien.LICH_HOC}
            </p>
          </Checkbox>
        </Row>
        <Row>
          <Checkbox value={ELoaiSuKien.LICH_THI}>
            <p
              style={{
                backgroundColor: ColorSuKien[ELoaiSuKien.LICH_THI],
                color: 'white',
                padding: '2px 6px',
                borderRadius: 2,
              }}
            >
              {ELoaiSuKien.LICH_THI}
            </p>
          </Checkbox>
        </Row>
        {/* </>
        ) : null} */}
        <Row>
          <Checkbox value={ELoaiSuKien.CA_NHAN}>
            <p
              style={{
                backgroundColor: ColorSuKien[ELoaiSuKien.CA_NHAN],
                color: 'white',
                padding: '2px 6px',
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
                backgroundColor: ColorSuKien[ELoaiSuKien.TAT_CA],
                color: 'white',
                padding: '2px 6px',
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
