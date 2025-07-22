import { Card } from 'antd';

import { useEffect } from 'react';
import { useModel } from 'umi';
import './CardXinChao.less';

const WelcomeCard = () => {
	const { initialState } = useModel('@@initialState');
	const { getThongTinCuaToiModel, record: recSinhVien } = useModel('sinhvien.sinhvien');

	const frame = 'images/welcome-frame.png';
	const gif = 'images/welcome.gif';

	useEffect(() => {
		if (initialState?.currentUser?.ssoId) {
			getThongTinCuaToiModel();
		}
	}, [initialState?.currentUser?.ssoId]);

	return (
		<Card className='welcome-card' bodyStyle={{}}>
			{/* Background geometric shapes */}
			<img className='background-frame' src={frame} alt='Background frame' />

			{/* Content */}
			<div className='content'>
				{/* Hand peace sign icon */}
				<img src={gif} alt='' className='gif-image' />

				{/* Text content */}
				<div className='text-content'>
					<h2 className='greeting-text'>
						Xin chào
						{/* {recSinhVien?.lastName}  */} {recSinhVien?.firstName},
					</h2>

					<p className='welcome-text'>mừng bạn quay lại</p>
				</div>
			</div>
		</Card>
	);
};

export default WelcomeCard;
