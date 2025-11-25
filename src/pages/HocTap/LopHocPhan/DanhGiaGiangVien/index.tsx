import TableBase from '@/components/Table';
import { EOperatorType } from '@/components/Table/constant';
import { IColumn } from '@/components/Table/typing';
import { ELoaiDot } from '@/services/TienIch/KhaoSat/constants';
import { DotKhaoSat } from '@/services/TienIch/KhaoSat/DotKhaoSat/typing';
import { Descriptions, Empty, Space, Tag } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import SplitPane from 'react-split-pane';
import Pane from 'react-split-pane/lib/Pane';
import { useModel } from 'umi';
import FormDanhGiaGiangVien from './components/Form';

const DanhGiaGiangVienPage = () => {
	const { record: recHocPhan } = useModel('lophocphan.lophocphan');
	const { getModel, page, limit, record, setRecord } = useModel('tienich.dotkhaosat');
	const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
	const [paneSize, setPaneSize] = useState('25%');

	const handlePaneSizeChange = (size: any) => {
		setPaneSize(size[0]);
	};

	const getData = () => {
		if (recHocPhan?._id) {
			getModel(
				{
					maHocKy: recHocPhan?.maHocKy,
				},
				[
					{
						active: true,
						field: 'loai',
						values: [ELoaiDot.DANH_GIA_GIANG_VIEN, ELoaiDot.KHAO_SAT_LOP_HOC_PHAN],
						operator: EOperatorType.INCLUDE,
					},
				],
				{ updatedAt: -1 },
				undefined,
				undefined,
				'my/page',
			).then((res) => setRecord(res[0]));
		}
	};

	const onCell = (rec: DotKhaoSat.IRecord) => ({
		onClick: () => {
			setRecord(rec);
		},
		style: {
			cursor: 'pointer',
			fontWeight: rec._id === record?._id ? 600 : undefined,
			backgroundColor: rec._id === record?._id ? 'var(--color-primary-bg)' : undefined,
		},
	});

	const columns: IColumn<DotKhaoSat.IRecord>[] = [
		{
			title: 'STT',
			dataIndex: 'index',
			align: 'center',
			width: 40,
			onCell,
		},
		{
			title: 'Tên đợt',
			dataIndex: 'ten',
			width: 200,
			render: (val, rec) => (
				<Space wrap>
					{val} {rec?.loai === ELoaiDot.DANH_GIA_GIANG_VIEN && <Tag color='green'>Đánh giá giảng viên</Tag>}
				</Space>
			),
			filterType: 'string',
			onCell,
		},
		{
			title: 'Thời gian bắt đầu',
			dataIndex: 'thoiGianBatDau',
			align: 'center',
			render: (val) => (val ? dayjs(val).format('HH:mm DD/MM/YYYY') : ''),
			sortable: true,
			filterType: 'datetime',
			width: 120,
			onCell,
		},
		{
			title: 'Thời gian kết thúc',
			dataIndex: 'thoiGianKetThuc',
			align: 'center',
			render: (val) => (val ? dayjs(val).format('HH:mm DD/MM/YYYY') : ''),
			sortable: true,
			filterType: 'datetime',
			width: 120,
			onCell,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'daLam',
			align: 'center',
			width: 120,
			render: (val) => (val ? <Tag color='green'>Đã thực hiện</Tag> : <Tag color='red'>Chưa thực hiện</Tag>),
			fixed: 'right',
			onCell,
		},
	];

	return (
		<SplitPane split={isMobile ? 'horizontal' : 'vertical'} onChange={handlePaneSizeChange} style={{ height: '100vh' }}>
			<Pane initialSize={paneSize} minSize='15%'>
				<div style={{ position: 'sticky' }}>
					<TableBase
						getData={getData}
						columns={columns}
						dependencies={[page, limit, recHocPhan?._id]}
						modelName='tienich.dotkhaosat'
						hideCard
						buttons={{ create: false, filter: false }}
						widthDrawer={1000}
						addStt={false}
					/>
				</div>
			</Pane>

			<Pane minSize='40%'>
				<div style={{ height: '100vh', overflow: 'auto' }}>
					{record?._id ? (
						<>
							<Descriptions
								style={{
									marginBottom: 12,
								}}
								column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }}
								className='highlight'
								layout='vertical'
								colon={false}
							>
								<Descriptions.Item label='Đợt khảo sát' span={2}>
									{record?.ten ?? '--'}
								</Descriptions.Item>
								<Descriptions.Item label='Thời gian bắt đầu'>
									{record?.thoiGianBatDau ? dayjs(record?.thoiGianBatDau).format('HH:mm DD/MM/YYYY') : '--'}
								</Descriptions.Item>
								<Descriptions.Item label='Thời gian kết thúc'>
									{record?.thoiGianKetThuc ? dayjs(record?.thoiGianKetThuc).format('HH:mm DD/MM/YYYY') : '--'}
								</Descriptions.Item>
							</Descriptions>

							<FormDanhGiaGiangVien />
						</>
					) : (
						<div style={{ paddingTop: 16 }}>
							<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Không có dữ liệu' />
						</div>
					)}
				</div>
			</Pane>
		</SplitPane>
	);
};

export default DanhGiaGiangVienPage;
