import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import SelectCompetency from '../../Competency/Select';

const FormCompetencyMappingModel = (props: any) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { getData, attributesId } = props;
	const { record: recOutCome } = useModel('cct.activityoutcome');
	const { setVisibleForm, visibleForm, edit, postModel, formSubmiting } = useModel('cct.competencymapping');

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
	}, [visibleForm]);

	const onFinish = async (values: any) => {
		const payload = (values.competencieId || []).map((id: string) => ({
			activitiesId: recOutCome?._id,
			competencieId: id,
		}));

		for (const item of payload) {
			await postModel(item, () => {});
		}

		getData();
		setVisibleForm(false);
	};

	return (
		<Card title={edit ? 'Edit Competency Mapping' : 'Add new Competency Mapping'}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col span={24}>
						<Form.Item name='competencieId' label='Competency'>
							<SelectCompetency multiple condition={{ attributesId: attributesId }} />
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{!edit
							? intl.formatMessage({ id: 'global.button.themmoi' })
							: intl.formatMessage({ id: 'global.button.chinhsua' })}
					</Button>

					<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormCompetencyMappingModel;
