import { EColorLopDangKy } from '@/services/DaoTao/DangKyTinChi/constant';
import { Space } from 'antd';
import { useIntl } from 'umi';

const ViewGhiChuDangKyTinChi = () => {
	const intl = useIntl();

	return (
		<div style={{ maxWidth: 500 }}>
			{intl.formatMessage({ id: 'dangkytinchi.ghichudangkytinchi.step1' })}
			<br />
			{intl.formatMessage({ id: 'dangkytinchi.ghichudangkytinchi.step2' })}
			<br />
			{intl.formatMessage(
				{ id: 'dangkytinchi.ghichudangkytinchi.step3' },
				{
					i: (chunk) => <i>{chunk}</i>,
				},
			)}
			<br />
			{intl.formatMessage(
				{ id: 'dangkytinchi.ghichudangkytinchi.step4' },
				{
					b: (chunk) => <b>{chunk}</b>,
				},
			)}
			<br />
			{intl.formatMessage(
				{ id: 'dangkytinchi.ghichudangkytinchi.link.xemhuongdan' },
				{
					a: (chunks) => (
						<a href='https://www.youtube.com/watch?v=2xghlws7tAk' target='_blank' rel='noreferrer'>
							{chunks}
						</a>
					),
				},
			)}
			<br />
			<br />
			<u>{intl.formatMessage({ id: 'dangkytinchi.ghichudangkytinchi.ghichu' })}:</u>
			<br />
			<div style={{ display: 'flex', flexDirection: 'column' }}>
				<Space style={{ marginTop: 5 }}>
					<span className='dang-ky-ghi-chu selected' />
					{intl.formatMessage({ id: 'dangkytinchi.ghichudangkytinchi.description.lopdadangky' })}
				</Space>
				<Space style={{ marginTop: 5 }}>
					<span className='dang-ky-ghi-chu' style={{ backgroundColor: EColorLopDangKy.TRUNG_LICH }} />
					{intl.formatMessage({ id: 'dangkytinchi.ghichudangkytinchi.description.lopbitrunglichhoc' })}
				</Space>
				<Space style={{ marginTop: 5 }}>
					<span className='dang-ky-ghi-chu' style={{ backgroundColor: EColorLopDangKy.FULL_LOP }} />
					{intl.formatMessage({ id: 'dangkytinchi.ghichudangkytinchi.description.lopkhongconchotrong' })}
				</Space>
				<Space style={{ marginTop: 5 }}>
					<span className='fw500'>
						{intl.formatMessage({ id: 'dangkytinchi.ghichudangkytinchi.description.chudam' })}
					</span>
					{intl.formatMessage({ id: 'dangkytinchi.ghichudangkytinchi.description.lopgoiy' })}
				</Space>
			</div>
		</div>
	);
};

export default ViewGhiChuDangKyTinChi;
