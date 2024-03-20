import rules from '@/utils/rules';
import { Col, Form, Input, InputNumber, Row } from 'antd';

const FormSucKhoe = () => {
	return (
		<Row gutter={[12, 0]}>
			<Col span={12} md={8}>
				<Form.Item name='chieuCao' label='Chiều cao (cm)' rules={[...rules.number(300, 0),...rules.required]}>
					<InputNumber placeholder='Nhập chiều cao' style={{ width: '100%' }} />
				</Form.Item>
			</Col>
			<Col span={12} md={8}>
				<Form.Item name='canNang' label='Cân nặng (kg)' rules={[...rules.number(300, 0),...rules.required]}>
					<InputNumber placeholder='Nhập cân nặng' style={{ width: '100%' }} />
				</Form.Item>
			</Col>
			<Col span={12} md={8}>
				<Form.Item name='loaiKhuyetTat' label='Loại khuyết tật' rules={[...rules.text, ...rules.length(250)]}>
					<Input placeholder='Nhập loại khuyết tật' />
				</Form.Item>
			</Col>

			<Col span={12} md={12}>
				<Form.Item name='soBaoHiemSinhVien' label='Số thẻ BHYT' rules={[...rules.text, ...rules.length(20),...rules.required]}>
					<Input placeholder='Nhập số thẻ BHYT' />
				</Form.Item>
			</Col>
			<Col span={24} md={12}>
				<Form.Item
					name='maBenhVienKhamChuaBenh'
					label='Mã bệnh viện khám chữa bệnh'
					rules={[...rules.text, ...rules.length(20)]}
				>
					<Input placeholder='Nhập mã bệnh viện' />
				</Form.Item>
			</Col>
		</Row>
	);
};

export default FormSucKhoe;
