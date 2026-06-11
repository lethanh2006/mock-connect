import useInitModel from '@/hooks/useInitModel';
import { ELoaiDangKyTheoLop } from '@/services/DaoTao/DangKyTinChi/constant';
import { ThoiKhoaBieu } from '@/services/DaoTao/ThoiKhoaBieu/typing';
import { getGiaoAnSinhVien, getMoodleLopHocPhan, postWithdraw } from '@/services/HocTap/LopHocPhan';
import { ELoaiLopHocPhan, ETrangThaiLopHocPhan } from '@/services/HocTap/LopHocPhan/constant';
import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import dayjs from '@/utils/dayjs';
import { ipDaoTao } from '@/utils/ip';
import { message } from 'antd';
import _ from 'lodash';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<LopHocPhan.IRecord>('lop-hoc-phan', undefined, undefined, ipDaoTao);
	const {
		getByIdModel,
		getModel,
		getAllModel,
		setLoading,
		page,
		limit,
		getService,
		setPage,
		setTotal,
		setDanhSach,
		setFormSubmiting,
		formSubmiting,
	} = objInit;
	const [danhSachLopDktc, setDanhSachLopDktc] = useState<LopHocPhan.IRecord[]>([]);
	const [lopHienTai, setLopHienTai] = useState<LopHocPhan.IRecord>();
	const [lopKeTiep, setLopKeTiep] = useState<LopHocPhan.IRecord>();

	/**
	 * Tính buổi học hiện tại/tiếp theo gần nhất của lớp học phần
	 * @param lop
	 * @returns
	 */
	const calculateNearestBuoiLop = (lop: LopHocPhan.IRecord): ThoiKhoaBieu.IRecord | undefined => {
		const tkbList = [
			...(lop.thoiKhoaBieuList ?? []),
			...(lop.lopGhepTkb?.thoiKhoaBieuList ?? []),
			...(lop.children?.flatMap((i) => i.thoiKhoaBieuList ?? []) ?? []),
		];

		const now = dayjs();
		const sortedTkb = _.sortBy(tkbList, (i) => i.thoiGianBatDau);
		const nearest = sortedTkb.find((i) => dayjs(i.thoiGianKetThuc).isAfter(now)) ?? undefined;

		return nearest;
	};

	const calculateNearestLop = (lopList: LopHocPhan.IRecord[]): void => {
		type TData = LopHocPhan.IRecord & { tkbGanNhat?: ThoiKhoaBieu.IRecord };
		let newLopList: TData[] = lopList.map((i) => ({
			...i,
			tkbGanNhat: calculateNearestBuoiLop(i),
		}));

		// Sắp xếp theo thời gian bắt đầu gần nhất
		newLopList = _.sortBy(newLopList, (i: TData) => i.tkbGanNhat?.thoiGianBatDau);

		const now = dayjs();
		let lopHienTai: TData | undefined;
		let lopKeTiep: TData | undefined;

		for (let i = 0; i < newLopList.length; i++) {
			const lop = newLopList[i];
			if (!lop.tkbGanNhat?.thoiGianBatDau || !lop.tkbGanNhat?.thoiGianKetThuc) continue;

			if (now.isSameOrAfter(lop.tkbGanNhat?.thoiGianBatDau) && now.isBefore(lop.tkbGanNhat?.thoiGianKetThuc)) {
				lopHienTai = lop;
			} else if (!lopKeTiep && now.isBefore(lop.tkbGanNhat?.thoiGianBatDau)) {
				lopKeTiep = lop;
			}
		}

		setLopHienTai(lopHienTai);
		setLopKeTiep(lopKeTiep);

		newLopList = _.sortBy(newLopList, (i) => {
			if (i === lopHienTai) return 0;
			if (i === lopKeTiep) return 1;
			return 2;
		});

		setDanhSach(newLopList);
	};

	const sinhVienGetModel = async (params: any, mergeLopThucHanh?: boolean): Promise<LopHocPhan.IRecord[]> => {
		if (!params?.maHocKy) return [];

		try {
			const lopHp = await getModel(params, undefined, undefined, undefined, 50, 'sinh-vien/page');

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

			// Gộp thống kê điểm danh + bài tập + bài đăng từ lớp con lên lớp cha
			lopChaList.forEach((cha) => {
				const children = cha.children ?? [];

				const sum = <T extends number>(getter: (i: LopHocPhan.IRecord) => T | undefined) =>
					children.reduce((acc, item) => acc + (getter(item) ?? 0), 0);

				// Danh sách toàn bộ trường trong thongKeDiemDanhLhp cần cộng
				const diemDanhFields: (keyof NonNullable<LopHocPhan.IRecord['thongKeDiemDanhLhp']>)[] = [
					'soBuoi',
					'soBuoiDaDiemDanh',
					'soBuoiChuaDiemDanh',
					'coMat',
					'vangCoPhep',
					'monVeSom',
					'vangKhongPhep',
				];

				cha.thongKeDiemDanhLhp = cha.thongKeDiemDanhLhp ?? {};

				diemDanhFields.forEach((field) => {
					cha.thongKeDiemDanhLhp![field] =
						(cha.thongKeDiemDanhLhp![field] ?? 0) +
						children.reduce((acc, child) => acc + (child.thongKeDiemDanhLhp?.[field] ?? 0), 0);
				});

				cha.soBaiTap = (cha.soBaiTap ?? 0) + sum((c) => c.soBaiTap);
				cha.soBaiDang = (cha.soBaiDang ?? 0) + sum((c) => c.soBaiDang);
			});

			setDanhSach(lopChaList);

			// Calculate nearest Lớp => setState
			calculateNearestLop(lopChaList);

			return lopChaList;
		} catch (error) {
			console.error('Lỗi khi gọi sinhVienGetModel:', error);
			return [];
		}
	};

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

		// Calculate nearest Lớp => setState
		calculateNearestLop(lopChaList);

		return lopChaList;
	};

	const sinhVienGetByIdModel = async (idLop: string): Promise<LopHocPhan.IRecord> => getByIdModel(`${idLop}/sinh-vien`);

	const sinhVienGetLopDangKyModel = async (
		maHocKy: string,
		loaiDangKyTheoLop: ELoaiDangKyTheoLop,
		maHocPhan: string,
		tatCa: boolean = false,
		otherQuery?: any,
	): Promise<LopHocPhan.IRecord[]> => {
		setLoading(true);
		const payload = {
			page,
			limit,
			sort: { soThuTuLop: 1 },
			condition: { maHocPhan, loai: ELoaiLopHocPhan.CHINH, trangThaiLop: ETrangThaiLopHocPhan.MO },
			otherQuery,
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

	const getGiaoAnSinhVienModel = async (lopHocPhanId: string): Promise<any> => {
		setLoading(true);

		try {
			const res = await getGiaoAnSinhVien(lopHocPhanId);

			return res.data?.data;
		} catch (error) {
			return Promise.reject(error);
		} finally {
			setLoading(false);
		}
	};

	const postWithdrawModel = async (payload: { lopHpSvId: string }): Promise<any> => {
		if (formSubmiting) return Promise.reject('Form submiting');
		setFormSubmiting(true);
		try {
			const res = await postWithdraw(payload);
			message.success('Lưu thành công');

			return res.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setFormSubmiting(false);
		}
	};

	return {
		...objInit,
		danhSachLopDktc,
		lopHienTai,
		lopKeTiep,
		sinhVienGetModel,
		sinhVienGetByIdModel,
		sinhVienGetAllModel,
		getMoodleLopHocPhanModel,
		sinhVienGetLopDangKyModel,
		calculateNearestBuoiLop,
		postWithdrawModel,
		getGiaoAnSinhVienModel,
	};
};
