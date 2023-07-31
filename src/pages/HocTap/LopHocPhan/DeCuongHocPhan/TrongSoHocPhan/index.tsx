import { type HocPhan } from '@/services/DaoTao/HocPhan/typings';
import { Descriptions } from 'antd';
import _ from 'lodash';
import { useEffect } from 'react';
import { useModel } from 'umi';

const TrongSoHocPhanPage = () => {
  const { danhSach, getModel } = useModel('daotao.daudiemhocphan');
  const { record: recDeCuong } = useModel('hocphan.decuonghocphan');

  const ts = danhSach.map(
    (i) => (recDeCuong?.[('trongSo' + i.field) as keyof HocPhan.IDeCuongHocPhan] as number) ?? 0,
  );
  const sum = _.sum(ts);

  useEffect(() => {
    getModel();
  }, []);

  return (
    <Descriptions title="Trọng số học phần">
      {danhSach.map((item) => (
        <Descriptions.Item key={item._id} label={item.ten}>
          {recDeCuong?.[`trongSo${item.field}` as keyof HocPhan.IDeCuongHocPhan]}%
        </Descriptions.Item>
      ))}
      <Descriptions.Item key={'2'} label="Điểm thi KTHP">
        {100 - sum}%
      </Descriptions.Item>
    </Descriptions>
  );
};

export default TrongSoHocPhanPage;
