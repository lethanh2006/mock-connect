import rules from '@/utils/rules';
import { Col, Form, Input, Row } from 'antd';
import React from 'react';
import type { InvoiceFormProps } from './typing';

const InvoiceForm: React.FC<InvoiceFormProps> = ({ userFullname, userCode, visible, form }) => {
	if (!visible) return null;

	return (
		<Form form={form} layout='vertical' className='payment-detail__invoice-form' requiredMark={false}>
			<div className='payment-detail__invoice-form-title'>Thông tin hóa đơn</div>
			<Row gutter={[12, 12]}>
				<Col xs={24} md={12}>
					<Form.Item label={<span className='payment-detail__invoice-form-label'>Họ tên sinh viên</span>}>
						<Input value={userFullname} disabled />
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item label={<span className='payment-detail__invoice-form-label'>Mã sinh viên</span>}>
						<Input value={userCode} disabled />
					</Form.Item>
				</Col>
				<Col xs={24} md={24}>
					<Form.Item
						name='tenToChuc'
						label={<span className='payment-detail__invoice-form-label'>Tên của công ty, tổ chức, doanh nghiệp</span>}
						rules={[...rules.required]}
					>
						<Input placeholder='Nhập tên của công ty, tổ chức, doanh nghiệp' />
					</Form.Item>
				</Col>
				<Col xs={24} md={24}>
					<Form.Item
						name='maSoThue'
						label={
							<span className='payment-detail__invoice-form-label'>Mã số thuế của công ty, tổ chức, doanh nghiệp</span>
						}
						rules={[...rules.required]}
					>
						<Input placeholder='Nhập mã số thuế của công ty, tổ chức, doanh nghiệp' />
					</Form.Item>
				</Col>
				<Col xs={24}>
					<Form.Item
						name='diaChi'
						label={
							<span className='payment-detail__invoice-form-label'>Địa chỉ của công ty, tổ chức, doanh nghiệp</span>
						}
						rules={[...rules.required]}
					>
						<Input placeholder='Nhập địa chỉ của công ty, tổ chức, doanh nghiệp' />
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item
						name='emailNhanHoaDonDienTu'
						label={<span className='payment-detail__invoice-form-label'>Email nhận hóa đơn điện tử</span>}
						rules={[{ type: 'email', message: 'Email không hợp lệ' }]}
					>
						<Input placeholder='Nhập email' />
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item
						name='userSoDienThoai'
						rules={[...rules.soDienThoai]}
						label={<span className='payment-detail__invoice-form-label'>Số điện thoại liên hệ</span>}
					>
						<Input placeholder='Nhập số điện thoại' />
					</Form.Item>
				</Col>
			</Row>
		</Form>
	);
};

export default InvoiceForm;
