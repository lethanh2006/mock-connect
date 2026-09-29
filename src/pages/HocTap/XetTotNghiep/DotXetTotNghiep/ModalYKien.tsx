import { type DotXetTotNghiep } from '@/services/HocTap/XetTotNghiep/typing';
import rules from '@/utils/rules';
import { IconWarningTriangle } from '@/components/Icons';
import { Alert, Button, Col, Form, Input, Modal, Row } from 'antd';
import { useIntl, useModel } from 'umi';

const ModalYKien = (props: { type: 'phan-hoi' | 'hoan' }) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { yKienXetTotNghiepModel, record, visibleForm, setVisibleForm, formSubmiting, getDotHienHanhModel } =
		useModel('sinhvien.xettotnghiep');

	const onFinish = async (values: DotXetTotNghiep.ISinhVienDot) => {
		yKienXetTotNghiepModel(record?.ketQuaXetTotNghiep?._id ?? '', props.type, values, getDotHienHanhModel)
			.then()
			.catch((er) => console.log(er));
	};

	return (
		<Modal
			width={600}
			destroyOnClose
			open={visibleForm}
			onCancel={() => setVisibleForm(false)}
			footer={null}
			title={`${props.type === 'hoan' ? intl.formatMessage({ id: 'xettotnghiep.modal.ykien.yeucauhoantn.title' }) : intl.formatMessage({ id: 'xettotnghiep.modal.ykien.guiphanhoi.title' })}`}
		>
			{props.type === 'hoan' ? (
				<Alert
					type='error'
					description={intl.formatMessage({ id: 'xettotnghiep.modal.ykien.hoan.error' })}
					style={{ marginBottom: 10 }}
					showIcon
					icon={<IconWarningTriangle />}
				/>
			) : null}

			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col xs={24}>
						<Form.Item
							name='yKienSinhVien'
							label={intl.formatMessage({ id: 'xettotnghiep.modal.ykien.form.phanhoi.label' })}
							rules={[...rules.required, ...rules.text, ...rules.length(2000)]}
						>
							<Input.TextArea
								placeholder={intl.formatMessage({ id: 'xettotnghiep.modal.ykien.form.phanhoi.placeholder' })}
							/>
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{intl.formatMessage({ id: 'xettotnghiep.modal.ykien.action.save' })}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>
						{intl.formatMessage({ id: 'xettotnghiep.modal.ykien.action.cancel' })}
					</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default ModalYKien;
