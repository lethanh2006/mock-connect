import { Card } from 'antd';
import { useModel } from 'umi';
import './style.less';

const WelcomeCard = () => {
	const { initialState } = useModel('@@initialState');
	const { record: recSinhVien, loading } = useModel('sinhvien.sinhvien');
	const frame = 'images/welcome-frame.png';
	const gif = 'images/welcome.gif';

	return (
		<Card className='welcome-card' loading={loading}>
			{/* Background geometric shapes */}
			<img className='background-frame' src={frame} alt='Background frame' />

			{/* Content */}
			<div className='content'>
				{/* Hand peace sign icon */}
				<img src={gif} alt='hi' className='gif-image' />

				{/* Text content */}
				<div className='text-content'>
					<h2 className='greeting-text'>
						Xin chào
						{/* {recSinhVien?.lastName}  */} {recSinhVien?.firstName ?? initialState?.currentUser?.given_name ?? 'bạn'},
					</h2>

					<p className='welcome-text'>mừng bạn quay lại</p>
				</div>
			</div>
		</Card>
	);
};

export default WelcomeCard;
