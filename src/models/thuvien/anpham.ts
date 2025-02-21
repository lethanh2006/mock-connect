import useInitModel from '@/hooks/useInitModel';
import { getChiTietAnPham } from '@/services/QuanLyThuVien/AnPham';
import { ipThuVien } from '@/utils/ip';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<AnPham.IRecord>('an-pham', undefined, undefined, ipThuVien);
	const [loadingChiTiet, setLoadingChiTiet] = useState<boolean>(false);
	const [danhSachTag, setDanhSachTag] = useState<AnPham.IThongTinAnPham[]>([]);

	const getChiTietAnPhamModal = async (idAnPham: string): Promise<AnPham.IRecord> => {
		setLoadingChiTiet(true);
		try {
			const res = await getChiTietAnPham(idAnPham);
			setDanhSachTag(res.data?.data);
			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setLoadingChiTiet(false);
		}
	};

	return {
		...objInit,
		loadingChiTiet,
		danhSachTag,
		getChiTietAnPhamModal,
	};
};
