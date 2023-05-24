import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const SelectNhanSuTheoDonVi = (props: {
  value?: string;
  onChange?: (value: string, option: any) => void;
  multiple?: boolean;
  donViId: string;
}) => {
  const { value, onChange, multiple, donViId } = props;
  const { danhSach, getAllModel } = useModel('tochucnhansu.nhansudonvi');

  useEffect(() => {
    getAllModel(false, undefined, { donViId });
  }, [donViId]);

  return (
    <Select
      mode={multiple ? 'multiple' : undefined}
      value={value}
      onChange={onChange}
      options={danhSach.map((item) => ({
        key: item._id,
        value: item.thongTinNhanSu?.ssoId ?? item.thongTinNhanSuId,
        label: `${item.thongTinNhanSu?.hoDem} ${item.thongTinNhanSu?.ten} - ${item.thongTinNhanSu.maCanBo} - ${item.chucVu?.ten}`,
        hoten: `${item.thongTinNhanSu?.hoDem} ${item.thongTinNhanSu?.ten}`,
      }))}
      showSearch
      optionFilterProp="label"
      placeholder="Chọn cán bộ, giảng viên"
    />
  );
};

export default SelectNhanSuTheoDonVi;
