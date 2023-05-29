import { EOperatorType } from '@/components/Table/constant';
import { Select, Spin } from 'antd';
import _ from 'lodash';
import { useEffect } from 'react';
import { useModel } from 'umi';

const SelectNhanSuDebounce = (props: { value?: string; onChange?: any; multiple?: boolean }) => {
  const { value, onChange, multiple } = props;
  const { danhSach, getModel, setFilters, filters, loading } = useModel('tochucnhansu.nhansu');

  useEffect(() => {
    getModel();
  }, [filters]);

  const searchDebounceSinhVien = _.debounce((val) => {
    setFilters([{ active: true, field: 'ten', values: [val], operator: EOperatorType.CONTAIN }]);
  }, 800);

  return (
    <Select
      mode={multiple ? 'multiple' : undefined}
      value={value}
      onChange={onChange}
      onSearch={(val) => searchDebounceSinhVien(val)}
      notFoundContent={loading ? <Spin spinning={true} /> : undefined}
      options={danhSach.map((item) => ({
        key: item._id,
        value: item.ssoId,
        label: `${item.hoDem} ${item.ten} - ${item.maCanBo}`,
      }))}
      showSearch
      optionFilterProp="label"
      placeholder="Chọn cán bộ, giảng viên"
    />
  );
};

export default SelectNhanSuDebounce;
