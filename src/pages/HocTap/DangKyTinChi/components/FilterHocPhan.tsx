import SelectHocPhan from '@/pages/DaoTao/HocPhan/SelectHocPhan';
import { ELoaiHocPhanDangKyTinChi } from '@/services/DaoTao/DangKyTinChi/constant';
import { Select, Space } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';

const FilterHocPhan = () => {
  const { record: recHocKy } = useModel('daotao.hocky');
  const [loaiHocPhan, setLoaiHocPhan] = useState<ELoaiHocPhanDangKyTinChi>(
    ELoaiHocPhanDangKyTinChi.TAT_CA,
  );

  return (
    <Space size={8} wrap>
      <Select
        options={Object.values(ELoaiHocPhanDangKyTinChi).map((item) => ({
          key: item,
          label: item,
          value: item,
        }))}
        value={loaiHocPhan}
        onChange={(val) => setLoaiHocPhan(val)}
        style={{ width: 200 }}
      />
      <SelectHocPhan />
    </Space>
  );
};

export default FilterHocPhan;
