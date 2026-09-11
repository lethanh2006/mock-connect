import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import { TabViewPage } from '@/components/TabViewPage';
import ModalChiTiet from '@/pages/CongTacSinhVien/HoatDongCTSV/ModalChiTiet';
import { ELoaiThongTinXemSau, mapLoaiThongTinXemSau } from '@/services/TienIch/XemSau/constant';
import type { XemSau } from '@/services/TienIch/XemSau/typing';
import { openSafeUrl } from '@/utils/security';
import { IconXmark, IconEyeOpen } from '@/components/Icons';
import { Card, Popconfirm } from 'antd';
import { useState } from 'react';
import { history, useIntl, useModel } from 'umi';

const XemSauPage = () => {
	const intl = useIntl();
	const { getModel, page, limit, deleteModel } = useModel('tienich.xemsau');
	const { setVisibleForm, setRecord } = useModel('sukien.sinhvienhoatdongctsv');
	const [tabActive, setTabActive] = useState<ELoaiThongTinXemSau>(ELoaiThongTinXemSau.SU_KIEN);

	const xemChiTiet = (rec: XemSau.IRecord) => {
		if (tabActive === ELoaiThongTinXemSau.SU_KIEN) {
			setRecord(rec?.thongTin);
			setVisibleForm(true);
		} else if (tabActive === ELoaiThongTinXemSau.TIN_TUC) {
			history.push({
				pathname: '/tin-tuc/chi-tiet',
				// query: rec?.idChuDe ? { _id: rec?.sourceId, cat: rec?.idChuDe } : { id: rec?.sourceId },
				search: rec?.idChuDe
					? `?_id=${rec?.sourceId}${rec?.idChuDe ? `&cat=${rec?.idChuDe}` : ''}`
					: `?id=${rec?.sourceId}`,
			});
		} else if (tabActive === ELoaiThongTinXemSau.VBHD) {
			openSafeUrl(rec?.thongTin?.url);
		}
	};

	const getData = () =>
		tabActive && getModel({ loaiThongTin: tabActive }, undefined, undefined, undefined, undefined, 'me');

	const onCell = (rec: XemSau.IRecord) => ({
		onClick: () => xemChiTiet(rec),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<XemSau.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'xemsau.noidung' }),
			dataIndex: 'thongTin',
			width: 250,
			render: (val, rec) => {
				if (tabActive === ELoaiThongTinXemSau.TIN_TUC) {
					return rec?.thongTin?.title?.rendered ?? rec?.thongTin?.tieuDe;
				} else if (tabActive === ELoaiThongTinXemSau.VBHD) {
					return rec?.thongTin?.ten;
				} else if (tabActive === ELoaiThongTinXemSau.SU_KIEN) {
					return rec?.thongTin?.hoatDongCtsv?.ten;
				}
			},
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'xemsau.thaotac' }),
			align: 'center',
			width: 60,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<Popconfirm
						onConfirm={() => deleteModel(rec?._id, getData)}
						title={intl.formatMessage({ id: 'xemsau.boluu.place' })}
						placement='topRight'
					>
						<ButtonExtend
							tooltip={intl.formatMessage({ id: 'xemsau.boluu' })}
							type='link'
							danger
							icon={<IconXmark />}
						/>
					</Popconfirm>
					<ButtonExtend
						tooltip={intl.formatMessage({ id: 'xemsau.xem' })}
						type='link'
						icon={<IconEyeOpen />}
						onClick={() => {
							xemChiTiet(rec);
						}}
					/>
				</>
			),
		},
	];

	const menus = Object.values(ELoaiThongTinXemSau)?.map((item) => ({
		title: mapLoaiThongTinXemSau[item],
		menuKey: item,
		content: (
			<TableBase
				getData={getData}
				dependencies={[page, limit]}
				title={intl.formatMessage({ id: 'xemsau.title' })}
				columns={columns}
				modelName='tienich.xemsau'
				rowSelection
				deleteMany
				buttons={{ create: false }}
				hideCard
			/>
		),
	}));

	return (
		<Card
			title={intl.formatMessage({ id: 'xemsau.title' })}
			className='card-big-title card-borderless'
			variant='borderless'
		>
			<Card variant='borderless'>
				<TabViewPage
					hideCard
					menu={menus}
					onChange={(tab) => {
						setTabActive(tab as ELoaiThongTinXemSau);
					}}
				/>

				<ModalChiTiet />
			</Card>
		</Card>
	);
};

export default XemSauPage;
