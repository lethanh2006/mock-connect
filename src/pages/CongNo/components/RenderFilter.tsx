import React from 'react';
import { DatePicker, Select, Tabs, Tag, Tooltip } from 'antd';
import { useModel } from 'umi';

const RenderFilter = (props: { dinhKy: string; danhSachHocKy }) => {
  const { dinhKy, danhSachHocKy } = props;
  const { condition, setCondition } = useModel('thanhtoan');

  const onChangeDatePicker = (val: any) => {
    let stringDatePicker;
    if (val) {
      switch (dinhKy ?? '') {
        case 'Hàng tháng': {
          stringDatePicker = val?.format('MM/YYYY');
          break;
        }
        case '6 tháng': {
          stringDatePicker = val?.format('MM/YYYY');
          break;
        }
        case 'Hàng năm': {
          stringDatePicker = val?.format('YYYY');
          break;
        }
        case 'Hàng quý': {
          stringDatePicker = `Q${val?.quarter()}/${val?.format('YYYY')}`;
          break;
        }
      }
    }
    setCondition({ ...condition, 'metadata.mocThoiGian': stringDatePicker });
  };

  const renderFilter = () => {
    switch (dinhKy || '') {
      // case 'Theo đợt': {
      //   return <Input style={{ width: 200 }} placeholder="Lọc theo đợt" />;
      // }
      case 'Hàng tháng': {
        return (
          <DatePicker
            onChange={onChangeDatePicker}
            allowClear
            style={{ width: 150 }}
            picker="month"
            format="MM/YYYY"
          />
        );
      }
      case 'Hàng quý': {
        return (
          <DatePicker
            onChange={onChangeDatePicker}
            allowClear
            style={{ width: 150 }}
            picker="quarter"
          />
        );
      }
      case '6 tháng': {
        return (
          <DatePicker
            onChange={onChangeDatePicker}
            allowClear
            style={{ width: 150 }}
            picker="month"
            format="MM/YYYY"
          />
        );
      }
      case 'Hàng năm': {
        return (
          <DatePicker
            onChange={onChangeDatePicker}
            allowClear
            style={{ width: 150 }}
            picker="year"
            format="YYYY"
          />
        );
      }
      case 'Theo kỳ học': {
        return (
          <Select
            onChange={(val) => setCondition({ ...condition, 'metadata.mocThoiGian': val })}
            allowClear
            style={{ width: 150 }}
            showSearch
            placeholder="Chọn kỳ học"
          >
            {danhSachHocKy
              ?.filter((item) =>
                condition?.metadata?.hinhThucDaoTaoId
                  ? item.hinh_thuc_dao_tao_id?.[0] === condition?.metadata?.hinhThucDaoTaoId
                  : item,
              )
              ?.map((item) => (
                <Select.Option
                  key={item.id}
                  value={`Kỳ ${item.ten_ky_nam_hoc} năm học ${item.nam_hoc_id[1]}`}
                >
                  <Tooltip
                    placement="leftTop"
                    title={`Kỳ ${item.ten_ky_nam_hoc} năm học ${item.nam_hoc_id[1]}`}
                  >
                    Kỳ {item.ten_ky_nam_hoc} năm học {item.nam_hoc_id[1]}{' '}
                  </Tooltip>
                </Select.Option>
              ))}
          </Select>
        );
      }
      case 'Theo năm học': {
        return (
          <Select
            onChange={(val) => setCondition({ ...condition, 'metadata.mocThoiGian': val })}
            allowClear
            style={{ width: 150 }}
            showSearch
            placeholder="Lọc theo năm học"
          >
            {danhSachNamHoc?.map((item) => (
              <Select.Option key={item.id} value={item?.ten_nam_hoc}>
                Năm học {item?.ten_nam_hoc}
              </Select.Option>
            ))}
          </Select>
        );
      }
      default:
        return <></>;
    }
  };

  return <div>{renderFilter()}</div>;
};

export default RenderFilter;
