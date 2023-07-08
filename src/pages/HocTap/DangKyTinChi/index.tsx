import { Card, Empty } from 'antd';
import FilterDotDangKy from './components/FilterDotDangKy';
import PhieuDangKy from './components/PhieuDangKy';
import DangKyLopHocPhan from './components/DangKyLopHocPhan';
import { useModel } from 'umi';
import moment from 'moment';
import './components/style.less';

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
      ) : (
        <Empty
          description={
            <i style={{ color: '#999' }}>Không có đợt đăng ký tín chỉ trong học kỳ này !</i>
          }
        />
      )}

      <PhieuDangKy />
    </Card>
  );
};

export default DangKyTinChiPage;
