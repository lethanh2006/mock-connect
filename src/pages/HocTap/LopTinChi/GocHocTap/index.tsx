import ResultWithLogo from '@/components/ResultWithLogo';
import { useEffect, useState } from 'react';
import DiemThanhPhanSV from './components/DiemThanhPhanSV';
import logo from '@/assets/logo.png';
import { Button, Spin } from 'antd';
import { history } from 'umi';

const GocHocTap = () => {
  const [isLamKhaoSat, setIsLamKhaoSat] = useState<number>(-1);
  const [loading, setLoading] = useState(false);
  // const checkUnfinishedModel = async () => {
  //   setLoading(true);
  //   const res = await checkUnfinished({ chucNangSuDung: 'KET_QUA_HOC_TAP', loai: 'BIEU_MAU' });
  //   setIsLamKhaoSat(res?.data?.data ? 1 : 0);
  //   setLoading(false);
  // };

  // useEffect(() => {
  //   checkUnfinishedModel();
  // }, []);

  return (
    <Spin spinning={loading}>
      {isLamKhaoSat !== 0 ? (
        <ResultWithLogo
          logo={logo}
          title={
            isLamKhaoSat === -1
              ? ''
              : 'Vui lòng thực hiện khảo sát để sử dụng tính năng Kết quả học tập'
          }
          extra={
            isLamKhaoSat === -1 ? undefined : (
              <Button
                type="primary"
                onClick={() => {
                  history.push('/tienichkhac/khaosat');
                }}
              >
                Thực hiện khảo sát
              </Button>
            )
          }
        />
      ) : (
        <DiemThanhPhanSV />
      )}
    </Spin>
  );
};

export default GocHocTap;
