import { Activity } from '@/services/CCT/Activity/typing';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Form, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import SelectCompetency from '../../Competency/Select';

const FormCompetencyMapping = (props: {
	onOk: (val: Activity.ICompetencyMapping[]) => void;
	attributesId?: string;
}) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { onOk, attributesId } = props;
	const { setVisibleForm, visibleForm, edit } = useModel('cct.competencymapping');
	const { danhSach: dscompetency } = useModel('cct.competency');

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
	}, [visibleForm]);

	const onFinish = async (values: any) => {
		const list = values.competencieId?.map((id: any) => {
			const competencie = dscompetency?.find((c) => c._id === id);
			return {
				...values,
				competencieId: id,
				competencie,
			};
		});

		onOk(list);
	};

	return (
		<Form onFinish={onFinish} form={form} layout='vertical'>
			<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
				<Col span={24}>
					<Form.Item name='competencieId' label='Competency'>
						<SelectCompetency multiple condition={{ attributesId: attributesId }} />
					</Form.Item>
				</Col>
			</Row>

			<div className='form-footer'>
				<Button htmlType='submit' type='primary'>
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
