import bgComing from '@/assets/cct/background.png';
import loadingVideo from '@/assets/trangchu/Loading.webm';
import './style.less';

const Comming = () => {
	return (
		<div className='comming-page'>
			<div className='comming-background' style={{ backgroundImage: `url(${bgComing})` }} />

			<div className='comming-content'>
				<video className='comming-video' autoPlay loop muted playsInline>
					<source src={loadingVideo} type='video/mp4' />
				</video>

				<div className='comming-title'>Our application is developing. It will be very soon</div>
			</div>
		</div>
	);
};

export default Comming;
