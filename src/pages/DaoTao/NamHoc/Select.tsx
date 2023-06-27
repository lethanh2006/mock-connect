import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectNamHoc = (props: {
  value?: string;
  onChange?: (val?: string) => void;
  multiple?: boolean;
  allowClear?: boolean;
  selectTen?: boolean;
  style?: React.CSSProperties;
  condition?: { trinhDoDaoTaoId?: string; hinhThucDaoTaoId?: string };
  isSetRecord?: boolean;
}) => {
  const { value, onChange, multiple,selectTen, allowClear, style, condition, isSetRecord } = props;
  const { danhSach, getAllModel, visibleForm } = useModel('daotao.namhoc');

  useEffect(() => {
    if (!visibleForm) getAllModel(isSetRecord, undefined, condition);
  }, [visibleForm, JSON.stringify(condition)]);

  return (
    <Select
      mode={multiple ? 'multiple' : undefined}
      allowClear={allowClear}
      value={value}
      onChange={onChange}
      options={danhSach.map((item) => ({
        key: item._id,
        value: selectTen?item?.ten:item._id,
        label: item.ten,
      }))}
      showSearch
      optionFilterProp="label"
      placeholder="Chọn năm học"
      style={{ width: '100%', ...style }}
    />
  );
};

export default SelectNamHoc;
