import type { ChuongTrinhDaoTao } from '@/services/DaoTao/ChuongTrinhDaoTao/typing';
import type { HocPhan } from '@/services/DaoTao/HocPhan/typings';
import { Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import NgoaiCTDT from './HocPhan/NgoaiCTDT';
import TrongCTDT from './HocPhan/TrongCTDT';

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
			await getAllModel(
				undefined,
				undefined,
				undefined,
				undefined,
				`khoa-nganh/${maKhoaNganh}/hoc-ky/${recHocKy?.ma}/me/trong-ctdt`,
				false,
			).then((res) => setDanhSachTrong(res as any));
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
				`khoa-nganh/${maKhoaNganh}/me/ngoai-ctdt`,
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
			const autoSelectedIds = danhSach?.map((item) => item.maHocPhan);
			setSelectedIds(autoSelectedIds);
		} else {
			const autoSelectedIds = (danhSachTrong?.danhSachHocPhanDungTienTrinh ?? [])?.map((item) => item.maHocPhan);
			setSelectedIds(autoSelectedIds);
		}
	}, [JSON.stringify(danhSach), JSON.stringify(danhSachTrong)]);

	const soHocPhanDungTienTrinh = selectedIds?.filter((id) =>
		danhSachTrong?.danhSachHocPhanDungTienTrinh?.some((item) => item.maHocPhan === id),
	).length;

	const soHocPhanNgoaiTienTrinh = selectedIds?.filter(
		(id) =>
			!danhSachTrong?.danhSachHocPhanDungTienTrinh?.some((item) => item.maHocPhan === id) &&
			!danhSachTrong?.danhSachHocPhanCtdt?.some((item) => item.maHocPhan === id),
	).length;

	const soHocPhanNgoaiCTDT = selectedIds?.filter((id) => danhSachNgoai?.some((item) => item.ma === id)).length;

	return (
		<Spin spinning={loadingTrong || loadingNgoai}>
			{selectedIds?.length ? (
				<i style={{ marginBottom: 8 }}>
					Bạn đã đăng ký <b>{selectedIds?.length ?? 0}</b> học phần, trong đó có <b>{soHocPhanDungTienTrinh ?? 0}</b> HP
					đúng tiến trình, <b>{soHocPhanNgoaiTienTrinh ?? 0}</b> HP ngoài tiến trình và <b>{soHocPhanNgoaiCTDT ?? 0}</b>{' '}
					học phần ngoài CTĐT.
				</i>
			) : null}

			{segment === '1' ? (
				<TrongCTDT data={danhSachTrong as any} />
			) : (
				<NgoaiCTDT data={danhSachNgoai} danhSachTrong={danhSachTrong as any} />
			)}
		</Spin>
	);
};

export default HocPhanCTDT;
