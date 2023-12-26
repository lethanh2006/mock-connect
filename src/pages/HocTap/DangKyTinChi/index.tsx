import { ETinhChatDangKyTC } from '@/services/DaoTao/DangKyTinChi/constant';
import { YoutubeOutlined } from '@ant-design/icons';
import { Card, Divider, Empty, Spin } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import DangKyLopHocPhan from './components/DangKyLopHocPhan';
import FilterDotDangKy from './components/FilterDotDangKy';
import PhieuDangKy from './components/PhieuDangKy';
import './components/style.less';

const DangKyTinChiPage = () => {
	const { dotDangKyHienTai, loading } = useModel('daotao.dotdangkytinchi');
	const { getMeModel: getLopHc } = useModel('daotao.lophanhchinh');

	useEffect(() => {
		getLopHc();
	}, []);

	return (
		<Card title='Đăng ký tín chỉ'>
			<FilterDotDangKy />

			<Spin spinning={loading}>
				{dotDangKyHienTai ? (
					<>
						{dotDangKyHienTai.tinhChatDangKy === ETinhChatDangKyTC.XOA ? (
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
						)}
					</>
				) : (
					<Empty description={<i style={{ color: '#999' }}>Không có đợt đăng ký tín chỉ trong học kỳ này !</i>} />
				)}
			</Spin>

			<PhieuDangKy />

			<div className='huong-dan'>
				<div className='title-huong-dan'>
					<i>Xem video hướng dẫn đăng ký tín chỉ</i>
				</div>

				<YoutubeOutlined
					className='pulse'
					onClick={() => window.open('https://www.youtube.com/watch?v=2xghlws7tAk&t=2s')}
				/>
			</div>
		</Card>
	);
};

export default DangKyTinChiPage;
