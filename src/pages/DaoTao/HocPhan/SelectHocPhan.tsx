import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectHocPhan = (props: {
  value?: string;
  onChange?: (hocPhanId: string) => void;
  multiple?: boolean;
  allowClear?: boolean;
  loadData?: boolean;
  selectMa?: boolean;
}) => {
  const { value, onChange, multiple, allowClear, loadData, selectMa } = props;
  const { danhSach, getAllModel } = useModel('hocphan.hocphan');

  useEffect(() => {
    if (loadData !== false) getAllModel();
  }, [loadData]);

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <Select
        mode={multiple ? 'multiple' : undefined}
        value={value}
        onChange={onChange}
        options={danhSach.map((item) => ({
          key: item._id,
          value: selectMa ? item.ma : item._id,
          label: `${item.ten} (${item.ma})`,
        }))}
        showSearch
        optionFilterProp="label"
        placeholder="Chọn học phần"
        style={{ width: '100%' }}
        allowClear={allowClear ?? false}
      />
    </div>
  );
};

export default SelectHocPhan;
