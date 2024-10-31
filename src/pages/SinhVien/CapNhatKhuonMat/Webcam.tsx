import { b64toBlob } from '@/utils/utils';
import { Button } from 'antd';
import Webcam from 'react-webcam';
import './style.less';
import { useModel } from 'umi';

const WebcamNhanDienKhuonMat = (props: { onChange?: (val: any) => void; value?: any }) => {
	const { initialState } = useModel('@@initialState');
	const { onChange } = props;

	const videoConstraints = {
		width: 960,
		height: 1280,
		facingMode: 'user',
	};

	const blobToFile = (blob: any, fileName: string, type: string) => {
		return new File([blob], fileName, { type });
	};

	return (
		<div className='webcam-face-reg'>
			<div className='webcam'>
				<Webcam audio={false} screenshotFormat='image/jpeg' height={320} videoConstraints={videoConstraints}>
					{({ getScreenshot }) => (
						<div>
							<Button
								onClick={() => {
									const imageSrc = getScreenshot({ height: 1280, width: 960 });
									if (imageSrc) {
										const base64Data = imageSrc.split(',')[1];
										const blob = b64toBlob(base64Data);
										const file = blobToFile(
											blob,
											`captured-${initialState?.currentUser?.preferred_username ?? ''}.jpeg`,
											'image/jpeg',
										);
										if (onChange) onChange({ fileList: [{ originFileObj: file, thumbUrl: imageSrc }] });

										const myImage = document.getElementById('captured') as any;
										if (blob && myImage) {
											const objectURL = URL.createObjectURL(blob);
											myImage.src = objectURL;
										}
									}
								}}
							>
								Chụp ảnh
							</Button>
						</div>
					)}
				</Webcam>

				<div className='overlay' />
			</div>

			<div className='image'>
				<img id='captured' alt='Chưa chụp ảnh' />
			</div>
		</div>
	);
};

export default WebcamNhanDienKhuonMat;
