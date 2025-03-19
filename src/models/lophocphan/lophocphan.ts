import useInitModel from '@/hooks/useInitModel';
import { ELoaiDangKyTheoLop } from '@/services/DaoTao/DangKyTinChi/constant';
import { getMoodleLopHocPhan } from '@/services/HocTap/LopHocPhan';
import { ELoaiLopHocPhan, ETrangThaiLopHocPhan } from '@/services/HocTap/LopHocPhan/constant';
import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { ipDaoTao } from '@/utils/ip';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<LopHocPhan.IRecord>('lop-hoc-phan', undefined, undefined, ipDaoTao);
	const { getByIdModel, getModel, getAllModel, setLoading, page, limit, getService, setPage, setTotal, setDanhSach } =
		objInit;
	const [danhSachLopDktc, setDanhSachLopDktc] = useState<LopHocPhan.IRecord[]>([]); // Dùng danh sách khác để tránh xung đột do delay

	const sinhVienGetModel = async (params: any): Promise<LopHocPhan.IRecord[]> =>
		params.maHocKy && getModel(params, undefined, undefined, undefined, undefined, 'sinh-vien/page');

	const sinhVienGetAllModel = async (
		params?: Partial<LopHocPhan.IRecord>,
		mergeLopThucHanh?: boolean,
	): Promise<LopHocPhan.IRecord[]> => {
		const lopHp = await getAllModel(undefined, undefined, params, undefined, 'sinh-vien/all');
		if (mergeLopThucHanh === false) return lopHp;

		const lopChaObj = lopHp
			.filter((i) => !i.tenCha)
			.reduce<Record<string, LopHocPhan.IRecord>>((pre, cur) => {
				pre[cur.ten] = { ...cur, children: cur.children ?? [] };
				return pre;
			}, {});
		lopHp.forEach((lop) => {
			if (lop.tenCha && lopChaObj[lop.tenCha]) lopChaObj[lop.tenCha].children?.push(lop);
		});
		const lopChaList = Object.values(lopChaObj);
		setDanhSach(lopChaList);
		return lopChaList;
	};

	const sinhVienGetByIdModel = async (idLop: string): Promise<LopHocPhan.IRecord> => getByIdModel(`${idLop}/sinh-vien`);

	const sinhVienGetLopDangKyModel = async (
		maHocKy: string,
		loaiDangKyTheoLop: ELoaiDangKyTheoLop,
		maHocPhan: string,
		tatCa: boolean = false,
	): Promise<LopHocPhan.IRecord[]> => {
		setLoading(true);
		const payload = {
			page,
			limit,
			sort: { soThuTuLop: 1 },
			condition: { maHocPhan, loai: ELoaiLopHocPhan.CHINH, trangThaiLop: ETrangThaiLopHocPhan.MO },
		};

		try {
			const response = await getService(
				payload,
				`dang-ky-tin-chi/sinh-vien/lop-hoc-phan/hoc-ky/${maHocKy}/loai/${
					loaiDangKyTheoLop === ELoaiDangKyTheoLop.LOP_HANH_CHINH && tatCa ? 'doi-tuong' : loaiDangKyTheoLop
				}/page`,
				true,
			);
			const tempData: LopHocPhan.IRecord[] = response?.data?.data?.result ?? [];
			const tempTotal: number = response?.data?.data?.total ?? 0;

			if (tempData.length === 0 && tempTotal) {
				const maxPage = Math.ceil(tempTotal / payload.limit) || 1;
				setPage(maxPage);
				return Promise.reject('Invalid page');
			} else {
				setDanhSachLopDktc(tempData);
				setTotal(tempTotal);
				return tempData;
			}
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};

	const getMoodleLopHocPhanModel = async (lopHocPhanId: string): Promise<any> => {
		setLoading(true);

		try {
			const res = await getMoodleLopHocPhan(lopHocPhanId);

			return res.data?.data;
		} catch (error) {
			return Promise.reject(error);
		} finally {
			setLoading(false);
		}
	};

	return {
		...objInit,
		danhSachLopDktc,
		sinhVienGetModel,
		sinhVienGetByIdModel,
		sinhVienGetAllModel,
		getMoodleLopHocPhanModel,
		sinhVienGetLopDangKyModel,
	};
};
