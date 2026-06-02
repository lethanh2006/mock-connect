import axios from '@/utils/axios';
import { Image } from 'antd';
import { useEffect, useState } from 'react';

type AuthImageProps = {
	src?: string;
	fallback?: string;
	alt?: string;
	style?: React.CSSProperties;
	className?: string;
	isDetail?: boolean;
	preview?: any;
};

const cache = new Map<string, string>();

const AuthImage: React.FC<AuthImageProps> = ({ src, fallback = '', alt = '', className, isDetail, style, preview }) => {
	const [imgSrc, setImgSrc] = useState<string>(fallback);

	useEffect(() => {
		if (!src) {
			setImgSrc(fallback);
			return;
		}

		if (cache.has(src)) {
			setImgSrc(cache.get(src)!);
			return;
		}

		let objectUrl: string | undefined;
		let isMounted = true;

		const fetchImage = async () => {
			try {
				const res = await axios.get(src, {
					responseType: 'blob',
					data: { silent: true },
				});

				objectUrl = URL.createObjectURL(res.data);
				cache.set(src, objectUrl);

				if (isMounted) setImgSrc(objectUrl);
			} catch {
				if (isMounted) setImgSrc(fallback);
			}
		};

		fetchImage();

		return () => {
			isMounted = false;
		};
	}, [src, fallback]);

	if (isDetail) {
		return (
			<Image
				src={imgSrc}
				alt={alt}
				className={className}
				style={style}
				preview={preview ? { ...preview, src: imgSrc } : undefined}
			/>
		);
	}

	return <img src={imgSrc} alt={alt} className={className} style={style} />;
};

export default AuthImage;
