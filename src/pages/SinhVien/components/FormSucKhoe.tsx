import SelectCategory from '@/pages/Core/Category/SelectCategory';
import rules from '@/utils/rules';
import { Col, Row } from '@/components/MyGrid';
import Input, { InputNumber } from '@/components/MyInput';
import { Form } from 'antd';
import { useIntl } from 'umi';

const FormSucKhoe = () => {
	const intl = useIntl();

	return (
		<Row gutter={[12, 0]}>
			<Col span={12} md={8}>
				<Form.Item
					name='chieuCao'
					label={intl.formatMessage({ id: 'thongtincanhan.form.suckhoe.chieucao' })}
					rules={[...rules.number(300, 0), ...rules.required]}
				>
					<InputNumber
						placeholder={intl.formatMessage({ id: 'thongtincanhan.form.suckhoe.chieucao.place' })}
						style={{ width: '100%' }}
					/>
				</Form.Item>
			</Col>
			<Col span={12} md={8}>
				<Form.Item
					name='canNang'
					label={intl.formatMessage({ id: 'thongtincanhan.form.suckhoe.cannang' })}
					rules={[...rules.number(300, 0), ...rules.required]}
				>
					<InputNumber
						placeholder={intl.formatMessage({ id: 'thongtincanhan.form.suckhoe.cannang.place' })}
						style={{ width: '100%' }}
					/>
				</Form.Item>
			</Col>
			<Col span={12} md={8}>
				<Form.Item
					name='loaiKhuyetTat'
					label={intl.formatMessage({ id: 'thongtincanhan.form.suckhoe.loai' })}
					rules={[...rules.text, ...rules.length(250)]}
				>
					<SelectCategory allowClear category="disability" />
				</Form.Item>
			</Col>

			<Col span={12} md={12}>
				<Form.Item
					name='soBaoHiemSinhVien'
					label={intl.formatMessage({ id: 'thongtincanhan.form.suckhoe.bh' })}
					rules={[...rules.text, ...rules.length(20)]}
				>
					<Input placeholder={intl.formatMessage({ id: 'thongtincanhan.form.suckhoe.bh.place' })} />
				</Form.Item>
			</Col>
			<Col span={24} md={12}>
				<Form.Item
					name='maBenhVienKhamChuaBenh'
					label={intl.formatMessage({ id: 'thongtincanhan.form.suckhoe.benhvien' })}
					rules={[...rules.text, ...rules.length(20)]}
				>
					<Input placeholder={intl.formatMessage({ id: 'thongtincanhan.form.suckhoe.benhvien.place' })} />
				</Form.Item>
			</Col>
			<Col span={24}>
				<Form.Item
					name='ghiChuYTe'
					label={intl.formatMessage({ id: 'thongtincanhan.form.suckhoe.ghichuyte' })}
					rules={[...rules.text, ...rules.length(500)]}
				>
					<Input.TextArea
						rows={3}
						placeholder={intl.formatMessage({ id: 'thongtincanhan.form.suckhoe.ghichuyte.place' })}
					/>
				</Form.Item>
			</Col>
		</Row>
	);
};

export default FormSucKhoe;
