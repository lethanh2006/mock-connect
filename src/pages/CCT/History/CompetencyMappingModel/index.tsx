import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { Activity } from '@/services/CCT/Activity/typing';
import { DeleteOutlined } from '@ant-design/icons';
import { Modal, Popconfirm, Tag } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import FormCompetencyMappingModel from './Form';

const CompetencyMappingModelPage = (props: { disabled?: boolean }) => {
	const intl = useIntl();
	const { disabled } = props;
	const { record: recActivity } = useModel('cct.activityoutcome');
	const {
		getAllModel,
		// setRecord,
		// setEdit,
		// setIsView,
		setVisibleForm,
		deleteManyModel,
		danhSach,
		loading,
		visibleForm,
		edit,
	} = useModel('cct.competencymapping');

	const getData = () => {
		if (recActivity?._id)
			getAllModel(undefined, undefined, {
				activityOutcomeId: recActivity?._id,
			});
	};

	useEffect(() => {
		getData();
	}, [recActivity?._id]);

	const groupByAttributes = (data: Activity.ICompetencyMapping[]) => {
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

	const handleDelete = (rec: Activity.ICompetencyMapping) => {
		const ids = rec?.dsCompetencie?.map((item) => item._id);

		if (ids?.length) deleteManyModel(ids, getData);
	};

	const columns: IColumn<Activity.ICompetencyMapping>[] = [
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
		{
			title: intl.formatMessage({ id: 'global.column.action' }),
			align: 'center',
			width: 60,
			fixed: 'right',
			render: (val, rec) => (
				<Popconfirm
					onConfirm={() => handleDelete(rec)}
					title='Do you want to remove?'
					placement='topLeft'
					disabled={disabled}
				>
					<ButtonExtend
						disabled={disabled}
						tooltip={intl.formatMessage({ id: 'global.button.xoa' })}
						danger
						type='link'
						icon={<DeleteOutlined />}
					/>
				</Popconfirm>
			),
		},
	];

	return (
		<>
			{groupByAttributes(danhSach ?? [])?.length > 2
				? [<i className='text-info'>The activity should only have 2 Attributes Competency Mapping.</i>]
				: undefined}
			<TableStaticData
				columns={columns}
				data={groupByAttributes(danhSach ?? [])}
				loading={loading}
				size='small'
				hasTotal
				onReload={getData}
			>
				{/* {!disabled && (
					<Button
						disabled={disabled}
						onClick={() => {
							setRecord({} as Activity.ICompetencyMapping);
							setEdit(false);
							setIsView(false);
							setVisibleForm(true);
						}}
						size='small'
						type='primary'
					>
						{intl.formatMessage({ id: 'global.button.themmoi' })}
					</Button>
				)} */}
			</TableStaticData>

			<Modal
				title={`${edit ? intl.formatMessage({ id: 'global.button.chinhsua' }) : intl.formatMessage({ id: 'global.button.themmoi' })} Competency Mapping`}
				open={visibleForm}
				width={600}
				footer={null}
				onCancel={() => setVisibleForm(false)}
			>
				<FormCompetencyMappingModel getData={getData} />
			</Modal>
		</>
	);
};

export default CompetencyMappingModelPage;
