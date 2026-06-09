import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import ModalHocPhan from '@/pages/DaoTao/DeCuongHocPhan/ModalHocPhan';
import { ELoaiDangKyTheoLop } from '@/services/DaoTao/DangKyTinChi/constant';
import type { HocPhan } from '@/services/DaoTao/HocPhan/typings';
import { Divider } from 'antd';
import React, { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import SplitPane from 'react-split-pane';
import Pane from 'react-split-pane/lib/Pane';
import { useIntl, useModel } from 'umi';

const FilterHocPhanDKTC = (props: { children: React.ReactNode }) => {
	const intl = useIntl();

	const { khoaNganhMe, getKhoaNganhMeModel } = useModel('sinhvien.sinhvien');
	const {
		record: recHocPhan,
		setRecord: setHocPhan,
		page,
		limit,
		getHocPhanDKHPModel,
		loaiDangKy,
		setLoaiDangKy,
	} = useModel('hocphan.hocphan');
	const { record: recHocKy } = useModel('daotao.hocky');
	const { danhSachLopDangKy } = useModel('daotao.dotdangkytinchi');
	const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
	const [paneSize, setPaneSize] = useState('350px');
	const allLoaiDangKy = Object.values(ELoaiDangKyTheoLop);
	if (!khoaNganhMe?.khoaNganhPhu?.ma) allLoaiDangKy.splice(-2, 1);
	const danhSachMaHpDangKy = danhSachLopDangKy.map((item) => item.maHocPhan);
	const [visibleDeCuong, setVisibleDeCuong] = useState<boolean>(false);
	const [deCuongModal, setDeCuongModal] = useState<{ deCuongId: string; title: string } | null>(null);

	const handlePaneSizeChange = (size: any) => setPaneSize(size[0]);

	const getData = () => recHocKy?.ma && getHocPhanDKHPModel(recHocKy.ma).then((res) => setHocPhan(res?.[0]));

	useEffect(() => {
		getKhoaNganhMeModel();

		return () => {
			setHocPhan(undefined);
		};
	}, []);

	const handleXemDeCuong = (maHocPhan: string, tenHocPhan?: string) => {
		setDeCuongModal({
			deCuongId: maHocPhan,
			title: `${intl.formatMessage({ id: 'lophocphan.id.decuong.title' })} - ${tenHocPhan || maHocPhan || ''}`,
		});
		setVisibleDeCuong(true);
	};

	const onCell = (rec: HocPhan.IRecord) => ({
		onClick: () => setHocPhan(rec),
		style: {
			cursor: 'pointer',
			fontWeight: rec.ma === recHocPhan?.ma ? 600 : undefined,
			backgroundColor: rec.ma === recHocPhan?.ma ? '#f0f0f0' : undefined,
			// color: rec.trangThai !== ETrangThaiHocPhanDangKyTinChi.DUOC_DK ? '#cc0101' : undefined,
			color: danhSachMaHpDangKy.includes(rec.ma) ? 'var(--ant-info-color)' : undefined,
		},
	});

	const columns: IColumn<HocPhan.IRecord & { index: number }>[] = [
		{
			title: intl.formatMessage({ id: 'dangkytinchi.dankylophocphan.filterhocphan.columntable.thutu' }),
			dataIndex: 'index',
			width: 60,
			align: 'center',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'dangkytinchi.dankylophocphan.filterhocphan.columntable.mahp' }),
			dataIndex: 'ma',
			width: 110,
			align: 'center',
			filterType: 'string',
			render: (val, rec) => {
				return (
					<a
						onClick={(e) => {
							e.stopPropagation();
							handleXemDeCuong(val, rec?.ten);
						}}
					>
						{val}
					</a>
				);
			},
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'dangkytinchi.dankylophocphan.filterhocphan.columntable.tenhocphan' }),
			dataIndex: 'ten',
			width: 200,
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'dangkytinchi.dankylophocphan.filterhocphan.columntable.sotinchi' }),
			dataIndex: 'soTinChi',
			width: 60,
			align: 'center',
			onCell,
			// render: (val, rec) => (
			// 	<>
			// 		{val} {rec?.isTinhSoTinChi === false ? <i>(không tính)</i> : null}
			// 	</>
			// ),
		},
	];

	return (
		<>
			<Divider style={{ margin: '8px 0' }} />

			<SplitPane split={isMobile ? 'horizontal' : 'vertical'} onChange={handlePaneSizeChange} style={{ marginTop: 12 }}>
				<Pane initialSize={paneSize} minSize='250px' maxSize='50%'>
					<TableBase
						columns={columns}
						dependencies={[page, limit, loaiDangKy, recHocKy?.ma]}
						getData={getData}
						modelName='hocphan.hocphan'
						hideCard
						buttons={{ create: false, reload: false, filter: false }}
						hideTotal
						addStt={false}
					/>
				</Pane>

				<Pane>{props.children}</Pane>
			</SplitPane>

			{deCuongModal && (
				<ModalHocPhan
					visible={visibleDeCuong}
					setVisible={setVisibleDeCuong}
					deCuongId={deCuongModal.deCuongId}
					title={deCuongModal.title}
				/>
			)}
		</>
	);
};

export default FilterHocPhanDKTC;
