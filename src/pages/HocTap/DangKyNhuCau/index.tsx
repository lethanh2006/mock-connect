import { Card, Empty } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import NhuCauHocPhanPage from './NhuCauHocPhan';

const DangKyNhuCauPage = () => {
  const { danhSach: danhSachDot, getAllModel: getDot } = useModel('daotao.dotdangkynhucau');

  useEffect(() => {
    getDot();
  }, []);

  return (
    <>
      <Card title="Đăng ký nhu cầu">
        {danhSachDot.length ? (
          <>
            <NhuCauHocPhanPage />
          </>
        ) : (
          <Empty description="Không có đợt đăng ký" style={{ marginTop: 32 }} />
        )}
      </Card>
    </>
  );
};

export default DangKyNhuCauPage;
