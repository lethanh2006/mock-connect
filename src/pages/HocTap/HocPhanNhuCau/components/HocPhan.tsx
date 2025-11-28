import type { ChuongTrinhDaoTao } from '@/services/DaoTao/ChuongTrinhDaoTao/typing';
import { ELoaiHocPhanCTDT } from '@/services/DaoTao/constant';
import type { HocPhan } from '@/services/DaoTao/HocPhan/typings';
import { Segmented, Space, Spin, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import HocPhanNgoaiCTDT from './HocPhan/NgoaiCTDT';
import HocPhanTrongCTDT from './HocPhan/TrongCTDT';

const HocPhanCTDT = () => {
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
	const [segment, setSegment] = useState<string>('1');

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
						loai: 'Trong chương trình',
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

	const filteredDanhSachTrong = [
		...(danhSachTrong?.danhSachHocPhanCtdt ?? []),
		...(danhSachTrong?.danhSachHocPhanDungTienTrinh ?? []).filter(
			(itemCtdt) =>
				!danhSachTrong?.danhSachHocPhanDungTienTrinh?.some((itemDungTien) => itemDungTien._id === itemCtdt._id),
		),
	];

	const renderButton = [
		<Segmented
			value={segment}
			onChange={(val) => setSegment(val.toString())}
			options={[
				{ value: '1', label: 'Theo tiến trình học' },
				{ value: '2', label: 'Các học phần khác' },
			]}
		/>,
	];

	return (
		<Spin spinning={loadingTrong || loadingNgoai}>
			{selectedIds?.length ? (
				<div style={{ marginBottom: 12 }}>
					<i>
						Bạn đã đăng ký <b>{selectedIds?.length}</b> học phần, trong đó có <b>{soHocPhanDungTienTrinh}</b> HP đúng
						tiến trình và <b>{soHocPhanNgoaiTienTrinh + soHocPhanKhac}</b> HP khác.
					</i>
				</div>
			) : null}

			<Space style={{ marginBottom: 12, flexWrap: 'wrap', display: 'flex' }}>
				{[
					...(filteredDanhSachNgoai
						?.filter((item) => selectedIds?.includes(item?.ma))
						?.map((item) => ({
							key: item?.ma,
							label: item?.ten ?? '',
						})) ?? []),

					...(filteredDanhSachTrong
						?.filter((item) => selectedIds?.includes(item?.maHocPhan))
						?.map((item) => ({
							key: item?.maHocPhan,
							label: item?.hocPhan?.ten ?? '',
						})) ?? []),
				].map((tag) => (
					<Tag key={tag.key} closable onClose={() => setSelectedIds(selectedIds?.filter((id) => id !== tag.key))}>
						{tag.label}
					</Tag>
				))}
			</Space>

			{segment === '1' ? (
				<HocPhanTrongCTDT
					data={danhSachTrong as any}
					filteredDanhSachNgoai={filteredDanhSachNgoai}
					otherButtons={renderButton}
				/>
			) : (
				<HocPhanNgoaiCTDT
					data={filteredDanhSachNgoai}
					danhSachTrong={danhSachTrong as any}
					otherButtons={renderButton}
				/>
			)}
		</Spin>
	);
};

export default HocPhanCTDT;
