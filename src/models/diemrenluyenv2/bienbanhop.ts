import useInitModel from '@/hooks/useInitModel';
import { exportBienBanHop } from '@/services/DiemRenLuyenV2/BienBanHop';
import type { BienBanHopDiemRenLuyen } from '@/services/DiemRenLuyenV2/BienBanHop/typings';
import fileDownload from 'js-file-download';

export default () => {
	const objInit = useInitModel<BienBanHopDiemRenLuyen.IRecord>('bien-ban-phieu-diem-ren-luyen');
	const { setLoading } = objInit;

	const exportBienBanHopModel = async (idBienBan: string, tenLopHc: string, tenDotChamDiem: string) => {
		setLoading(true);
		const res = await exportBienBanHop(idBienBan);
		fileDownload(res.data, `BienBanHop_${tenLopHc}_${tenDotChamDiem}.docx`);
		setLoading(false);
	};

	return {
		...objInit,
		exportBienBanHopModel,
	};
};
