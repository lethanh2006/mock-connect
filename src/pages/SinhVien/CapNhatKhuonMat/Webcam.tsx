import { b64toBlob } from '@/utils/utils';
import { Button } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import { useModel } from 'umi';
import './style.less';
import classNames from 'classnames';

const WebcamNhanDienKhuonMat = (props: { onChange?: (val: any) => void; value?: any }) => {
	const { initialState } = useModel('@@initialState');
	const { onChange, value } = props;
	const [userCamera, setUserCamera] = useState<boolean>(true);
	const [devices, setDevices] = useState<any[]>([]);
	const hasDevices = devices.some((i) => !!i.deviceId);
	const faceUrl = typeof value === 'object' ? value?.fileList?.[0]?.url : value;

	const handleDevices = useCallback(
		(mediaDevices) => setDevices(mediaDevices.filter(({ kind }: any) => kind === 'videoinput')),
		[setDevices],
	);

	useEffect(() => {
		navigator.mediaDevices.enumerateDevices().then(handleDevices);
	}, [handleDevices]);

	const videoConstraints = {
		width: { min: 960 },
		height: { min: 1280 },
		facingMode: userCamera ? 'user' : 'environment',
		aspectRatio: 0.75,
	};

	const blobToFile = (blob: any, fileName: string, type: string) => {
		return new File([blob], fileName, { type });
	};

	return (
		<div className='webcam-face-reg'>
			<div className={classNames({ webcam: true, mirror: userCamera })}>
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
											if (onChange)
												onChange({ fileList: [{ originFileObj: file, thumbUrl: imageSrc, url: imageSrc }] });
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
									Thiết bị không hỗ trợ camera hoặc chưa cho phép website sử dụng camera. Vui lòng kiểm tra lại sau đó
									Tải lại trang web
								</i>
							</div>
						)
					}
				</Webcam>

				{hasDevices ? <div className='overlay' /> : null}
			</div>

			{hasDevices ? <div className='image'>{faceUrl ? <img id='captured' src={faceUrl} /> : null}</div> : null}
		</div>
	);
};

export default WebcamNhanDienKhuonMat;
