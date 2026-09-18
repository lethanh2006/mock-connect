import rules from '@/utils/rules';
import { Col, Row } from '@/components/MyGrid';
import Input from '@/components/MyInput';
import { Form } from 'antd';
import React from 'react';
import { useIntl } from 'umi';
import type { InvoiceFormProps } from './typing';

const InvoiceForm: React.FC<InvoiceFormProps> = ({ userFullname, userCode, visible, form }) => {
	const intl = useIntl();

	if (!visible) return null;

	return (
		<Form form={form} layout='vertical' className='payment-detail__invoice-form' requiredMark={false}>
			<div className='payment-detail__invoice-form-title'>
				{intl.formatMessage({ id: 'taichinh.thanhtoan.invoice.title' })}
			</div>
			<Row gutter={[12, 12]}>
				<Col xs={24} md={12}>
					<Form.Item
						label={
							<span className='payment-detail__invoice-form-label'>
								{intl.formatMessage({ id: 'taichinh.thanhtoan.invoice.studentName' })}
							</span>
						}
					>
						<Input value={userFullname} disabled />
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item
						label={
							<span className='payment-detail__invoice-form-label'>
								{intl.formatMessage({ id: 'taichinh.thanhtoan.invoice.studentId' })}
							</span>
						}
					>
						<Input value={userCode} disabled />
					</Form.Item>
				</Col>
				<Col xs={24} md={24}>
					<Form.Item
						name='tenToChuc'
						label={
							<span className='payment-detail__invoice-form-label'>
								{intl.formatMessage({ id: 'taichinh.thanhtoan.invoice.companyName' })}
							</span>
						}
						rules={[...rules.required]}
					>
						<Input placeholder={intl.formatMessage({ id: 'taichinh.thanhtoan.invoice.companyName.placeholder' })} />
					</Form.Item>
				</Col>
				<Col xs={24} md={24}>
					<Form.Item
						name='maSoThue'
						label={
							<span className='payment-detail__invoice-form-label'>
								{intl.formatMessage({ id: 'taichinh.thanhtoan.invoice.taxCode' })}
							</span>
						}
						rules={[...rules.required]}
					>
						<Input placeholder={intl.formatMessage({ id: 'taichinh.thanhtoan.invoice.taxCode.placeholder' })} />
					</Form.Item>
				</Col>
				<Col xs={24}>
					<Form.Item
						name='diaChi'
						label={
							<span className='payment-detail__invoice-form-label'>
								{intl.formatMessage({ id: 'taichinh.thanhtoan.invoice.address' })}
							</span>
						}
						rules={[...rules.required]}
					>
						<Input placeholder={intl.formatMessage({ id: 'taichinh.thanhtoan.invoice.address.placeholder' })} />
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item
						name='emailNhanHoaDonDienTu'
						label={
							<span className='payment-detail__invoice-form-label'>
								{intl.formatMessage({ id: 'taichinh.thanhtoan.invoice.email' })}
							</span>
						}
						rules={[{ type: 'email', message: intl.formatMessage({ id: 'taichinh.thanhtoan.invoice.email.invalid' }) }]}
					>
						<Input placeholder={intl.formatMessage({ id: 'taichinh.thanhtoan.invoice.email.placeholder' })} />
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item
						name='userSoDienThoai'
						rules={[...rules.soDienThoai]}
						label={
							<span className='payment-detail__invoice-form-label'>
								{intl.formatMessage({ id: 'taichinh.thanhtoan.invoice.phone' })}
							</span>
						}
					>
						<Input placeholder={intl.formatMessage({ id: 'taichinh.thanhtoan.invoice.phone.placeholder' })} />
					</Form.Item>
				</Col>
			</Row>
		</Form>
	);
};

export default InvoiceForm;
