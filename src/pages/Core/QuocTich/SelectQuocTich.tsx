import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectQuocTich = (props: {
  value?: string;
  onChange?: any;
  multiple?: boolean;
  loadData?: boolean;
  allowClear?: boolean;
  placeholder?: string;
}) => {
  const { value, onChange, multiple, loadData, allowClear, placeholder } = props;
  const { danhSach, getAllModel } = useModel('core.quoctich');

  useEffect(() => {
    if (loadData !== false) getAllModel();
  }, []);

  return (
    <Select
      mode={multiple ? 'multiple' : undefined}
      value={value}
      allowClear={allowClear}
      onChange={onChange}
      options={danhSach.map((item) => ({
        key: item._id,
        value: item._id,
        label: `${item.tenQuocTich} - ${item.ma}`,
      }))}
      showSearch
      optionFilterProp="label"
      placeholder={placeholder ?? 'Chọn quốc tịch'}
    />
  );
};

export default SelectQuocTich;
