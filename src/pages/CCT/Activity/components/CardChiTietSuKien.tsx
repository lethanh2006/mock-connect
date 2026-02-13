import ExpandText from '@/components/ExpandText';
import TableStaticData from '@/components/Table/TableStaticData';
import { IColumn } from '@/components/Table/typing';
import { Activity } from '@/services/CCT/Activity/typing';
import { Card, Col, Divider, Row, Space, Tag } from 'antd';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { useIntl } from 'umi';
import CardSuKienCCT from './CardSuKien';

const CardChiTietSuKien = (props: { record: Activity.IRecord }) => {
	const { record } = props;
	const intl = useIntl();

	const groupedEquivalency = useMemo(() => {
		const map = new Map<
			string,
			{
				roleName: string;
				desRole: string;
				levelName?: string;
				attributes: { name: string; color?: string }[];
				autoApprove: boolean;
			}
		>();

		record?.coCurricularActivityEquivalency?.forEach((item) => {
			const roleId = item.roles?._id;
			if (!roleId) return;

			if (!map.has(roleId)) {
				map.set(roleId, {
					roleName: item.roles?.name ?? '',
					desRole: item.roles?.description ?? '',
					levelName: item.roles?.level?.name ?? '',
					attributes: [],
					autoApprove: item?.autoApprove ?? false,
				});
			}

			if (item.attributes?.name) {
				map.get(roleId)!.attributes.push({
					name: item.attributes.name,
					color: item.attributes.color,
				});
			}
		});

		return Array.from(map.values());
	}, [record]);

	const columns: IColumn<any>[] = [
		{
			title: intl.formatMessage({ id: 'activity.detail.role' }),
			width: 180,
			dataIndex: 'roleName',
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'activity.detail.des' }),
			width: 280,
			dataIndex: 'desRole',
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'activity.detail.attributes' }),
			width: 200,
			render: (_, rec) => (
				<Space size={[4, 4]} wrap>
					{rec.attributes?.map((attr: any, idx: number) => (
						<Tag key={idx} color={attr.color}>
							{attr.name}
						</Tag>
					))}
				</Space>
			),
		},
	];

	return (
		<Row gutter={[12, 12]}>
			<Col span={24} md={9}>
				<CardSuKienCCT
					record={record ?? ({} as Activity.IRecord)}
					equivalencyAttributeIds={record?.coCurricularActivityEquivalency?.map((x) => x.attributesId) ?? []}
					workflow={record?.workflow}
					isDetail
				/>
			</Col>
			<Col span={24} md={15}>
				<Card variant='borderless' size='small'>
					<Divider className='divider-big-title' orientation='left'>
						Administrative Information
					</Divider>

					<div className='custom-info-grid'>
						<div className='info-row'>
							<div className='info-item'>
								<div className='info-label'>Organizer</div>
								<div className='info-value'>{record?.organizer ?? '--'}</div>
							</div>
							<div className='info-item'>
								<div className='info-label'>Approver</div>
								<div className='info-value'>
									{record?.studentDeclarationApproverList
										? record?.studentDeclarationApproverList?.map((item) => item?.name).join(', ')
										: '--'}
								</div>
							</div>
						</div>

						<div className='info-row'>
							<div className='info-item'>
								<div className='info-label'>Activity Group</div>
								<div className='info-value'>{record?.activitiesType?.activitiesTypeDomain?.name ?? '--'}</div>
							</div>
							<div className='info-item'>
								<div className='info-label'>Activity Type</div>
								<div className='info-value'>{record?.activitiesType?.name ?? '--'}</div>
							</div>
						</div>

						<div className='info-row'>
							<div className='info-item'>
								<div className='info-label'>Track</div>
								<div className='info-value'>{record?.activitiesType?.track?.name ?? '--'}</div>
							</div>
							<div className='info-item'>
								<div className='info-label'>Capacity</div>
								<div className='info-value'>15 slots</div>
							</div>
						</div>

						<div className='info-row'>
							<div className='info-item'>
								<div className='info-label'>Allow post-event results update</div>
								<div className='info-value'>{record?.allowPostEventResultsUpdate ? 'Yes' : 'No'}</div>
							</div>
							<div className='info-item'>
								<div className='info-label'>Evidence Update Deadline</div>
								<div className='info-value'>
									{record?.allowPostEventResultsUpdate
										? record?.dueDate
											? dayjs(record?.dueDate).format('HH:mm DD/MM/YYYY')
											: '--'
										: '--'}
								</div>
							</div>
						</div>

						<div className='info-row'>
							<div className='info-item full-width'>
								<div className='info-label'>Required Evidence</div>
								<div className='info-value'>
									{record?.activitiesType?.requiredEvidenceList
										? record?.activitiesType?.requiredEvidenceList
												?.map((item) => item)
												.filter(Boolean)
												.join(', ')
										: '--'}
								</div>
							</div>
						</div>
					</div>
				</Card>
			</Col>

			<Col span={24}>
				<Card variant='borderless' size='small'>
					<Divider className='divider-big-title' orientation='left'>
						Role
					</Divider>
					<TableStaticData
						columns={columns}
						data={groupedEquivalency}
						addStt
						otherProps={{
							pagination: false,
							scroll: {
								y: 400,
							},
						}}
					/>
				</Card>
			</Col>

			<Col span={24}>
				<Card variant='borderless' size='small'>
					<Divider className='divider-big-title' orientation='left'>
						Competency
					</Divider>
					<div className='competency-list'>
						{record?.competencyList?.map((item) => (
							<div className='competency-item'>
								<span className='competency-title'>{item?.competency?.name}</span>
								<p className='competency-desc'>{item?.competency?.description}</p>
							</div>
						))}
					</div>
				</Card>
			</Col>

			<Col span={24}>
				<Card variant='borderless' size='small'>
					<Divider className='divider-big-title' orientation='left' style={{ marginTop: 0, marginBottom: 6 }}>
						Activity Description
					</Divider>
					<span>{record?.description}</span>
				</Card>
			</Col>
		</Row>
	);
};

export default CardChiTietSuKien;
