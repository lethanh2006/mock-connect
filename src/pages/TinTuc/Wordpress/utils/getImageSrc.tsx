import anh from '@/assets/noimg.png';
import { type TinTucWP } from '@/services/TinTuc/typing';
import { getSafeHref } from '@/utils/security';
import { first } from 'lodash';

interface GetImageSrc {
	tinTuc?: TinTucWP.IRecord;
	targetSize: 'medium' | 'large' | 'thumbnail' | 'medium_large' | 'full' | string;
}

export const getImageSrc = ({ targetSize, tinTuc }: GetImageSrc) => {
	const sizes = first(tinTuc?._embedded?.['wp:featuredmedia'])?.media_details?.sizes;
	const raw = sizes?.[targetSize as keyof typeof sizes]?.source_url ?? sizes?.full?.source_url ?? anh;
	return getSafeHref(raw) ?? getSafeHref(anh) ?? '';
};
