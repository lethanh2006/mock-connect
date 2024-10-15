import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import ModalChiTiet from '@/pages/CongTacSinhVien/HoatDongCTSV/ModalChiTiet';
import { ELoaiThongTinXemSau, mapLoaiThongTinXemSau } from '@/services/TienIch/XemSau/constant';
import type { XemSau } from '@/services/TienIch/XemSau/typing';
import { CloseOutlined, EyeOutlined } from '@ant-design/icons';
import { Card, Popconfirm, Tabs } from 'antd';
import { useState } from 'react';
import { history, useModel } from 'umi';

const XemSauPage = () => {
	const { getModel, page, limit, deleteModel } = useModel('tienich.xemsau');
	const { setVisibleForm, setRecord } = useModel('sukien.sinhvienhoatdongctsv');
	const [tabActive, setTabActive] = useState<ELoaiThongTinXemSau>(ELoaiThongTinXemSau.SU_KIEN);

	const xemChiTiet = (rec: XemSau.IRecord) => {
		if (tabActive === ELoaiThongTinXemSau.SU_KIEN) {
			setRecord(rec?.thongTin);
			setVisibleForm(true);
		} else if (tabActive === ELoaiThongTinXemSau.TIN_TUC) {
			history.push({
				pathname: 'tin-tuc/chi-tiet',
				query: rec?.idChuDe ? { _id: rec?.sourceId, cat: rec?.idChuDe } : { id: rec?.sourceId },
			});
		} else if (tabActive === ELoaiThongTinXemSau.VBHD) {
			window.open(rec?.thongTin?.url, '_blank');
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
			title: 'Nội dung',
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
			title: 'Thao tác',
			align: 'center',
			width: 60,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<Popconfirm
						onConfirm={() => deleteModel(rec?._id, getData)}
						title='Bạn có chắc chắn muốn bỏ lưu thông tin này?'
						placement='topRight'
					>
						<ButtonExtend tooltip='Bỏ lưu' type='link' danger icon={<CloseOutlined />} />
					</Popconfirm>
					<ButtonExtend
						tooltip='Xem'
						type='link'
						icon={<EyeOutlined />}
						onClick={() => {
							xemChiTiet(rec);
						}}
					/>
				</>
			),
		},
	];

	return (
		<Card title='Danh sách xem sau'>
			<Tabs activeKey={tabActive} onChange={(tab) => setTabActive(tab as ELoaiThongTinXemSau)}>
				{Object.values(ELoaiThongTinXemSau).map((item) => (
					<Tabs.TabPane tab={mapLoaiThongTinXemSau[item]} key={item} />
				))}
			</Tabs>

			<TableBase
				getData={getData}
				dependencies={[page, limit, tabActive]}
				title='Danh sách xem sau'
				columns={columns}
				modelName='tienich.xemsau'
				rowSelection
				deleteMany
				buttons={{ create: false }}
				hideCard
			/>

			<ModalChiTiet />
		</Card>
	);
};

export default XemSauPage;
