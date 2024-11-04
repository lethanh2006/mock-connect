import { b64toBlob } from '@/utils/utils';
import { Button } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import { useModel } from 'umi';
import './style.less';

const WebcamNhanDienKhuonMat = (props: { onChange?: (val: any) => void; value?: any }) => {
	const { initialState } = useModel('@@initialState');
	const { onChange } = props;
	const [userCamera, setUserCamera] = useState<boolean>(true);
	const [devices, setDevices] = useState<any[]>([]);
	const hasDevices = devices.some((i) => !!i.deviceId);

	const handleDevices = useCallback(
		(mediaDevices) => setDevices(mediaDevices.filter(({ kind }: any) => kind === 'videoinput')),
		[setDevices],
	);

	useEffect(() => {
		navigator.mediaDevices.enumerateDevices().then(handleDevices);
	}, [handleDevices]);

	const videoConstraints = {
		width: 960,
		height: 1280,
		facingMode: userCamera ? 'user' : 'environment',
	};

	const blobToFile = (blob: any, fileName: string, type: string) => {
		return new File([blob], fileName, { type });
	};

	return (
		<div className='webcam-face-reg'>
			<div className='webcam'>
				<Webcam
					audio={false}
					screenshotFormat='image/jpeg'
					height={320}
					width={240}
					videoConstraints={videoConstraints}
				>
					{({ getScreenshot }) =>
						hasDevices ? (
							<div className='buttons'>
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
								<Button onClick={() => setUserCamera((val) => !val)}>Đổi camera</Button>
							</div>
						) : (
							<div>
								<i className='text-error'>
									Thiết bị không hỗ trợ camera hoặc chưa cho phép website sử dụng camera. Vui lòng kiểm tra lại
								</i>
							</div>
						)
					}
				</Webcam>

				<div className='overlay' />
			</div>

			{hasDevices ? (
				<div className='image'>
					<img id='captured' />
				</div>
			) : null}
		</div>
	);
};

export default WebcamNhanDienKhuonMat;
