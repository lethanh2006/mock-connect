import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import type { IColumn } from '@/components/Table/typing';
import { IDP_STATUS_LABEL_KEY, IdpStatus } from '@/services/IdpCoVan/constant';
import type { IdpCoVan } from '@/services/IdpCoVan/typing';
import { formatDateTime } from '@/utils/formatDate';
import { AuditOutlined, EyeOutlined } from '@ant-design/icons';
import { Alert, Descriptions, Empty, Space, Tag, Typography } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import { STATUS_TAG_COLOR } from '../statusTagColor';
import IdpRecordModalContent from './IdpRecordModalContent';
import SectionHeader from './SectionHeader';

type StudentDetailModalContentProps = {
	onSuccess?: () => void;
};

const StudentDetailModalContent: React.FC<StudentDetailModalContentProps> = ({ onSuccess }) => {
	const intl = useIntl();
	const { record: studentRecord } = useModel('idp.covansinhvien');
	const { isView, danhSach, getMyStudentsIdpModel, clearModel, handleView, setVisibleForm } = useModel('idp.covanidp');

	const studentSsoId = studentRecord?.studentSsoId ?? '';

	useEffect(() => {
		return () => clearModel();
	}, []);

	const hasPending = danhSach?.some((item) => item.status === IdpStatus.PENDING);

	const onReviewSuccess = () => {
		setVisibleForm(false);
		getMyStudentsIdpModel({ studentSsoId });
		onSuccess?.();
	};

	const columns: IColumn<IdpCoVan.IIdpListItem>[] = [
		{
			title: intl.formatMessage({ id: 'idpcovan.column.createdAt' }),
			dataIndex: 'createdAt',
			width: 160,
			render: (val: string) => (val ? formatDateTime(val) : '—'),
		},
		{
			title: intl.formatMessage({ id: 'idpcovan.column.status' }),
			dataIndex: 'status',
			width: 150,
			align: 'center',
			render: (val: IdpStatus) => (
				<Tag color={STATUS_TAG_COLOR[val]}>{intl.formatMessage({ id: IDP_STATUS_LABEL_KEY[val] })}</Tag>
			),
		},
		{
			title: intl.formatMessage({ id: 'idpcovan.column.reviewedAt' }),
			dataIndex: 'reviewedAt',
			width: 160,
			render: (val: string | null) => (val ? formatDateTime(val) : '—'),
		},
		{
			title: intl.formatMessage({ id: 'idpcovan.column.reviewComment' }),
			dataIndex: 'reviewComment',
			width: 280,
			render: (val: string | null) =>
				val ? (
					<Typography.Paragraph ellipsis={{ rows: 2, tooltip: val }} style={{ marginBottom: 0 }}>
						{val}
					</Typography.Paragraph>
				) : (
					'—'
				),
		},
		{
			title: intl.formatMessage({ id: 'idpcovan.column.action' }),
			width: 90,
			align: 'center',
			fixed: 'right',
			render: (_: any, rec: IdpCoVan.IIdpListItem) => (
				<ButtonExtend
					tooltip={intl.formatMessage({
						id: rec.status === IdpStatus.PENDING ? 'idpcovan.tooltip.review' : 'idpcovan.tooltip.viewDetail',
					})}
					icon={rec.status === IdpStatus.PENDING ? <AuditOutlined /> : <EyeOutlined />}
					type='link'
					onClick={() => handleView(rec)}
				/>
			),
		},
	];

	return (
		<Space direction='vertical' size={16} style={{ display: 'flex' }}>
			<Descriptions bordered size='small' column={{ xs: 1, sm: 2, md: 2, lg: 2, xl: 2, xxl: 2 }}>
				<Descriptions.Item label={intl.formatMessage({ id: 'idpcovan.detail.studentName' })}>
					{studentRecord?.studentName ?? '—'}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'idpcovan.detail.studentId' })}>
					{studentRecord?.studentCode ?? '—'}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'idpcovan.detail.program' })}>
					{studentRecord?.tenNganh || studentRecord?.maNganh || '—'}
				</Descriptions.Item>
			</Descriptions>

			{hasPending && (
				<Alert type='warning' showIcon message={intl.formatMessage({ id: 'idpcovan.detail.pendingAlert' })} />
			)}

			{/* `hideCard` để bảng nằm thẳng trong modal: PageCard mặc định còn lồng thêm
			    một Card con nữa, thành 2 lớp viền + thừa padding. */}
			<div>
				<SectionHeader style={{ marginTop: 0 }}>
					{intl.formatMessage({ id: 'idpcovan.detail.idpListTitle' })}
				</SectionHeader>

				<TableBase<IdpCoVan.IIdpListItem>
					modelName='idp.covanidp'
					columns={columns}
					dependencies={[studentSsoId]}
					getData={() => getMyStudentsIdpModel({ studentSsoId })}
					hideCard
					addStt={false}
					Form={IdpRecordModalContent}
					formProps={{ onSuccess: onReviewSuccess }}
					modalTitle={intl.formatMessage({ id: 'idpcovan.modal.idpTitle' })}
					widthDrawer={isView ? 794 : 1000}
					destroyModal
					buttons={{
						create: false,
						import: false,
						export: false,
						filter: false,
						globalSearch: false,
						columnSetting: false,
					}}
					otherProps={{
						rowKey: '_id',
						locale: { emptyText: <Empty description={intl.formatMessage({ id: 'idpcovan.detail.noVersion' })} /> },
					}}
				/>
			</div>
		</Space>
	);
};

export default StudentDetailModalContent;
