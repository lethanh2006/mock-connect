import type { IdpCoVan } from '@/services/IdpCoVan/typing';
import { formatDate } from '@/utils/formatDate';
import { Col, Descriptions, Row, Table, Typography } from 'antd';
import { useIntl } from 'umi';
import styles from './IdpDetail.less';
import SectionHeader from './SectionHeader';

const PART_A_FIELDS: (keyof IdpCoVan.IContent)[] = ['whatILove', 'whatIAmGoodAt', 'whatTheWorldNeeds', 'whatICanBePaidFor'];
const PART_B_FIELDS: (keyof IdpCoVan.IContent)[] = ['shortTermGoals', 'longTermGoals', 'strengths', 'areasForImprovement'];

type IdpDetailViewProps = {
	content: IdpCoVan.IContent;
	studentName?: string;
	studentCode?: string;
	program?: string;
	advisorName?: string;
};

const IdpDetailView: React.FC<IdpDetailViewProps> = ({ content, studentName, studentCode, program, advisorName }) => {
	const intl = useIntl();

	/** Một ô nội dung: nhãn 16px + giá trị 14px. */
	const renderField = (name: keyof IdpCoVan.IContent) => (
		<Col xs={24} md={12} key={name}>
			<Typography.Text className={styles.fieldLabel}>
				{intl.formatMessage({ id: `idpcovan.form.label.${name}` })}
			</Typography.Text>
			<Typography.Paragraph className={styles.fieldValue}>{(content[name] as string) || '—'}</Typography.Paragraph>
		</Col>
	);

	return (
		<>
			<div className={styles.reviewHeader}>
				<h2 className={styles.reviewHeaderTitle}>{intl.formatMessage({ id: 'idpcovan.detail.title' })}</h2>
			</div>

			<div className={styles.reviewBody}>
				<Descriptions
					bordered
					column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}
					size='small'
					style={{ marginBottom: 24 }}
				>
					<Descriptions.Item label={intl.formatMessage({ id: 'idpcovan.detail.studentName' })}>
						{studentName ?? '—'}
					</Descriptions.Item>
					<Descriptions.Item label={intl.formatMessage({ id: 'idpcovan.detail.studentId' })}>
						{studentCode ?? '—'}
					</Descriptions.Item>
					<Descriptions.Item label={intl.formatMessage({ id: 'idpcovan.detail.program' })} span={2}>
						{program ?? '—'}
					</Descriptions.Item>
				</Descriptions>

				<SectionHeader>{intl.formatMessage({ id: 'idpcovan.form.step.partA' })}</SectionHeader>
				<Row gutter={[36, 16]} style={{ marginBottom: 24 }}>
					{PART_A_FIELDS.map(renderField)}
				</Row>

				<SectionHeader>{intl.formatMessage({ id: 'idpcovan.form.step.partB' })}</SectionHeader>
				<Row gutter={[36, 16]} style={{ marginBottom: 24 }}>
					{PART_B_FIELDS.map(renderField)}
				</Row>

				<SectionHeader>{intl.formatMessage({ id: 'idpcovan.form.step.actionPlan' })}</SectionHeader>
				<Table
					rowKey={(_, index) => index as number}
					dataSource={content.actionPlan ?? []}
					pagination={false}
					bordered
					size='small'
					columns={[
						{ title: intl.formatMessage({ id: 'idpcovan.actionPlan.column.actions' }), dataIndex: 'action' },
						{
							title: intl.formatMessage({ id: 'idpcovan.actionPlan.column.smartOutcomes' }),
							dataIndex: 'smartOutcome',
						},
						{
							title: intl.formatMessage({ id: 'idpcovan.actionPlan.column.timeline' }),
							dataIndex: 'timelineAndSupport',
						},
						{
							title: intl.formatMessage({ id: 'idpcovan.actionPlan.column.checkpoints' }),
							dataIndex: 'progressCheckpoint',
							render: (val: string | null) => (val ? formatDate(val) : '—'),
						},
					]}
				/>
			</div>

			<div className={styles.reviewFooter}>
				{intl.formatMessage({ id: 'idpcovan.detail.endorsedBy' }, { name: advisorName ?? '—' })}
			</div>
		</>
	);
};

export default IdpDetailView;
