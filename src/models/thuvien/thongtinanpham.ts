import useInitModel from '@/hooks/useInitModel';
import { ipThuVien } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<AnPham.IThongTinAnPham>('thong-tin-an-pham', undefined, undefined, ipThuVien);

	return {
		...objInit,
	};
};
