import useInitModel from '@/hooks/useInitModel';
import type { PhieuMuonTra } from '@/services/QuanLyThuVien/PhieuMuonTra/typing';
import { ipThuVien } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<PhieuMuonTra.IRecord>('phieu-muon-tra-an-pham', undefined, undefined, ipThuVien);

	return {
		...objInit,
	};
};
