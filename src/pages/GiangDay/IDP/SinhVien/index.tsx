import PageCard from '@/components/PageCard';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import type { IColumn, QueryCondition } from '@/components/Table/typing';
import SelectNamHoc from '@/pages/DaoTao/NamHoc/Select';
import type { IdpCoVan } from '@/services/IdpCoVan/typing';
import { formatDateTime } from '@/utils/formatDate';
import { EyeOutlined } from '@ant-design/icons';
import { Tag, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import '../components/IdpDetail.less';
import IdpStatisticsCards from '../components/IdpStatisticsCards';
import StudentDetailModalContent from '../components/StudentDetailModalContent';

const IdpSinhVienPage = () => {
	const intl = useIntl();
	const { record, getModel, handleView, setCondition, getAdvisorStatsModel } = useModel('idp.covansinhvien');
	const [maNamHoc, setMaNamHoc] = useState<string>();

	const onCell = (rec: IdpCoVan.IStudentSummary) => ({
		onClick: () => handleView(rec),
		style: { cursor: 'pointer' },
	});

	const onReviewSuccess = () => {
		getModel();
		getAdvisorStatsModel(maNamHoc);
	};

	useEffect(() => {
		getAdvisorStatsModel(maNamHoc);
	}, [maNamHoc]);

	// maNam không phải field của IStudentSummary (chỉ dùng để lọc theo năm học của Advisor), nên phải ép kiểu.
	const handleNamHocChange = (val?: string) => {
		setMaNamHoc(val);
		setCondition((prev) => ({ ...prev, maNam: val }) as QueryCondition<IdpCoVan.IStudentSummary>);
	};

	const columns: IColumn<IdpCoVan.IStudentSummary>[] = [
		{
			title: intl.formatMessage({ id: 'idpcovan.column.studentCode' }),
			dataIndex: 'studentCode',
			width: 150,
			filterType: 'string',
			sortable: true,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'idpcovan.column.studentName' }),
			dataIndex: 'studentName',
			width: 220,
			filterType: 'string',
			sortable: true,
			onCell,
			render: (val: string) => <Typography.Text strong>{val}</Typography.Text>,
		},
		{
			title: intl.formatMessage({ id: 'idpcovan.column.studentEmail' }),
			dataIndex: 'studentEmail',
			width: 200,
			filterType: 'string',
			onCell,
			render: (val?: string) => val || '—',
		},
		{
			title: intl.formatMessage({ id: 'idpcovan.column.studentPhone' }),
			dataIndex: 'studentPhone',
			width: 140,
			filterType: 'string',
			onCell,
			render: (val?: string) => val || '—',
		},
		{
			title: intl.formatMessage({ id: 'idpcovan.column.studentAddress' }),
			dataIndex: 'studentAddress',
			width: 220,
			onCell,
			render: (val?: string) =>
				val ? (
					<Typography.Paragraph ellipsis={{ rows: 1, tooltip: val }} style={{ marginBottom: 0 }}>
						{val}
					</Typography.Paragraph>
				) : (
					'—'
				),
		},
		{
			title: intl.formatMessage({ id: 'idpcovan.column.bookingCounts' }),
			dataIndex: 'bookingCount',
			width: 120,
			align: 'center',
			sortable: true,
			onCell,
			render: (val?: number) => val ?? 0,
		},
		{
			title: intl.formatMessage({ id: 'idpcovan.column.studentsWithIdp' }),
			dataIndex: 'hasIdp',
			width: 90,
			align: 'center',
			onCell,
			render: (val?: boolean) => (
				<Tag color={val ? 'success' : 'default'}>
					{intl.formatMessage({ id: val ? 'idpcovan.common.yes' : 'idpcovan.common.no' })}
				</Tag>
			),
		},
		{
			title: intl.formatMessage({ id: 'idpcovan.column.maNganh' }),
			dataIndex: 'tenNganh',
			width: 220,
			filterType: 'string',
			onCell,
			render: (val: string, rec: IdpCoVan.IStudentSummary) => val || rec.maNganh || '—',
		},
		{
			title: intl.formatMessage({ id: 'idpcovan.column.assignedAt' }),
			dataIndex: 'assignedAt',
			width: 160,
			sortable: true,
			onCell,
			render: (val: string) => (val ? formatDateTime(val) : '—'),
		},
		{
			title: intl.formatMessage({ id: 'idpcovan.column.action' }),
			width: 90,
			align: 'center',
			fixed: 'right',
			render: (_: any, rec: IdpCoVan.IStudentSummary) => (
				<div onClick={(e) => e.stopPropagation()}>
					<ButtonExtend
						tooltip={intl.formatMessage({ id: 'idpcovan.tooltip.viewDetail' })}
						icon={<EyeOutlined />}
						type='link'
						onClick={() => handleView(rec)}
					/>
				</div>
			),
		},
	];

	return (
		<PageCard title={intl.formatMessage({ id: 'idpcovan.studentsPage.title' })}>
			<IdpStatisticsCards />

			<TableBase<IdpCoVan.IStudentSummary>
				modelName='idp.covansinhvien'
				columns={columns}
				dependencies={[]}
				hideCard
				Form={StudentDetailModalContent}
				formProps={{ onSuccess: onReviewSuccess }}
				modalTitle={intl.formatMessage(
					{ id: 'idpcovan.modal.studentTitle' },
					{ name: record?.studentName ?? '', code: record?.studentCode ?? '' },
				)}
				widthDrawer={1200}
				destroyModal
				buttons={{ create: false, import: false, export: false }}
				otherProps={{
					rowKey: 'studentSsoId',
					className: 'idp-advisor-table',
				}}
				otherButtons={[
					<SelectNamHoc
						isGetAll
						allowClear
						selectMa
						value={maNamHoc}
						onChange={handleNamHocChange}
						style={{ width: 260 }}
					/>,
				]}
			/>
		</PageCard>
	);
};

export default IdpSinhVienPage;
