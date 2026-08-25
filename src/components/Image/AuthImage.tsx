import axios from '@/utils/axios';
import { Image } from 'antd';
import { useEffect, useState } from 'react';

type AuthImageProps = {
	src?: string;
	fallback?: string;
	alt?: string;
	width?: React.CSSProperties['width'];
	height?: React.CSSProperties['height'];
	style?: React.CSSProperties;
	className?: string;
	isDetail?: boolean;
	preview?: any;
	onError?: () => void;
};

const cache = new Map<string, string>();

const SAFE_RASTER_IMAGE_TYPES = new Set([
	'image/avif',
	'image/bmp',
	'image/gif',
	'image/jpeg',
	'image/png',
	'image/webp',
]);

const SAFE_RASTER_DATA_URL_PATTERN = /^data:image\/(?:avif|bmp|gif|jpe?g|png|webp);base64,[a-z0-9+/=\s]+$/i;

const isSafeRasterImage = (blob: Blob) => SAFE_RASTER_IMAGE_TYPES.has(blob.type.toLowerCase());

const AuthImage: React.FC<AuthImageProps> = ({
	src,
	fallback = '',
	alt = '',
	width,
	height,
	className,
	isDetail,
	style,
	preview,
	onError,
}) => {
	const [imgSrc, setImgSrc] = useState<string>(fallback);

	useEffect(() => {
		if (!src) {
			setImgSrc(fallback);
			return;
		}

		const loadLocalImage = async () => {
			if (SAFE_RASTER_DATA_URL_PATTERN.test(src)) {
				setImgSrc(src);
				return;
			}

			if (!src.startsWith('blob:')) return;

			try {
				const blob = await fetch(src).then((response) => response.blob());
				if (isMounted && isSafeRasterImage(blob)) setImgSrc(src);
				else if (isMounted) setImgSrc(fallback);
			} catch {
				if (isMounted) setImgSrc(fallback);
			}
		};

		let isMounted = true;
		if (src.startsWith('blob:') || src.startsWith('data:')) {
			loadLocalImage();
			return () => {
				isMounted = false;
			};
		}

		if (cache.has(src)) {
			setImgSrc(cache.get(src)!);
			return;
		}

		let objectUrl: string | undefined;

		const fetchImage = async () => {
			try {
				const res = await axios.get(src, {
					responseType: 'blob',
					data: { silent: true },
				});

				if (!isSafeRasterImage(res.data)) throw new Error('Unsupported image type');

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
				width={width}
				height={height}
				className={className}
				style={style}
				preview={preview ? { ...preview, src: imgSrc } : undefined}
			/>
		);
	}

	return <img src={imgSrc} alt={alt} width={width} height={height} className={className} style={style} onError={onError} />;
};

export default AuthImage;
