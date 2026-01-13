import TableStaticData from '@/components/Table/TableStaticData';
import { IColumn } from '@/components/Table/typing';
import { Button, Card, Checkbox, Col, Modal, Row, Space, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { useIntl, useModel } from 'umi';

const { Text, Paragraph } = Typography;

const ChiTietActivity = (props: { getData?: () => void }) => {
	const { getData } = props;
	const intl = useIntl();
	const { visibleForm, setVisibleForm, record, registerActivityModel } = useModel('cct.activity');

	const groupedEquivalency = useMemo(() => {
		const map = new Map<
			string,
			{
				roleName: string;
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

		{
			title: intl.formatMessage({ id: 'activity.detail.autoApproval' }),
			dataIndex: 'autoApprove',
			width: 90,
			align: 'center',
			render: (val) => <Checkbox checked={val} />,
		},
	];

	return (
		<Modal title={record?.name} open={visibleForm} onCancel={() => setVisibleForm(false)} width={800} footer={null}>
			<Card style={{ marginTop: 16 }} variant='borderless'>
				<Row gutter={24}>
					<Col span={10}>
						<img
							src={record?.banner ?? '/logo.png'}
							alt='banner'
							style={{
								width: '80%',
								borderRadius: 8,
								objectFit: 'cover',
							}}
						/>
					</Col>

					<Col span={14}>
						<Space direction='vertical' size={8}>
							{record?.activitiesType?.attributes?.name && (
								<Tag color={record?.activitiesType?.attributes?.color}>{record?.activitiesType?.attributes?.name}</Tag>
							)}

							<Text>
								<strong>{intl.formatMessage({ id: 'activity.detail.coCurricularName' })}:</strong> {record?.name}
							</Text>

							<Text>
								<strong>{intl.formatMessage({ id: 'activity.detail.startDate' })}:</strong>{' '}
								{dayjs(record?.startDate).format('HH:mm DD/MM/YYYY')}
							</Text>

							<Text>
								<strong>{intl.formatMessage({ id: 'activity.detail.endDate' })}:</strong>{' '}
								{dayjs(record?.endDate).format('HH:mm DD/MM/YYYY')}
							</Text>

							<Text>
								<strong>{intl.formatMessage({ id: 'activity.detail.organizer' })}:</strong> {record?.organizer}
							</Text>

							<Text>
								<strong>{intl.formatMessage({ id: 'activity.detail.location' })}:</strong>{' '}
								{record?.onCampus ? record?.facilityName : record?.otherAddress}
							</Text>

							<Paragraph>
								<strong>{intl.formatMessage({ id: 'activity.detail.description' })}:</strong>
								<br />
								{record?.description}
							</Paragraph>
						</Space>
					</Col>
				</Row>
			</Card>

			<TableStaticData columns={columns} data={groupedEquivalency} size='small' addStt />

			<div className='form-footer'>
				<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>

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
			</div>
		</Modal>
	);
};

export default ChiTietActivity;
