import type { SanPhamNCKH } from '@/services/KhoaHoc/SanPhamNCKH/typings';
import { createYeuCauQuyDoiGio } from '@/services/KhoaHoc/YeuCauQuyDoiGio';
import { useState } from 'react';

export default () => {
	const [loading, setLoading] = useState<boolean>(false);

	const createYeuCauQuyDoiGioModel = async (
		idSanPham: string,
		payload: {
			namHocId: string;
			danhSachKetQuaTinhGioThanhVien: SanPhamNCKH.KetQuaTinhGioThanhVien[];
		},
		getData: any,
		mode: 'GIO' | 'DIEM',
	) => {
		setLoading(true);
		await createYeuCauQuyDoiGio(idSanPham, payload, mode);
		// message.success('Lưu thành công');
		if (getData) getData();
		setLoading(false);
	};

	return {
		loading,
		setLoading,
		createYeuCauQuyDoiGioModel,
	};
};
