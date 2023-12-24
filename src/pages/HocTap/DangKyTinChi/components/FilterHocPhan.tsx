import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { ELoaiDangKyTheoLop, loaiDangKyTheoLop } from '@/services/DaoTao/DangKyTinChi/constant';
import type { HocPhan } from '@/services/DaoTao/HocPhan/typings';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Popover, Select, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import SplitPane from 'react-split-pane';
import Pane from 'react-split-pane/lib/Pane';
import { useModel } from 'umi';
import ViewGhiChuDangKyTinChi from './ViewGhiChuDangKyTinChi';

const FilterHocPhanDKTC = (props: { children: React.ReactNode }) => {
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
	const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
	const [paneSize, setPaneSize] = useState('350px');
	const allLoaiDangKy = Object.values(ELoaiDangKyTheoLop);
	if (!khoaNganhMe?.khoaNganhPhu?.ma) allLoaiDangKy.splice(-2, 1);

	const handlePaneSizeChange = (size: any) => setPaneSize(size[0]);

	const getData = () => recHocKy?.ma && getHocPhanDKHPModel(recHocKy.ma).then((res) => setHocPhan(res?.[0]));

	useEffect(() => {
		getKhoaNganhMeModel();
		return () => {
			setHocPhan(undefined);
		};
	}, []);

	const onCell = (rec: HocPhan.IRecord) => ({
		onClick: () => setHocPhan(rec),
		style: {
			cursor: 'pointer',
			fontWeight: rec.ma === recHocPhan?.ma ? 600 : undefined,
			backgroundColor: rec.ma === recHocPhan?.ma ? '#f0f0f0' : undefined,
			// color: rec.trangThai !== ETrangThaiHocPhanDangKyTinChi.DUOC_DK ? '#cc0101' : undefined,
		},
	});

	const columns: IColumn<HocPhan.IRecord & { index: number }>[] = [
		{ title: 'TT', dataIndex: 'index', width: 60, align: 'center', onCell },
		{
			title: 'Mã HP',
			dataIndex: 'ma',
			width: 80,
			align: 'center',
			filterType: 'string',
			onCell,
		},
		{
			title: 'Tên học phần',
			dataIndex: 'ten',
			width: 170,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Số TC',
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
			<Space wrap>
				<Select
					options={allLoaiDangKy.map((item) => ({
						key: item,
						value: item,
						label: loaiDangKyTheoLop?.[item],
					}))}
					value={loaiDangKy}
					onChange={(val) => setLoaiDangKy(val)}
					style={{ width: 250 }}
				/>
				<Popover content={<ViewGhiChuDangKyTinChi />}>
					<Button type='link' icon={<QuestionCircleOutlined />}>
						Hướng dẫn Đăng ký
					</Button>
				</Popover>
			</Space>

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
		</>
	);
};

export default FilterHocPhanDKTC;
