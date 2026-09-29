import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import { colorTrangThaiKqht, trangThaiKqht, type ETrangThaiKqht } from '@/services/DaoTao/constant';
import { PhieuDkCtdt } from '@/services/DaoTao/PhieuDkyCTDT/typing';
import { IconTrash, IconPencil01 } from '@/components/Icons';
import { Button, Modal, Tag, Tooltip } from 'antd';
import type { ReactElement, ReactNode } from 'react';
import { useState } from 'react';
import { useIntl } from 'umi';
import FormHpBuild from './FormHpBuild';

export interface ProgramDesignTableProps {
	data: PhieuDkCtdt.KhoiHocPhanDkCtdt[];
	onDelete?: (index: number) => void;
	onEdit?: (record: PhieuDkCtdt.KhoiHocPhanDkCtdt, index: number) => void;
	hasTotal?: boolean;
	title?: ReactNode;
	otherButtons?: ReactElement[];
	showEdit?: boolean;
	setShowEdit?: (v: boolean) => void;
	otherProps?: Record<string, any>;
	hideActions?: boolean;
}

const ProgramDesignTable = ({
	data,
	onDelete,
	onEdit,
	hasTotal = true,
	title,
	otherButtons,
	showEdit,
	setShowEdit,
	hideActions = false,
	otherProps = { pagination: false },
}: ProgramDesignTableProps) => {
	const intl = useIntl();
	const [visibleDetail, setVisibleDetail] = useState(false);
	const [selectedRecord, setSelectedRecord] = useState<any>(null);

	const columns: IColumn<PhieuDkCtdt.KhoiHocPhanDkCtdt>[] = [
		{
			title: intl.formatMessage({ id: 'minor.idm.form.courseCode' }),
			dataIndex: 'hocPhanChinh',
			width: 120,
			render: (val) => val?.ma || '-',
		},
		{
			title: intl.formatMessage({ id: 'minor.idm.form.courseName' }),
			dataIndex: 'hocPhanChinh',
			width: 240,
			render: (val) => val?.ten,
		},
		{
			title: intl.formatMessage({ id: 'minor.idm.form.creditsCount' }),
			dataIndex: 'hocPhanChinh',
			width: 110,
			render: (val) => {
				const credits = val?.soTinChi || 0;
				const tagColor = credits === 0 ? 'default' : credits === 1 || credits === 2 ? 'gold' : 'red';
				return (
					<Tag color={tagColor}>
						{credits} {intl.formatMessage({ id: 'minor.idm.credits' })}
					</Tag>
				);
			},
		},
		{
			title: intl.formatMessage({ id: 'minor.idm.form.prerequisiteCourse' }),
			dataIndex: 'dsHocPhanTienQuyet',
			width: 200,
			render: (val) => val?.map((item: any) => item?.ma).join(', '),
		},
		{
			title: intl.formatMessage({ id: 'minor.idm.form.status' }),
			dataIndex: 'hocPhanChinh',
			width: 150,
			render: (val) => {
				const status = val?.trangThaiKqht as ETrangThaiKqht | undefined;
				if (!status) return '--';
				return <Tag color={colorTrangThaiKqht[status]}>{trangThaiKqht[status] ?? status}</Tag>;
			},
		},
		{
			title: intl.formatMessage({ id: 'minor.idm.table.semesterOrder' }),
			dataIndex: 'soThuTuKy',
			width: 150,
			render: (val) => val,
		},
		...(hideActions
			? []
			: [
					{
						title: intl.formatMessage({ id: 'minor.idm.table.actions' }),
						width: 100,
						fixed: 'right' as const,
						render: (_: any, record: any, index: number) => (
							<div style={{ display: 'flex' }}>
								<Tooltip title={intl.formatMessage({ id: 'global.button.chinhsua' })}>
									<Button
										type='link'
										icon={<IconPencil01 />}
										onClick={(e) => {
											e.stopPropagation();
											onEdit?.(record, index);
										}}
									/>
								</Tooltip>
								<Tooltip title={intl.formatMessage({ id: 'minor.idm.action.delete' })}>
									<Button
										type='link'
										danger
										icon={<IconTrash />}
										onClick={(e) => {
											e.stopPropagation();
											onDelete?.(index);
										}}
									/>
								</Tooltip>
							</div>
						),
					},
				]),
	];

	const handleRowClick = (record: PhieuDkCtdt.KhoiHocPhanDkCtdt) => {
		setSelectedRecord(record);
		setVisibleDetail(true);
	};

	return (
		<>
			<TableStaticData
				data={data}
				columns={columns}
				hasTotal={hasTotal}
				addStt
				size='small'
				otherButtons={otherButtons}
				showEdit={showEdit}
				setShowEdit={setShowEdit}
				otherProps={{
					...otherProps,
					onRow: (record: any) => ({
						onClick: () => handleRowClick(record),
						style: { cursor: 'pointer' },
					}),
				}}
			/>
			<Modal
				width={800}
				open={visibleDetail}
				onCancel={() => {
					setVisibleDetail(false);
					setSelectedRecord(null);
				}}
				footer={null}
				title={intl.formatMessage({ id: 'minor.idm.table.courseDetail' })}
			>
				<FormHpBuild
					key={selectedRecord ? `form-${selectedRecord.hocPhanChinh?.ma || Date.now()}` : 'form-new'}
					onCancel={() => {
						setVisibleDetail(false);
						setSelectedRecord(null);
					}}
					initialValues={selectedRecord}
					isView
				/>
			</Modal>
		</>
	);
};

export default ProgramDesignTable;
