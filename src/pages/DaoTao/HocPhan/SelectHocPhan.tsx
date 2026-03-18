import { Select } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

/**
 * Select học phần
 */
const SelectHocPhan = (props: {
  value?: string;
  onChange?: (hocPhanId: string) => void;
  multiple?: boolean;
  allowClear?: boolean;
  loadData?: boolean;
  selectMa?: boolean;
  isMe?: boolean;
}) => {
  const { value, onChange, multiple, allowClear, loadData, selectMa, isMe } = props;
  const intl = useIntl();
  const { danhSach, getAllModel, getModel } = useModel('hocphan.hocphan');

  useEffect(() => {
    if (loadData !== false) {
      if (isMe) {
        getModel(undefined, undefined, undefined, undefined, undefined, 'me/page');
      } else {
        getAllModel();
      }
    }
  }, [loadData, isMe]);

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
        placeholder={intl.formatMessage({ id: 'minor.idm.select.placeholderCourse' })}
        style={{ width: '100%' }}
        allowClear={allowClear ?? false}
      />
    </div>
  );
};

export default SelectHocPhan;
