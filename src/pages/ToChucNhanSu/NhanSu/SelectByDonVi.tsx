import { Select } from 'antd';
import { useEffect, useMemo } from 'react';
import { useModel } from 'umi';

const SelectNhanSuTheoDonVi = (props: {
  value?: string;
  onChange?: (value: string, option: any) => void;
  multiple?: boolean;
  /** MongoDB _id của đơn vị — ưu tiên nếu có */
  donViId?: string;
  /** maDonVi — fallback khi chỉ có mã (VD: load từ API), component tự resolve _id */
  maDonVi?: string;
  allowClear?: boolean;
  placeholder?: string;
  disabled?: boolean;
}) => {
  const { value, onChange, multiple, donViId, maDonVi, allowClear, placeholder, disabled } = props;
  const { danhSach, getAllModel } = useModel('tochucnhansu.nhansudonvi');
  const { danhSach: danhSachDonVi } = useModel('tochucnhansu.donvi');

  // Nếu có donViId dùng thẳng, nếu không thì lookup _id từ maDonVi
  const resolvedDonViId = useMemo(() => {
    if (donViId) return donViId;
    if (maDonVi) return danhSachDonVi.find((dv) => dv.maDonVi === maDonVi)?._id;
    return undefined;
  }, [donViId, maDonVi, danhSachDonVi]);

  useEffect(() => {
    if (resolvedDonViId) {
      getAllModel(false, undefined, { donViId: resolvedDonViId });
    }
  }, [resolvedDonViId]);

  return (
    <Select
      mode={multiple ? 'multiple' : undefined}
      value={value}
      onChange={onChange}
      disabled={disabled}
      options={danhSach.map((item) => ({
        key: item._id,
        value: item.thongTinNhanSu?.ssoId ?? item.thongTinNhanSuId,
        label: `${item.thongTinNhanSu?.hoDem} ${item.thongTinNhanSu?.ten} - ${item.thongTinNhanSu.maCanBo} - ${item.chucVu?.ten}`,
        hoten: `${item.thongTinNhanSu?.hoDem} ${item.thongTinNhanSu?.ten}`,
        rawData: item,
      }))}
      showSearch
      allowClear={allowClear}
      optionFilterProp="label"
      placeholder={placeholder || 'Chọn cán bộ, giảng viên'}
    />
  );
};

export default SelectNhanSuTheoDonVi;
