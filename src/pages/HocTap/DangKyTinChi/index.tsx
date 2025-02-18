import { ETinhChatDangKyTC, ETrangThaiSinhVienDKTinChi } from '@/services/DaoTao/DangKyTinChi/constant';
import { Card, Divider, Empty, Spin } from 'antd';
import { useEffect } from 'react';
import { history, useModel } from 'umi';
import DangKyLopHocPhan from './components/DangKyLopHocPhan';
import FilterDotDangKy from './components/FilterDotDangKy';
import PhieuDangKy from './components/PhieuDangKy';
import './components/style.less';

const DangKyTinChiPage = () => {
	const { dotDangKyHienTai, loading, sinhVienDot, phieuDangKy } = useModel('daotao.dotdangkytinchi');
	const { getMeModel: getLopHc } = useModel('daotao.lophanhchinh');

	useEffect(() => {
		getLopHc();
	}, []);

	return (
		<Card title='Đăng ký tín chỉ'>
			<FilterDotDangKy />

			<Spin spinning={loading}>
				{dotDangKyHienTai && sinhVienDot ? (
					sinhVienDot.trangThaiSvDangKyTinChi === ETrangThaiSinhVienDKTinChi.KHONG_DUOC_DK ? (
						<Empty
							description={
								<>
									<span className='text-error'>Bạn không được phép đăng ký tín chỉ trong đợt này!</span>
									<br />
									Ghi chú: {sinhVienDot.ghiChu ?? '--'}
								</>
							}
						/>
					) : dotDangKyHienTai.tinhChatDangKy === ETinhChatDangKyTC.XOA ? (
						<Empty
							description={
								<i style={{ color: '#999' }}>Đợt đăng ký chỉ cho phép <b>XÓA</b> lớp tín chỉ đã đăng ký trước đó!</i>
							}
						/>
					) : !!phieuDangKy?.soTinChiToiDa ? (
						<>
							<Divider style={{ marginTop: 24 }}>Thông tin đăng ký</Divider>
							<div style={{ marginBottom: 12 }}>
								Sinh viên chủ động theo dõi{' '}
								<a
									href='./tien-trinh-hoc-tap'
									onClick={(e) => {
										e.preventDefault();
										history.push('./tien-trinh-hoc-tap');
									}}
								>
									Tiến trình học tập
								</a>{' '}
								và{' '}
								<a
									href='./ket-qua-hoc-tap'
									onClick={(e) => {
										e.preventDefault();
										history.push('./ket-qua-hoc-tap');
									}}
								>
									Kết quả học tập
								</a>{' '}
								để lựa chọn các lớp theo đúng tiến trình; học phần cần học lại, học cải thiện; khóa luận tốt nghiệp hoặc
								học phần thay thế...
							</div>
							<DangKyLopHocPhan />
						</>
					) : (
						<Empty description={<i style={{ color: '#999' }}>Có lỗi xảy ra, vui lòng thử lại!</i>} />
					)
				) : (
					<Empty description={<i style={{ color: '#999' }}>Không có đợt đăng ký tín chỉ trong học kỳ này!</i>} />
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
