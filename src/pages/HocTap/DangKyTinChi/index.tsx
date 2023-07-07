import { Card, Empty } from 'antd';
import FilterDotDangKy from './components/FilterDotDangKy';
import PhieuDangKy from './components/PhieuDangKy';
import DangKyLopHocPhan from './components/DangKyLopHocPhan';
import { useModel } from 'umi';
import moment from 'moment';

const DangKyTinChiPage = () => {
  const { dotDangKyHienTai } = useModel('daotao.dotdangkytinchi');

  return (
    <Card title="Đăng ký tín chỉ">
      <FilterDotDangKy />

      {dotDangKyHienTai ? (
        <>
          {moment().isSameOrAfter(dotDangKyHienTai.thoiGianBatDau) &&
          moment().isSameOrBefore(dotDangKyHienTai.thoiGianKetThuc) ? (
            <DangKyLopHocPhan />
          ) : (
            <Empty description={<i style={{ color: '#999' }}>Không trong thời gian đăng ký !</i>} />
          )}
        </>
      ) : null}

      <PhieuDangKy />
    </Card>
  );
};

export default DangKyTinChiPage;
