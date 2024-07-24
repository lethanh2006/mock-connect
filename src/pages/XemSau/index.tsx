import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import { ELoaiThongTinXemSau, mapLoaiThongTinXemSau } from '@/services/XemSau/constant';
import type { XemSau } from '@/services/XemSau/typing';
import { CloseOutlined, EyeOutlined } from '@ant-design/icons';
import { Card, Popconfirm, Tabs } from 'antd';
import { useState } from 'react';
import { useModel, history } from 'umi';
import ModalChiTiet from '../SuKien/SinhVienHoatDongCTSV/ModalChiTiet';

const XemSauPage = () => {
	const { getModel, page, limit, deleteModel } = useModel('xemsau');
	const { setVisibleForm, setRecord } = useModel('sukien.sinhvienhoatdongctsv');
	const [tabActive, setTabActive] = useState<ELoaiThongTinXemSau>(ELoaiThongTinXemSau.SU_KIEN);

	const getData = () =>
		tabActive && getModel({ loaiThongTin: tabActive }, undefined, undefined, undefined, undefined, 'me');

	const columns: IColumn<XemSau.IRecord>[] = [
		{
			title: 'Nội dung',
			dataIndex: 'thongTin',
			width: 250,
			render: (val, rec) => {
				if (tabActive === ELoaiThongTinXemSau.TIN_TUC) {
					return rec?.thongTin?.title?.rendered;
				} else if (tabActive === ELoaiThongTinXemSau.VBHD) {
					return rec?.thongTin?.ten;
				} else if (tabActive === ELoaiThongTinXemSau.SU_KIEN) {
					return rec?.thongTin?.hoatDongCtsv?.ten;
				}
			},
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
							if (tabActive === ELoaiThongTinXemSau.SU_KIEN) {
								setRecord(rec?.thongTin);
								setVisibleForm(true);
							} else if (tabActive === ELoaiThongTinXemSau.TIN_TUC) {
								history.push({
									pathname: 'tin-tuc/chi-tiet',
									query: { id: rec?.sourceId as any },
								});
							} else if (tabActive === ELoaiThongTinXemSau.VBHD) {
								window.open(rec?.thongTin?.url, '_blank');
							}
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
				modelName='xemsau'
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
