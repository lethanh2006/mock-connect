import type { ChuongTrinhDaoTao } from '@/services/DaoTao/ChuongTrinhDaoTao/typing';
import { ELoaiHocPhanCTDT } from '@/services/DaoTao/constant';
import type { HocPhan } from '@/services/DaoTao/HocPhan/typings';
import { Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import HocPhanNgoaiCTDT from './HocPhan/NgoaiCTDT';
import HocPhanTrongCTDT from './HocPhan/TrongCTDT';

const HocPhanCTDT = (props: { segment: string }) => {
	const { segment } = props;
	const { getAllModel, danhSach } = useModel('sinhvien.nhucauhocphan.sinhvienhocphannhucau');
	const { maKhoaNganh } = useModel('sinhvien.sinhvien');
	const { selectedIds, setSelectedIds } = useModel('hocphan.hocphan');
	const { record: recHocKy } = useModel('daotao.hocky');
	const [loadingTrong, setLoadingTrong] = useState<boolean>(false);
	const [loadingNgoai, setLoadingNgoai] = useState<boolean>(false);
	const [danhSachTrong, setDanhSachTrong] = useState<{
		danhSachHocPhanCtdt: ChuongTrinhDaoTao.IKhoiHocPhanCTDT[];
		danhSachHocPhanDungTienTrinh: ChuongTrinhDaoTao.IKhoiHocPhanCTDT[];
	}>();
	const [danhSachNgoai, setDanhSachNgoai] = useState<HocPhan.IRecord[]>([]);

	const getDataTrongCTDT = async () => {
		try {
			setLoadingTrong(true);
			const rec: any = await getAllModel(
				undefined,
				undefined,
				undefined,
				undefined,
				`khoa-nganh/${maKhoaNganh}/hoc-ky/${recHocKy?.ma}/me/trong-ctdt`,
				false,
			);

			if (rec) {
				const danhSachHocPhanDungTienTrinh =
					rec.danhSachHocPhanDungTienTrinh?.map((item: ChuongTrinhDaoTao.IKhoiHocPhanCTDT) => ({
						...item,
						loai: 'Đúng tiến trình',
					})) || [];

				const danhSachHocPhanCtdt =
					rec.danhSachHocPhanCtdt?.map((item: ChuongTrinhDaoTao.IKhoiHocPhanCTDT) => ({
						...item,
						loai: 'Ngoài tiến trình',
					})) || [];

				setDanhSachTrong({
					danhSachHocPhanDungTienTrinh,
					danhSachHocPhanCtdt,
				});
			} else {
				setDanhSachTrong({
					danhSachHocPhanDungTienTrinh: [],
					danhSachHocPhanCtdt: [],
				});
			}
		} catch (error) {
			console.error(error);
		} finally {
			setLoadingTrong(false);
		}
	};

	const getDataNgoaiCTDT = async () => {
		try {
			setLoadingNgoai(true);
			await getAllModel(
				undefined,
				undefined,
				undefined,
				undefined,
				`khoa-nganh/${maKhoaNganh}/hoc-ky/${recHocKy?.ma}/me/ngoai-ctdt`,
				false,
			).then((rec) => setDanhSachNgoai(rec as any));
		} catch (error) {
			console.error(error);
		} finally {
			setLoadingNgoai(false);
		}
	};

	useEffect(() => {
		Promise.allSettled([getDataTrongCTDT(), getDataNgoaiCTDT()]);
	}, [maKhoaNganh, recHocKy?._id]);

	useEffect(() => {
		if (danhSach?.length !== 0) {
			const autoSelectedIds = danhSach?.map((item) => item.maHocPhan).filter((maHocPhan) => maHocPhan !== null);
			setSelectedIds(autoSelectedIds);
		} else {
			const autoSelectedIds = (danhSachTrong?.danhSachHocPhanDungTienTrinh ?? [])
				?.map((item) => item.maHocPhan)
				.filter((maHocPhan) => maHocPhan !== null);
			setSelectedIds(autoSelectedIds);
		}
	}, [JSON.stringify(danhSach), JSON.stringify(danhSachTrong)]);

	//Lọc ra những học phần nằm trong học phần tự chọn
	const extractHocPhanCtdtListMaHocPhan = (danhSachHocPhan: any[]) => {
		return danhSachHocPhan.flatMap((item: any) => {
			if (item.loaiHocPhanCtdt === ELoaiHocPhanCTDT.TU_CHON && Array.isArray(item.hocPhanCtdtList)) {
				return item.hocPhanCtdtList.map((hocPhan: any) => hocPhan.maHocPhan);
			}
			return [];
		});
	};

	const danhSachHocPhanCtdtListMaHocPhan = [
		...extractHocPhanCtdtListMaHocPhan(danhSachTrong?.danhSachHocPhanCtdt ?? []),
		...extractHocPhanCtdtListMaHocPhan(danhSachTrong?.danhSachHocPhanDungTienTrinh ?? []),
	];

	const filteredDanhSachNgoai = danhSachNgoai.filter(
		(item: any) => !danhSachHocPhanCtdtListMaHocPhan.includes(item.ma),
	);

	//Thống kê các học phần đã đăng ký
	const extractMaHocPhan = (danhSachs: any) =>
		danhSachs.flatMap((item: any) => {
			if (item.loaiHocPhanCtdt === ELoaiHocPhanCTDT.TU_CHON && Array.isArray(item.hocPhanCtdtList)) {
				return item.hocPhanCtdtList.map((hocPhan: any) => hocPhan.maHocPhan);
			}
			return item.maHocPhan ? [item.maHocPhan] : [];
		});

	const danhSachDungTienTrinhMaHocPhan = extractMaHocPhan(danhSachTrong?.danhSachHocPhanDungTienTrinh ?? []);

	const danhSachCtdtMaHocPhan = extractMaHocPhan(danhSachTrong?.danhSachHocPhanCtdt ?? []);

	const soHocPhanDungTienTrinh = selectedIds?.filter((id) => danhSachDungTienTrinhMaHocPhan.includes(id))?.length ?? 0;

	const soHocPhanNgoaiTienTrinh =
		selectedIds?.filter((id) => !danhSachDungTienTrinhMaHocPhan.includes(id) && danhSachCtdtMaHocPhan.includes(id))
			?.length ?? 0;

	const soHocPhanKhac = selectedIds?.filter((id) => filteredDanhSachNgoai?.some((item) => item.ma === id))?.length ?? 0;

	return (
		<Spin spinning={loadingTrong || loadingNgoai}>
			{selectedIds?.length ? (
				<div style={{ marginBottom: 12 }}>
					<i>
						Bạn đã đăng ký <b>{selectedIds?.length}</b> học phần, trong đó có{' '}
						<b>{soHocPhanDungTienTrinh + soHocPhanNgoaiTienTrinh}</b> HP theo tiến trình và <b>{soHocPhanKhac}</b> HP
						khác.
					</i>
				</div>
			) : null}

			{segment === '1' ? (
				<HocPhanTrongCTDT data={danhSachTrong as any} />
			) : (
				<HocPhanNgoaiCTDT data={filteredDanhSachNgoai} danhSachTrong={danhSachTrong as any} />
			)}
		</Spin>
	);
};

export default HocPhanCTDT;
