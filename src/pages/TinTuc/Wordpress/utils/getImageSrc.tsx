import { type TinTucWP } from '@/services/TinTuc/typing';
import { first } from 'lodash';
import anh from '@/assets/noimg.png';

interface GetImageSrc {
	tinTuc?: TinTucWP.IRecord;
	targetSize: 'medium' | 'large' | 'thumbnail' | 'medium_large' | 'full' | string;
}
export const getImageSrc = ({ targetSize, tinTuc }: GetImageSrc) => {
	const sizes = first(tinTuc?._embedded?.['wp:featuredmedia'])?.media_details?.sizes;
	return sizes?.[targetSize as keyof typeof sizes]?.source_url ?? sizes?.full?.source_url ?? anh;
};
