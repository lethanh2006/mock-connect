import ExpandText from '@/components/ExpandText';
import TableStaticData from '@/components/Table/TableStaticData';
import { IColumn } from '@/components/Table/typing';
import { Activity } from '@/services/CCT/Activity/typing';
import { Button, Col, Descriptions, Image, Modal, Row, Space, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { useIntl, useModel } from 'umi';

const { Paragraph } = Typography;

const ChiTietActivity = (props: { getData?: () => void }) => {
	const { getData } = props;
	const intl = useIntl();
	const { visibleForm, setVisibleForm, record, registerActivityModel } = useModel('cct.activity');

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
		<Modal title={record?.name} open={visibleForm} onCancel={() => setVisibleForm(false)} width={800} footer={null}>
			<Row gutter={24}>
				<Col span={8} style={{ textAlign: 'center' }}>
					<Image
						src={record?.banner ?? '/logo.png'}
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
						{record?.activitiesType?.attributes?.name && (
							<Descriptions.Item label={intl.formatMessage({ id: 'activity.detail.type' })}>
								<Tag color={record?.activitiesType?.attributes?.color}>{record?.activitiesType?.attributes?.name}</Tag>
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
					type='primary'
					onClick={() =>
						registerActivityModel(
							record?._id ?? '',
							getData,
							intl.formatMessage({ id: 'global.message.luuthanhcong' }),
						).then(() => setVisibleForm(false))
					}
					disabled={!!record?.workflow || !record?.activitiesTypeId}
				>
					{intl.formatMessage({ id: 'activity.btn.dangky' })}
				</Button>
				<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
			</div>
		</Modal>
	);
};

export default ChiTietActivity;
