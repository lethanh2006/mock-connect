import ExpandText from '@/components/ExpandText';
import TableStaticData from '@/components/Table/TableStaticData';
import { IColumn } from '@/components/Table/typing';
import { Activity } from '@/services/CCT/Activity/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Form, message, Row, Select } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormCompetencyMapping = (props: {
	onOk: (val: Activity.ICompetencyMapping) => void;
	value?: Activity.ICompetencyMapping[];
}) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { onOk, value } = props;
	const { setVisibleForm, visibleForm, edit, record } = useModel('cct.competencymapping');
	const { getAllModel: getAllAttributes, danhSach: dsattributes } = useModel('cct.attributes');
	const {
		getAllModel: getAllAttriCompetency,
		danhSach: dscompetency,
		setDanhSach,
		loading,
	} = useModel('cct.competency');
	const competencieId: string[] = Form.useWatch('competencieId', form);
	const attributesId: string = Form.useWatch('attributesId', form);

	const selectedAttributeIds = value?.map((item) => item.attributesId)?.filter((item) => item !== attributesId) ?? [];

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
			setDanhSach([]);
		} else {
			form.setFieldsValue({
				...record,
				competencieId: record?.dsCompetencie?.map((item) => item?._id),
			});

			getAllAttributes(undefined, { order: 1 }, { isActive: true });
			getAllAttriCompetency();
		}
	}, [visibleForm]);

	const onFinish = async (values: Activity.ICompetencyMapping) => {
		if ((value?.length ?? 0) > 2) {
			return message.error('An activity can have a maximum of 2 attributes.');
		}

		values.attributes = dsattributes?.find((item) => item?._id === values.attributesId);

		values.dsCompetencie = dscompetency?.filter((item) => values.competencieId.includes(item?._id));

		return onOk({ ...values });
	};

	const columns: IColumn<Competency.IRecord>[] = [
		{
			title: 'Name',
			dataIndex: 'name',
			width: 170,
			filterType: 'string',
		},
		{
			title: 'Description',
			dataIndex: 'description',
			width: 250,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
		},
	];

	return (
		<Form onFinish={onFinish} form={form} layout='vertical'>
			<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
				<Col span={24}>
					<Form.Item name='attributesId' label='Attributes' rules={[...rules.required]}>
						<Select
							value={value}
							options={dsattributes
								?.filter((item) => !selectedAttributeIds.includes(item._id))
								?.map((item) => ({
									key: item._id,
									value: item._id,
									label: item.name,
								}))}
							showSearch
							optionFilterProp='label'
							placeholder='Select Attributes'
							style={{ width: '100%' }}
						/>
					</Form.Item>
				</Col>
				<Col span={24}>
					<Form.Item name='competencieId' label='Competency'>
						{competencieId?.length > 3 && (
							<i className='text-error'>An Attribute can have a maximum of 3 Competency points.</i>
						)}
						<TableStaticData
							columns={columns}
							data={dscompetency}
							loading={loading}
							size='small'
							hasTotal
							onReload={getAllAttriCompetency}
							otherProps={{
								pagination: false,
								scroll: { y: 350 },
								rowKey: '_id',
								rowSelection: {
									type: 'checkbox',
									columnWidth: 40,
									selectedRowKeys: competencieId ?? [],
									onChange: (selectedRowKeys: React.Key[]) => {
										form.setFieldsValue({
											competencieId: selectedRowKeys,
										});
									},
								},
							}}
						/>
					</Form.Item>
				</Col>
			</Row>

			<div className='form-footer'>
				<Button htmlType='submit' type='primary' disabled={competencieId?.length > 3}>
					{!edit
						? intl.formatMessage({ id: 'global.button.themmoi' })
						: intl.formatMessage({ id: 'global.button.chinhsua' })}
				</Button>

				<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
			</div>
		</Form>
	);
};

export default FormCompetencyMapping;
