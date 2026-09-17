import { IconButton, IconPlus } from '@/components/Icons';
import Select from '@/components/MySelect';
import ModalExpandable from '@/components/Table/ModalExpandable';
import { useEffect } from 'react';
import { useModel } from 'umi';
import FormChucVu from './Form';

/**
 * Secect Chức vụ để cho vào FormItem
 */
const SelectChucVu = (props: {
  value?: string | null;
  onChange?: (val: string | null) => void;
  multiple?: boolean;
  hasCreate?: boolean;
}) => {
  const { value, onChange, multiple, hasCreate } = props;
  const { danhSach, getAllModel, setVisibleForm, visibleForm, setEdit, setRecord } =
    useModel('danhmuc.chucvu');

  useEffect(() => {
    if (!visibleForm) getAllModel();
  }, [visibleForm]);

  const onAddNew = () => {
    setRecord(undefined);
    setEdit(false);
    setVisibleForm(true);
  };

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <div className={hasCreate !== false ? 'width-select-custom' : 'fullWidth'}>
        <Select
          mode={multiple ? 'multiple' : undefined}
          value={value}
          onChange={onChange}
          options={danhSach.map((item) => ({
            key: item._id,
            value: item._id,
            label: `${item.ten} (${item.ma})`,
          }))}
          showSearch
          optionFilterProp="label"
          placeholder="Chọn chức vụ"
        />
      </div>

      {hasCreate !== false ? (
        <>
          <IconButton label="Thêm mới chức vụ" variant="outline" onClick={onAddNew}>
            <IconPlus />
          </IconButton>
          <ModalExpandable
            open={visibleForm}
            onCancel={() => setVisibleForm(false)}
            allowExpand={false}
            styles={{ body: { padding: 0 } }}
          >
            <FormChucVu title="chức vụ" />
          </ModalExpandable>
        </>
      ) : null}
    </div>
  );
};

export default SelectChucVu;
