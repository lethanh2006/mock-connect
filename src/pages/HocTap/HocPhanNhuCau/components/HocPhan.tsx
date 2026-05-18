import type { ChuongTrinhDaoTao } from '@/services/DaoTao/ChuongTrinhDaoTao/typing';
import type { HocPhan } from '@/services/DaoTao/HocPhan/typings';
import { Segmented, Space, Spin, Tag } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import HocPhanNgoaiCTDT from './HocPhan/NgoaiCTDT';
import HocPhanTrongCTDT from './HocPhan/TrongCTDT';

const HocPhanCTDT = () => {
	const intl = useIntl();
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
		setLoadingTrong(true);
		try {
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
					rec?.danhSachHocPhanDungTienTrinh?.map((item: any) => ({
						...item,
						loai: intl.formatMessage({ id: 'hocphannhucau.hocphan.loai.dungTienTrinh' }),
					})) || [];

				const danhSachHocPhanCtdt =
					rec?.danhSachHocPhanCtdt?.map((item: any) => ({
						...item,
						loai: intl.formatMessage({ id: 'hocphannhucau.hocphan.loai.trongChuongTrinh' }),
					})) || [];

				setDanhSachTrong({
					danhSachHocPhanDungTienTrinh: _.uniqBy(danhSachHocPhanDungTienTrinh, 'maHocPhan') as any,
					danhSachHocPhanCtdt: _.uniqBy(danhSachHocPhanCtdt, 'maHocPhan') as any,
				});
			} else {
				setDanhSachTrong({
					danhSachHocPhanDungTienTrinh: [],
					danhSachHocPhanCtdt: [],
				});
			}
		} catch (error) {
			console.error(error);
			setDanhSachTrong({ danhSachHocPhanDungTienTrinh: [], danhSachHocPhanCtdt: [] });
		} finally {
			setLoadingTrong(false);
		}
	};

	const getDataNgoaiCTDT = async () => {
		setLoadingNgoai(true);
		try {
			const rec = await getAllModel(
				undefined,
				undefined,
				undefined,
				undefined,
				`khoa-nganh/${maKhoaNganh}/hoc-ky/${recHocKy?.ma}/me/ngoai-ctdt`,
				false,
			);
			setDanhSachNgoai(_.uniqBy(rec, 'ma') as any);
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
		const idsFromDanhSach = danhSach?.map((i) => i.maHocPhan).filter(Boolean) || [];
		const idsFromTrong =
			(danhSachTrong?.danhSachHocPhanDungTienTrinh ?? []).flatMap((i) => [
				i.maHocPhan,
				...(i.hocPhanCtdtList?.map((hp) => hp.maHocPhan) || []),
			]) || [];

		setSelectedIds(idsFromDanhSach.length ? idsFromDanhSach : idsFromTrong);
	}, [JSON.stringify(danhSach), JSON.stringify(danhSachTrong)]);

	const flattenHocPhan = (list: ChuongTrinhDaoTao.IKhoiHocPhanCTDT[] = []) =>
		list?.flatMap((item) => [item?.maHocPhan, ...(item?.hocPhanCtdtList?.map((hp) => hp?.maHocPhan) || [])]);

	const maHocPhanTrong = [
		...flattenHocPhan(danhSachTrong?.danhSachHocPhanCtdt),
		...flattenHocPhan(danhSachTrong?.danhSachHocPhanDungTienTrinh),
	];

	const filteredDanhSachNgoai = danhSachNgoai?.filter((item) => !maHocPhanTrong?.includes(item?.ma));

	const danhSachDungTienTrinhMaHocPhan = flattenHocPhan(danhSachTrong?.danhSachHocPhanDungTienTrinh);
	const danhSachCtdtMaHocPhan = flattenHocPhan(danhSachTrong?.danhSachHocPhanCtdt);

	const soHocPhanDungTienTrinh = selectedIds?.filter((id) => danhSachDungTienTrinhMaHocPhan?.includes(id))?.length || 0;
	const soHocPhanNgoaiTienTrinh =
		selectedIds?.filter((id) => !danhSachDungTienTrinhMaHocPhan?.includes(id) && danhSachCtdtMaHocPhan?.includes(id))
			?.length || 0;
	const soHocPhanKhac =
		selectedIds?.filter((id) => filteredDanhSachNgoai?.some((item) => item?.ma === id))?.length || 0;

	const filteredDanhSachTrong = [
		...(danhSachTrong?.danhSachHocPhanDungTienTrinh ?? []),
		...(danhSachTrong?.danhSachHocPhanCtdt ?? []),
	].flatMap((item) => [item, ...(item?.hocPhanCtdtList || [])]);

	const renderButton = [
		<Segmented
			key='segmented'
			value={segment}
			onChange={(val) => setSegment(val.toString())}
			options={[
				{ value: '1', label: intl.formatMessage({ id: 'hocphannhucau.segment.theoTienTrinhHoc' }) },
				{ value: '2', label: intl.formatMessage({ id: 'hocphannhucau.segment.hocPhanKhac' }) },
			]}
		/>,
	];

	return (
		<Spin spinning={loadingTrong || loadingNgoai}>
			{selectedIds?.length ? (
				<div style={{ marginBottom: 12 }}>
					<i>
						{intl.formatMessage(
							{ id: 'hocphannhucau.hocphan.daChon' },
							{
								count: selectedIds?.length ?? 0,
								dungTT: soHocPhanDungTienTrinh,
								khac: soHocPhanNgoaiTienTrinh + soHocPhanKhac,
								b: (chunks) => <b>{chunks}</b>,
							},
						)}
					</i>
				</div>
			) : null}

			<Space style={{ marginBottom: 12, flexWrap: 'wrap', display: 'flex' }}>
				{selectedIds?.map((id) => {
					const itemNgoai = filteredDanhSachNgoai?.find((x) => x?.ma === id);
					const itemTrong = filteredDanhSachTrong?.find((x) => x?.maHocPhan === id);
					const label = itemNgoai?.ten || itemTrong?.hocPhan?.ten || '';
					return (
						<Tag key={id} closable onClose={() => setSelectedIds(selectedIds?.filter((x) => x !== id))}>
							{label}
						</Tag>
					);
				})}
			</Space>

			{segment === '1' ? (
				<HocPhanTrongCTDT data={danhSachTrong as any} danhSachNgoai={danhSachNgoai} otherButtons={renderButton} />
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
