import { ActivityOutCome } from '@/services/CCT/ActivityOutcome/typing';
import { FileOutlined } from '@ant-design/icons';
import { Card, Col, Divider, Empty, Input, List, Row, Typography } from 'antd';
import CardSuKienCCT from '../../Activity/components/CardSuKien';
import FormCompetencyEvidence from './FormCompetencyEvidence';

const ChiTietActivityOutCome = (props: { recOutcome: ActivityOutCome.IRecord }) => {
	const { recOutcome } = props;

	return (
		<Row gutter={[12, 12]}>
			<Col span={24} md={9}>
				<CardSuKienCCT
					record={
						{
							...recOutcome,
							name: recOutcome?.activitiesOutcomeName,
						} as any
					}
					equivalencyAttributeIds={recOutcome?.activitiesType?.attributes?.map((x) => x._id)}
					isPersonal
					isDetail
				/>
			</Col>
			<Col span={24} md={15}>
				<Card variant='borderless' size='small'>
					<Divider className='divider-big-title' orientation='left'>
						Administrative Information
					</Divider>

					<div className='custom-info-grid grid-2'>
						<div className='info-row'>
							<div className='info-item'>
								<div className='info-label'>Organizer</div>
								<div className='info-value'>{recOutcome?.organizer ?? '--'}</div>
							</div>
							<div className='info-item'>
								<div className='info-label'>Location</div>
								<div className='info-value'>{recOutcome?.location ?? '--'}</div>
							</div>
							<div className='info-item'>
								<div className='info-label'>Activity Group</div>
								<div className='info-value'>{recOutcome?.activitiesType?.activitiesTypeDomain?.name ?? '--'}</div>
							</div>
							<div className='info-item'>
								<div className='info-label'>Activity type</div>
								<div className='info-value'>{recOutcome?.activitiesType?.name ?? '--'}</div>
							</div>
							<div className='info-item'>
								<div className='info-label'>Track</div>
								<div className='info-value'>{recOutcome?.tracks?.name ?? '--'}</div>
							</div>
							<div className='info-item'>
								<div className='info-label'>Mentor/Supervisor</div>
								<div className='info-value'>{recOutcome?.supervisorName ?? '--'}</div>
							</div>
							<div className='info-item'>
								<div className='info-label'>Evidence Update Deadline</div>
								<div className='info-value'>--</div>
							</div>
							<div className='info-item'>
								<div className='info-label'>Evidence Review Time</div>
								<div className='info-value'>--</div>
							</div>
						</div>
					</div>
				</Card>
			</Col>

			<Col span={24}>
				<Card variant='borderless' size='small'>
					<Divider className='divider-big-title' orientation='left'>
						Evidence Information
					</Divider>

					<div className='custom-info-grid grid-2' style={{ marginTop: 16 }}>
						<div className='info-row'>
							<div className='info-item'>
								<div style={{ marginBottom: 8, fontWeight: 600 }}>Role</div>
								<Input disabled value={recOutcome?.roles?.name ?? 'No information'} />
							</div>
							<div className='info-item'>
								<div style={{ marginBottom: 8, fontWeight: 600 }}>Level</div>
								<Input disabled value={recOutcome?.levels?.name ?? 'No information'} />
							</div>
							<div className='info-item full-width'>
								<div style={{ marginBottom: 8, fontWeight: 600 }}>List Evidence</div>
								<List
									size='small'
									dataSource={recOutcome?.evidenceFile ?? []}
									locale={{ emptyText: <Empty description='No competency file' /> }}
									renderItem={(item: any) => (
										<List.Item>
											<Typography.Link
												href={item.file}
												target='_blank'
												rel='noopener noreferrer'
												style={{ display: 'flex', alignItems: 'center', gap: 8 }}
											>
												<FileOutlined />
												<span>{item.name}</span>
											</Typography.Link>
										</List.Item>
									)}
								/>
							</div>
							<div className='info-item full-width'>
								<div style={{ marginBottom: 8, fontWeight: 600 }}>List Evidence</div>
								<FormCompetencyEvidence
									competencyList={recOutcome?.competencyList?.map((item) => item?.competencyId)}
								/>
							</div>
							<div className='info-item full-width'>
								<div style={{ marginBottom: 8, fontWeight: 600 }}>Reflection</div>
								<Input.TextArea rows={3} disabled value={recOutcome?.reflection ?? 'No information'} />
							</div>
						</div>
					</div>
				</Card>
			</Col>
		</Row>
	);
};

export default ChiTietActivityOutCome;
