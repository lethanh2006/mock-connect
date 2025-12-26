import useInitModel from '@/hooks/useInitModel';
import { type BieuMau } from '@/services/TienIch/KhaoSat/BieuMau/typing';

export default () => {
	const objInit = useInitModel<BieuMau.ICauTraLoiKhaoSat>('cau-tra-loi-khao-sat');

	return {
		...objInit,
	};
};
