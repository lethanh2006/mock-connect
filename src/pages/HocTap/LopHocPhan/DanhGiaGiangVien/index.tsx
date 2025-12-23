import ExpandText from '@/components/ExpandText';
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
import Sticky from 'react-stickynode';
import { useIntl, useModel } from 'umi';
import FormDanhGiaGiangVien from './components/Form';

const DanhGiaGiangVienPage = () => {
	const intl = useIntl();
	const { record: recLopHp } = useModel('lophocphan.lophocphan');
	const { getModel, page, limit, record, setRecord, ngoaiThoiGian } = useModel('tienich.dotkhaosat');
	const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
	const [paneSize, setPaneSize] = useState('30%');

	const handlePaneSizeChange = (size: any) => {
		setPaneSize(size[0]);
	};

	const getData = () => {
		if (recLopHp?.maHocKy) {
			getModel(
				{
					maHocKy: recLopHp?.maHocKy,
				},
				[
					{
						field: 'loai',
						values: [ELoaiDot.DANH_GIA_GIANG_VIEN, ELoaiDot.KHAO_SAT_LOP_HOC_PHAN],
						operator: EOperatorType.INCLUDE,
					},
				],
				{ updatedAt: -1 },
				undefined,
				undefined,
				'my/page',
			).then((res) => {
				if (record?._id) {
					setRecord(res?.find((item) => item?._id === record?._id));
				} else {
					setRecord(res[0]);
				}
			});
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
			title: 'TT',
			dataIndex: 'index',
			align: 'center',
			width: 40,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'lophocphan.id.khaosat.tendot' }),
			dataIndex: 'ten',
			width: 200,
			render: (val, rec) => (
				<ExpandText>
					{val}{' '}
					{rec?.loai === ELoaiDot.DANH_GIA_GIANG_VIEN && (
						<Tag color='blue'>{intl.formatMessage({ id: 'lophocphan.id.khaosat.dggv' })}</Tag>
					)}
				</ExpandText>
			),
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'lophocphan.id.khaosat.trangthai' }),
			dataIndex: 'daLam',
			align: 'center',
			width: 120,
			render: (val) =>
				val ? (
					<Tag color='green'>{intl.formatMessage({ id: 'lophocphan.id.khaosat.dathuchien' })}</Tag>
				) : (
					<Tag color='red'>{intl.formatMessage({ id: 'lophocphan.id.khaosat.chuathuchien' })}</Tag>
				),
			fixed: 'right',
			onCell,
		},
	];

	return (
		<SplitPane split={isMobile ? 'horizontal' : 'vertical'} onChange={handlePaneSizeChange}>
			<Pane initialSize={paneSize} minSize='20%'>
				<Sticky top={110} bottomBoundary='#content'>
					<TableBase
						getData={getData}
						columns={columns}
						dependencies={[page, limit, recLopHp?.maHocKy]}
						modelName='tienich.dotkhaosat'
						hideCard
						buttons={{ create: false, filter: false }}
						addStt={false}
					/>
				</Sticky>
			</Pane>

			<Pane minSize='40%'>
				<div id='content'>
					{record?._id ? (
						<>
							<Descriptions
								style={{ marginBottom: 12 }}
								column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }}
								className='highlight'
								layout='vertical'
								colon={false}
							>
								<Descriptions.Item label={intl.formatMessage({ id: 'lophocphan.id.khaosat.dot' })} span={2}>
									<Space wrap>
										{record?.ten ?? '--'}
										{record?.loai === ELoaiDot.DANH_GIA_GIANG_VIEN && (
											<Tag color='blue'>{intl.formatMessage({ id: 'lophocphan.id.khaosat.dggv' })}</Tag>
										)}
									</Space>
								</Descriptions.Item>
								<Descriptions.Item label={intl.formatMessage({ id: 'lophocphan.id.khaosat.trangthai' })} span={2}>
									{record?.kichHoat === false ? (
										<Tag color='default'>{intl.formatMessage({ id: 'lophocphan.id.khaosat.kichhoat' })}</Tag>
									) : ngoaiThoiGian ? (
										<Tag color='gold'>{intl.formatMessage({ id: 'lophocphan.id.khaosat.ngoaithoigian' })}</Tag>
									) : (
										<Tag color='green'>{intl.formatMessage({ id: 'lophocphan.id.khaosat.trongthoigian' })}</Tag>
									)}
								</Descriptions.Item>
								<Descriptions.Item label={intl.formatMessage({ id: 'lophocphan.id.khaosat.tgbt' })}>
									{record?.thoiGianBatDau ? dayjs(record?.thoiGianBatDau).format('HH:mm DD/MM/YYYY') : '--'}
								</Descriptions.Item>
								<Descriptions.Item label={intl.formatMessage({ id: 'lophocphan.id.khaosat.tgkt' })}>
									{record?.thoiGianKetThuc ? dayjs(record?.thoiGianKetThuc).format('HH:mm DD/MM/YYYY') : '--'}
								</Descriptions.Item>
							</Descriptions>

							<FormDanhGiaGiangVien getData={getData} />
						</>
					) : (
						<div style={{ paddingTop: 16 }}>
							<Empty
								image={Empty.PRESENTED_IMAGE_SIMPLE}
								description={intl.formatMessage({ id: 'lophocphan.id.khaosat.empty' })}
							/>
						</div>
					)}
				</div>
			</Pane>
		</SplitPane>
	);
};

export default DanhGiaGiangVienPage;
