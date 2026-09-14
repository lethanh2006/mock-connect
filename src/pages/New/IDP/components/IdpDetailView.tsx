import { IDP_PART_A_FIELDS, IDP_PART_B_FIELDS } from '@/services/Idp/constant';
import { Idp } from '@/services/Idp/typing';
import { formatDate } from '@/utils/formatDate';
import { Col, Descriptions, Row, Table, Typography } from 'antd';
import { useIntl } from 'umi';
import styles from './IdpForm.less';
import SectionHeader from './SectionHeader';

type IdpDetailViewProps = {
	content: Idp.IFormRequest;
	studentName?: string;
	studentCode?: string;
	program?: string;
	facultyAdvisorName?: string | null;
};

const IdpDetailView: React.FC<IdpDetailViewProps> = ({
	content,
	studentName,
	studentCode,
	program,
	facultyAdvisorName,
}) => {
	const intl = useIntl();

	/** Một ô nội dung: nhãn 16px + giá trị 14px. */
	const renderField = (name: keyof Idp.IFormRequest) => (
		<Col xs={24} md={12} key={name}>
			<Typography.Text className={styles.fieldLabel}>
				{intl.formatMessage({ id: `idp.form.label.${name}` })}
			</Typography.Text>
			<Typography.Paragraph className={styles.fieldValue}>{(content[name] as string) || '—'}</Typography.Paragraph>
		</Col>
	);

	return (
		<>
			<div className={styles.reviewHeader}>
				<h2 className={styles.reviewHeaderTitle}>{intl.formatMessage({ id: 'idp.detail.title' })}</h2>
			</div>

			<div className={styles.reviewBody}>
				<Descriptions
					bordered
					column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}
					size='small'
					style={{ marginBottom: 24 }}
				>
					<Descriptions.Item label={intl.formatMessage({ id: 'idp.detail.studentName' })}>
						{studentName ?? '—'}
					</Descriptions.Item>
					<Descriptions.Item label={intl.formatMessage({ id: 'idp.detail.studentId' })}>
						{studentCode ?? '—'}
					</Descriptions.Item>
					<Descriptions.Item label={intl.formatMessage({ id: 'idp.detail.program' })} span={2}>
						{program ?? '—'}
					</Descriptions.Item>
				</Descriptions>

				<SectionHeader>{intl.formatMessage({ id: 'idp.form.step.partA' })}</SectionHeader>
				<Row gutter={[36, 16]} style={{ marginBottom: 24 }}>
					{IDP_PART_A_FIELDS.map(renderField)}
				</Row>

				<SectionHeader>{intl.formatMessage({ id: 'idp.form.step.partB' })}</SectionHeader>
				<Row gutter={[36, 16]} style={{ marginBottom: 24 }}>
					{IDP_PART_B_FIELDS.map(renderField)}
				</Row>

				<SectionHeader>{intl.formatMessage({ id: 'idp.form.step.actionPlan' })}</SectionHeader>
				<Table
					rowKey={(_, index) => index as number}
					dataSource={content.actionPlan ?? []}
					pagination={false}
					bordered
					size='small'
					// Nội dung tự do có thể là chuỗi dài không khoảng trắng (URL); layout `fixed` giữ
					// tổng chiều rộng bằng đúng container thay vì để min-content của cell đẩy tràn.
					tableLayout='fixed'
					columns={[
						{
							title: intl.formatMessage({ id: 'idp.actionPlan.column.actions' }),
							dataIndex: 'action',
							width: '30%',
						},
						{
							title: intl.formatMessage({ id: 'idp.actionPlan.column.smartOutcomes' }),
							dataIndex: 'smartOutcome',
							width: '30%',
						},
						{
							title: intl.formatMessage({ id: 'idp.actionPlan.column.timeline' }),
							dataIndex: 'timelineAndSupport',
							width: '25%',
						},
						{
							title: intl.formatMessage({ id: 'idp.actionPlan.column.checkpoints' }),
							dataIndex: 'progressCheckpoint',
							width: '15%',
							render: (val: string | null) => (val ? formatDate(val) : '—'),
						},
					]}
				/>
			</div>

			<div className={styles.reviewFooter}>
				{intl.formatMessage({ id: 'idp.detail.endorsedBy' }, { name: facultyAdvisorName ?? '—' })}
			</div>
		</>
	);
};

export default IdpDetailView;
