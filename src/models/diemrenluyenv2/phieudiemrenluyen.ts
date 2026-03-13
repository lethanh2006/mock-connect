import useInitModel from '@/hooks/useInitModel';
import {
	exportDonKhieuNai,
	exportPhieuTongHop,
	getPhieuTongHop,
	guiKhieuNai,
} from '@/services/DiemRenLuyenV2/PhieuDiemRenLuyen';
import type { PhieuDiemRenLuyenV2 } from '@/services/DiemRenLuyenV2/PhieuDiemRenLuyen/typing';
import { message } from 'antd';
import fileDownload from 'js-file-download';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<PhieuDiemRenLuyenV2.IRecord>('phieu-diem-ren-luyen');
	const [recPhieuTongHop, setRecPhieuTongHop] = useState<PhieuDiemRenLuyenV2.IPhieuTongHop>();
	const { setLoading } = objInit;
	const [visibleFormGuiKhieuNai, setVisibleFormGuiKhieuNai] = useState<boolean>(false);
	const getPhieuTongHopModel = async (idDotChamDiem: string, tenLopHc: string) => {
		setLoading(true);
		const res = await getPhieuTongHop(idDotChamDiem, tenLopHc);
		setRecPhieuTongHop(res?.data?.data ?? {});
		setLoading(false);
	};

	const exportPhieuTongHopModel = async (idDotChamDiem: string, tenLopHc: string, tenDot: string) => {
		setLoading(true);
		const res = await exportPhieuTongHop(idDotChamDiem, tenLopHc);
		fileDownload(res.data, `PhieuTongHop_${tenLopHc}_${tenDot}.docx`);
		setLoading(false);
	};
	const exportDonKhieuNaiModel = async (idPhieuDiem: string) => {
		setLoading(true);
		const res = await exportDonKhieuNai(idPhieuDiem);
		fileDownload(res.data, 'DonKhieuNai.docx');
		setLoading(false);
	};

	const guiKhieuNaiModel = async (idPhieuDiem: string, payload: any, getData?: any) => {
		setLoading(true);
		await guiKhieuNai(idPhieuDiem, payload);
		message.success('Gửi khiếu nại thành công');
		if (getData) getData();
		setLoading(false);
	};

	return {
		...objInit,
		recPhieuTongHop,
		exportDonKhieuNaiModel,
		setRecPhieuTongHop,
		getPhieuTongHopModel,
		exportPhieuTongHopModel,
		guiKhieuNaiModel,
		visibleFormGuiKhieuNai,
		setVisibleFormGuiKhieuNai,
	};
};
