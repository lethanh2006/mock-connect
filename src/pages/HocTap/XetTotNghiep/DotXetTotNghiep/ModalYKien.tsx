import { type DotXetTotNghiep } from '@/services/HocTap/XetTotNghiep/typing';
import rules from '@/utils/rules';
import { WarningFilled } from '@ant-design/icons';
import { Alert, Button, Col, Form, Input, Modal, Row } from 'antd';
import { useModel } from 'umi';

const ModalYKien = (props: { type: 'phan-hoi' | 'hoan' }) => {
	const [form] = Form.useForm();
	const { yKienXetTotNghiepModel, record, visibleForm, setVisibleForm, formSubmiting } =
		useModel('sinhvien.xettotnghiep');

	const onFinish = async (values: DotXetTotNghiep.ISinhVienDot) => {
		yKienXetTotNghiepModel(record?.ketQuaXetTotNghiep?.sinhVienSsoId ?? '', props.type, values)
			.then()
			.catch((er) => console.log(er));
	};

	return (
		<Modal
			width={600}
			destroyOnClose
			visible={visibleForm}
			onCancel={() => setVisibleForm(false)}
			footer={null}
			title={`${props.type === 'hoan' ? 'Yêu cầu hoãn tốt nghiệp' : 'Gửi phản hồi'}`}
		>
			{props.type === 'hoan' ? (
				<Alert
					type='error'
					description='Bạn có chắc hoãn xét tối nghiệp trong đợt này, vui lòng cho biết lý do'
					style={{ marginBottom: 10 }}
					showIcon
					icon={<WarningFilled />}
				/>
			) : null}

			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col xs={24}>
						<Form.Item
							name='yKienSinhVien'
							label='Phản hồi của bạn'
							rules={[...rules.required, ...rules.text, ...rules.length(2000)]}
						>
							<Input placeholder='Nhập phản hồi của bạn' />
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						Lưu lại
					</Button>
					<Button onClick={() => setVisibleForm(false)}>Đóng</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default ModalYKien;
