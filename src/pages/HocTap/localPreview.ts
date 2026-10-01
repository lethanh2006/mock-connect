/** Ba màn Học tập dùng mock mặc định trên dev; ?preview=0 để xem dữ liệu thật. */
export const isHocTapPreview = () =>
	process.env.NODE_ENV === 'development' &&
	typeof window !== 'undefined' &&
	new URLSearchParams(window.location.search).get('preview') !== '0';
