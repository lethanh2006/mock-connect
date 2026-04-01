import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import ModalHocPhan from '@/pages/DaoTao/DeCuongHocPhan/ModalHocPhan';
import { ETrangThaiDuyetLoTrinh } from '@/services/DaoTao/ChuongTrinhDaoTao/constant';
import { type ChuongTrinhDaoTao } from '@/services/DaoTao/ChuongTrinhDaoTao/typing';
import { ELoaiHocPhanCTDT } from '@/services/DaoTao/constant';
import { Button, Card, Checkbox, Tag } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';

interface PathwayCardProps {
	pathway: ChuongTrinhDaoTao.IKhoiKienThuc | null;
	onSuccess?: () => void;
}

const PathwayCard = ({ pathway, onSuccess }: PathwayCardProps) => {
	const intl = useIntl();
	const { maKhoaNganh } = useModel('sinhvien.sinhvien');
	const { currentKhoiLuaChonMa, handleSelectPathway, formSubmiting, registeredPathway } = useModel('sinhvien.pathway');
	const { record: recLoTrinh } = useModel('sinhvien.lotrinhhoctap');
	const [visibleDeCuong, setVisibleDeCuong] = useState(false);
	const [deCuongModal, setDeCuongModal] = useState<{ deCuongId: string; title: string } | null>(null);

	const ngoaiThoiGian =
		recLoTrinh?.dotDangKyPathway?.kichHoat === false ||
		!recLoTrinh?.dotDangKyPathway?.thoiGianBatDau ||
		!recLoTrinh?.dotDangKyPathway?.thoiGianKetThuc ||
		dayjs().isBefore(recLoTrinh?.dotDangKyPathway?.thoiGianBatDau) ||
		dayjs().isAfter(recLoTrinh?.dotDangKyPathway?.thoiGianKetThuc);

	const isChosen = pathway ? registeredPathway?.maKhoiKienThuc === pathway.ma : false;
	const hasRegisteredPathway = !!registeredPathway?.maKhoiKienThuc;

	if (!pathway) {
		return (
			<Card>
				<div style={{ textAlign: 'center', padding: 40 }}>
					{intl.formatMessage({ id: 'pathway.empty.selectPathway' })}
				</div>
			</Card>
		);
	}

	const transformedData = (pathway.khoiHpCtList || []).map((item) => ({
		...item,
		maHocPhan: item.hocPhan?.ma || '-',
		tenHocPhan: item.hocPhan?.ten || item.ten || '-',
		soTinChi: item.hocPhan?.soTinChi || item.soTinChiTuChonPhaiHoc || 0,
		soThuTuKy: item.soThuTuKy ?? 0,
	}));

	const totalCredits = transformedData.reduce((sum, item) => {
		return sum + item.soTinChi;
	}, 0);

	const handleChoosePathway = async () => {
		if (!handleSelectPathway || !maKhoaNganh || !currentKhoiLuaChonMa || !pathway.ma) {
			return;
		}

		await handleSelectPathway(
			{
				maKhoaNganh,
				maKhoiCha: currentKhoiLuaChonMa,
				maKhoiCon: pathway.ma,
				dotDangKyPathwayId: recLoTrinh?.dotDangKyPathwayId ?? '',
			},
			{
				errorIncomplete: intl.formatMessage({ id: 'pathway.error.incomplete' }),
				successChoose: intl.formatMessage({ id: 'pathway.success.choose' }),
				errorChoose: intl.formatMessage({ id: 'pathway.error.choose' }),
			},
			onSuccess,
		);
	};

	const handleXemDeCuong = (record: ChuongTrinhDaoTao.IKhoiHocPhanCTDT) => {
		const deCuongId = record.hocPhan?.ma ?? '';
		if (!deCuongId) return;
		setDeCuongModal({
			deCuongId,
			title: `${intl.formatMessage({ id: 'lophocphan.id.decuong.title' })} - ${
				record.hocPhan?.ten || record.maHocPhan || ''
			}`,
		});
		setVisibleDeCuong(true);
	};

	const dataTuChon = pathway.khoiHpCtList?.filter((item) => item.loaiHocPhanCtdt === ELoaiHocPhanCTDT.TU_CHON);
	const dataBatBuoc = pathway.khoiHpCtList?.filter((item) => item.loaiHocPhanCtdt === ELoaiHocPhanCTDT.BAT_BUOC);
	const dataTotNghiep = pathway.khoiHpCtList?.filter((item) => item.loaiHocPhanCtdt === ELoaiHocPhanCTDT.TOT_NGHIEP);

	const columns: IColumn<ChuongTrinhDaoTao.IKhoiHocPhanCTDT>[] = [
		{
			title: intl.formatMessage({ id: 'pathway.table.code' }),
			dataIndex: ['hocPhan', 'ma'],
			width: 80,
			filterType: 'string',
			align: 'center',
			render: (val, rec) => <a onClick={() => handleXemDeCuong(rec)}>{val}</a>,
		},
		{
			title: intl.formatMessage({ id: 'pathway.table.courseTitle' }),
			width: 180,
			dataIndex: ['hocPhan', 'ten'],
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'pathway.table.credits' }),
			width: 80,
			render: (val, rec) => rec.hocPhan?.soTinChi,
			align: 'center',
		},
		{
			title: intl.formatMessage({ id: 'pathway.table.hkkehoach' }),
			width: 80,
			dataIndex: 'soThuTuKyKeHoach',
			align: 'center',
			sortable: true,
		},
		{
			title: intl.formatMessage({ id: 'pathway.table.hkthucte' }),
			width: 80,
			dataIndex: 'soThuTuKy',
			align: 'center',
			sortable: true,
		},
		{
			title: intl.formatMessage({ id: 'pathway.table.tichluy' }),
			width: 80,
			align: 'center',
			render: (val, rec) => <Checkbox checked={rec.hocPhan?.loaiHocPhan?.isTinhSoTinChiTichLuy} />,
		},
	];

	const columnsTuChon: IColumn<ChuongTrinhDaoTao.IKhoiHocPhanCTDT>[] = [
		{
			title: intl.formatMessage({ id: 'pathway.table.khoihp' }),
			width: 180,
			dataIndex: 'ten',
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'pathway.table.hp' }),
			width: 60,
			dataIndex: 'soHocPhanTuChonPhaiHoc',
			align: 'center',
		},
		{
			title: intl.formatMessage({ id: 'pathway.table.tc' }),
			width: 60,
			dataIndex: 'soTinChiTuChonPhaiHoc',
			align: 'center',
		},
		{
			title: intl.formatMessage({ id: 'pathway.table.hkkehoach' }),
			width: 80,
			dataIndex: 'soThuTuKyKeHoach',
			align: 'center',
			sortable: true,
		},
		{
			title: intl.formatMessage({ id: 'pathway.table.hkthucte' }),
			width: 80,
			dataIndex: 'soThuTuKy',
			align: 'center',
			sortable: true,
		},
		{
			title: intl.formatMessage({ id: 'pathway.table.tichluy' }),
			width: 80,
			dataIndex: 'isTinhSoTinChiTichLuy',
			align: 'center',
			render: (val) => <Checkbox checked={val} />,
		},
	];

	return (
		<Card
			title={pathway?.ten}
			extra={
				<Tag color='blue'>
					{totalCredits} {intl.formatMessage({ id: 'pathway.card.credits' })}
				</Tag>
			}
			variant='borderless'
			className='card-borderless'
		>
			{dataBatBuoc?.length ? (
				<div style={{ marginTop: 12 }}>
					<TableStaticData
						data={dataBatBuoc}
						addStt
						columns={columns}
						size='small'
						otherProps={{ pagination: false, scroll: { y: 350 } }}
						otherButtons={[<div className='fw500'>{intl.formatMessage({ id: 'pathway.ds.hpbatbuoc' })}</div>]}
					/>
				</div>
			) : null}
			{dataTuChon?.length ? (
				<div style={{ marginTop: 12 }}>
					<TableStaticData
						data={dataTuChon}
						addStt
						columns={columnsTuChon}
						size='small'
						otherProps={{ pagination: false, scroll: { y: 350 } }}
						otherButtons={[<div className='fw500'>{intl.formatMessage({ id: 'pathway.ds.hptuchon' })}</div>]}
					/>
				</div>
			) : null}
			{dataTotNghiep?.length ? (
				<div style={{ marginTop: 12 }}>
					<TableStaticData
						data={dataTotNghiep}
						addStt
						columns={columnsTuChon}
						size='small'
						otherProps={{ pagination: false, scroll: { y: 350 } }}
						otherButtons={[<div className='fw500'>{intl.formatMessage({ id: 'pathway.ds.hptotnghiep' })}</div>]}
					/>
				</div>
			) : null}

			<div className='form-footer'>
				{!(
					(hasRegisteredPathway && recLoTrinh?.trangThaiDuyet !== ETrangThaiDuyetLoTrinh.YEU_CAU_CHINH_SUA) ||
					isChosen ||
					ngoaiThoiGian
				) && (
					<Button type='primary' loading={formSubmiting} onClick={handleChoosePathway}>
						{intl.formatMessage({ id: 'pathway.button.choose' })}
					</Button>
				)}
			</div>

			{deCuongModal && (
				<ModalHocPhan
					visible={visibleDeCuong}
					setVisible={setVisibleDeCuong}
					deCuongId={deCuongModal.deCuongId}
					title={deCuongModal.title}
				/>
			)}
		</Card>
	);
};

export default PathwayCard;
