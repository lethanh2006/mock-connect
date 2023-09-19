import useInitModel from '@/hooks/useInitModel';
import { type DotChamDiem } from '@/services/DiemRenLuyen/DotChamDiem/typing';

export default () => {
	const objInit = useInitModel<DotChamDiem.IRecord>('dot-cham-diem-ren-luyen');

	return {
		...objInit,
	};
};
