import ExpandText from '@/components/ExpandText';
import ModalExpandable from '@/components/Table/ModalExpandable';
import TableStaticData from '@/components/Table/TableStaticData';
import { IColumn } from '@/components/Table/typing';
import { Activity } from '@/services/CCT/Activity/typing';
import { Button } from '@/components/Icons';
import { Col, Row } from '@/components/MyGrid';
import { Alert, Descriptions, Image, Space, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { useIntl, useModel } from 'umi';
import FormActivityOutCome from '../History/components/Form';

const { Paragraph } = Typography;

const ActivityUpComming = (props: { visible: boolean; setVisible: (val: boolean) => void }) => {
	const { visible, setVisible } = props;
	const intl = useIntl();
	const { record: recOutCome, setIsView } = useModel('cct.activityoutcome');

	const [visibleModal, setVisibleModal] = useState<boolean>(false);

	const record = recOutCome?.activities;

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

	const groupByAttributes = (data: Activity.ICompetencyMappingActivity[]) => {
		const map = new Map<string, any>();

		data.forEach((item) => {
			const key = item.attributesId;

			if (!map.has(key)) {
				map.set(key, {
					...item,
					dsCompetencie: [
						{
							_id: item._id,
							competencie: item.competencie,
						},
					],
				});
			} else {
				map.get(key).dsCompetencie.push({
					_id: item._id,
					competencie: item.competencie,
				});
			}
		});

		return Array.from(map.values());
	};

	const columns: IColumn<any>[] = [
		{
			title: intl.formatMessage({ id: 'activity.detail.role' }),
			width: 150,
			dataIndex: 'roleName',
		},
		{
			title: intl.formatMessage({ id: 'activity.detail.des' }),
			width: 220,
			dataIndex: 'desRole',
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
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

	const columnsCompetency: IColumn<any>[] = [
		{
			title: 'Attributes',
			dataIndex: 'attributesId',
			width: 200,
			render: (val, rec) => <Tag color={rec?.attributes?.color}>{rec?.attributes?.name}</Tag>,
		},
		{
			title: 'Competency',
			dataIndex: 'dsCompetencie',
			width: 250,
			render: (val, rec: any) =>
				rec?.dsCompetencie
					?.map((item: any) => item?.competencie?.name)
					.filter(Boolean)
					.join(', '),
		},
	];

	return (
		<>
			<ModalExpandable title={record?.name} open={visible} onCancel={() => setVisible(false)} width={800} footer={null}>
				<div style={{ marginBottom: 16, marginTop: -12 }}>
					<Alert showIcon type='warning' description={intl.formatMessage({ id: 'activity.detail.warning' })} />
				</div>
				<Row gutter={24}>
					<Col span={8} style={{ textAlign: 'center' }}>
						<Image
							src={record?.banner ?? '/student/metadata.png'}
							alt='banner'
							style={{
								width: '100%',
								borderRadius: 8,
								objectFit: 'cover',
							}}
						/>
					</Col>

					<Col span={16}>
						<Descriptions column={1} size='small'>
							{record?.activitiesType?.attributes && (
								<Descriptions.Item label={intl.formatMessage({ id: 'activity.detail.type' })}>
									<Space wrap>
										{record?.activitiesType?.attributes?.map((item: any) => (
											<Tag color={item?.color}>{item?.name}</Tag>
										))}
									</Space>
								</Descriptions.Item>
							)}

							<Descriptions.Item label={intl.formatMessage({ id: 'activity.detail.coCurricularName' })}>
								{record?.name}
							</Descriptions.Item>

							<Descriptions.Item label={intl.formatMessage({ id: 'activity.detail.startDate' })}>
								{record?.startDate && dayjs(record?.startDate).format('HH:mm DD/MM/YYYY')}
							</Descriptions.Item>

							<Descriptions.Item label={intl.formatMessage({ id: 'activity.detail.endDate' })}>
								{record?.endDate && dayjs(record?.endDate).format('HH:mm DD/MM/YYYY')}
							</Descriptions.Item>

							<Descriptions.Item label={intl.formatMessage({ id: 'activity.detail.organizer' })}>
								{record?.organizer}
							</Descriptions.Item>

							<Descriptions.Item label={intl.formatMessage({ id: 'activity.detail.location' })}>
								{record?.onCampus ? record?.facilityName : record?.otherAddress}
							</Descriptions.Item>

							<Descriptions.Item label={intl.formatMessage({ id: 'activity.detail.description' })}>
								<Paragraph style={{ marginBottom: 0 }}>{record?.description}</Paragraph>
							</Descriptions.Item>

							{record?.allowPostEventResultsUpdate && (
								<>
									<Descriptions.Item label='Allow post-event results update'>
										{record?.allowPostEventResultsUpdate ? 'Allow' : 'Not allow'}
									</Descriptions.Item>
									<Descriptions.Item label='Due date'>
										{record?.dueDate && dayjs(record?.dueDate).format('HH:mm DD/MM/YYYY')}
									</Descriptions.Item>
								</>
							)}
						</Descriptions>
					</Col>
				</Row>
				<div style={{ padding: '0px 16px 0px 16px' }}>
					<TableStaticData
						columns={columnsCompetency}
						data={groupByAttributes(record?.coCurricularAttributesEquivalency ?? [])}
						size='small'
						addStt
					/>
				</div>
				<div style={{ padding: '0px 16px 0px 16px' }}>
					<TableStaticData columns={columns} data={groupedEquivalency} size='small' addStt />
				</div>
				<div className='form-footer'>
					<Button
						variant='default'
						onClick={() => {
							setVisible(false);
							setVisibleModal(true);
							setIsView(false);
						}}
						disabled={!!record?.workflow || !record?.activitiesTypeId}
					>
						{intl.formatMessage({ id: 'activity.registered.title' })}
					</Button>
					<Button variant='outline' onClick={() => setVisible(false)}>
						{intl.formatMessage({ id: 'global.button.dong' })}
					</Button>
				</div>
			</ModalExpandable>

			<ModalExpandable
				styles={{ body: { padding: 0 } }}
				open={visibleModal}
				onCancel={() => setVisibleModal(false)}
				width={800}
				footer={null}
			>
				<FormActivityOutCome />
			</ModalExpandable>
		</>
	);
};

export default ActivityUpComming;
