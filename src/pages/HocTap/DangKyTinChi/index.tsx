import { ETinhChatDangKyTC } from '@/services/DaoTao/DangKyTinChi/constant';
import { Card, Divider, Empty } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';
import DangKyLopHocPhan from './components/DangKyLopHocPhan';
import FilterDotDangKy from './components/FilterDotDangKy';
import PhieuDangKy from './components/PhieuDangKy';
import './components/style.less';

const DangKyTinChiPage = () => {
	const { dotDangKyHienTai } = useModel('daotao.dotdangkytinchi');

	return (
		<Card title='Đăng ký tín chỉ'>
			<FilterDotDangKy />

			{dotDangKyHienTai ? (
				<>
					{moment().isSameOrAfter(dotDangKyHienTai.thoiGianBatDau) &&
					moment().isSameOrBefore(dotDangKyHienTai.thoiGianKetThuc) ? (
						dotDangKyHienTai.tinhChatDangKy === ETinhChatDangKyTC.XOA ? (
							<Empty
								description={
									<i style={{ color: '#999' }}>Đợt đăng ký chỉ cho phép xóa lớp tín chỉ đã đăng ký trước đó !</i>
								}
							/>
						) : (
							<>
								<Divider style={{ marginTop: 24 }}>Thông tin đăng ký</Divider>
								<DangKyLopHocPhan />
							</>
						)
					) : (
						<Empty description={<i style={{ color: '#999' }}>Không trong thời gian đăng ký !</i>} />
					)}
				</>
			) : (
				<Empty description={<i style={{ color: '#999' }}>Không có đợt đăng ký tín chỉ trong học kỳ này !</i>} />
			)}

			<PhieuDangKy />
		</Card>
	);
};

export default DangKyTinChiPage;
