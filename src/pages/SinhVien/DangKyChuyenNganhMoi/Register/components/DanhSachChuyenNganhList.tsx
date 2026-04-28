import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import { ChuongTrinhDaoTao } from '@/services/DaoTao/ChuongTrinhDaoTao/typing';
import { Button, Card, Col, Row, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import SplitPane from 'react-split-pane';
import Pane from 'react-split-pane/lib/Pane';
import { history, useAccess, useIntl, useModel } from 'umi';
import DanhSachHocPhanList from './DanhSachHocPhanList';

const DanhSachChuyenNganhList = ({ isMinor, hiddenButton }: { isMinor: boolean; hiddenButton?: boolean }) => {
	const intl = useIntl();
	const { cctFilter } = useAccess();
	const { getModel, danhSach, loading } = useModel('daotao.nganhchuyennganh');
	const { getAllModel } = useModel('daotao.khoihpctnganh');

	const getDataKhoiHocPhan = () =>
		getAllModel(
			undefined,
			undefined,
			undefined,
			undefined,
			isMinor ? `${choosenMinor}/many` : `${choosenMinor}/ctdt/many`,
		);

	const [choosenMinor, setChoosenMinor] = useState<string>('');
	const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
	const [paneSize, setPaneSize] = useState<string | number>('40%');

	const handlePaneSizeChange = (size: string | number | (string | number)[]) => {
		setPaneSize(Array.isArray(size) ? size[0] : size);
	};

	useEffect(() => {
		if (danhSach?.length) {
			setChoosenMinor(danhSach[0]?.ma ?? '');
		} else {
			setChoosenMinor('');
		}
	}, [danhSach]);

	useEffect(() => {
		if (choosenMinor) {
			getDataKhoiHocPhan();
		}
	}, [choosenMinor]);

	const getData = () =>
		getModel(undefined, undefined, undefined, undefined, undefined, isMinor ? 'phu/page' : 'me/page');

	const columns: IColumn<ChuongTrinhDaoTao.IChuyenNganhMe>[] = [
		{
			title: intl.formatMessage({ id: 'minor.table.ma' }),
			dataIndex: 'ma',
			key: 'ma',
			filterType: 'string',
			width: 100,
		},
		{
			title: intl.formatMessage({ id: 'minor.table.ten' }),
			dataIndex: 'ten',
			key: 'ten',
			filterType: 'string',
			width: 220,
		},

		// {
		// 	title: intl.formatMessage({ id: 'minor.table.tongTinChi' }),
		// 	width: 140,
		// 	align: 'center',
		// 	dataIndex: 'soTinChi',
		// 	sortable: true,
		// 	render: (_, record) => {
		// 		const credits = record.soTinChi || 0;
		// 		return (
		// 			<Tag color='blue'>
		// 				{credits} {intl.formatMessage({ id: 'minor.table.credits' })}
		// 			</Tag>
		// 		);
		// 	},
		// },
	];

	return (
		<Col span={24}>
			<Row gutter={[8, 0]}>
				<Col span={24}>
					<SplitPane split={isMobile ? 'horizontal' : 'vertical'} onChange={handlePaneSizeChange}>
						<Pane initialSize={paneSize} minSize='35%' style={{ width: '100%', height: 'fit-content !important' }}>
							<Card
								title={
									isMinor
										? intl.formatMessage({ id: 'minor.major.recommended.minor' })
										: intl.formatMessage({ id: 'minor.major.recommended.concentration' })
								}
								extra={
									hiddenButton || !cctFilter?.()
										? []
										: [
											<Button
												key='build'
												type='primary'
												onClick={() =>
													history.push(
														`/hoc-tap/dang-ky-chuyen-nganh/register/build?loai=${isMinor ? 'minor' : 'concentration'}`,
													)
												}
											>
												{isMinor
													? intl.formatMessage({ id: 'minor.build.button.minor' })
													: intl.formatMessage({ id: 'minor.build.button.concentration' })}
											</Button>,
										]
								}
							>
								<TableBase
									modelName='daotao.nganhchuyennganh'
									getData={getData}
									formProps={{ getData }}
									dependencies={[isMinor]}
									columns={columns}
									hideCard
									addStt
									emptyText={
										isMinor
											? intl.formatMessage({ id: 'minor.empty.noRecommended.minor' })
											: intl.formatMessage({ id: 'minor.empty.noRecommended.concentration' })
									}
									buttons={{ create: false, import: false, export: false, filter: true, reload: true, minimizeGlobalSearch: true }}
									otherProps={{
										loading,
										rowKey: 'ma',
										onRow: (record) => ({
											onClick: () => setChoosenMinor(record?.ma ?? ''),
											style: { cursor: 'pointer' },
										}),
										rowClassName: (record) => (record?.ma === choosenMinor ? 'ant-table-row-selected' : ''),
									}}
								/>
							</Card>
						</Pane>
						<Pane>
							<DanhSachHocPhanList
								isMinor={isMinor}
								hiddenButton={hiddenButton}
								choosenMinor={choosenMinor}
								choosenMinorName={danhSach.find((item) => item.ma === choosenMinor)?.ten}
								onSuccess={() => {
									if (isMinor) {
										history.push('/hoc-tap/khac#dang-ky-chuyen-nganh-hep');
									} else {
										history.push('/hoc-tap/khac');
									}
								}}
							/>
						</Pane>
					</SplitPane>
				</Col>
			</Row>
		</Col>
	);
};

export default DanhSachChuyenNganhList;
