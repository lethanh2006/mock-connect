import MyDatePicker from '@/components/MyDatePicker';
import { ELoaiSuKien } from '@/services/SuKien/constant';
import { type SuKien } from '@/services/SuKien/typings';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const FormLichCaNhan = (props: { getData: () => void }) => {
	const { record, edit, setVisibleForm, postModel, putModel, formSubmiting, visibleForm } = useModel('sukien.sukien');
	const [startDate, setStartDate] = useState<string>();
	const [form] = Form.useForm();
	const { getData } = props;

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else {
			form.setFieldsValue(record);
			setStartDate(record?.thoiGianBatDau);
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: SuKien.IRecord) => {
		if (edit) {
			putModel(record?._id ?? '', values, getData)
				.then()
				.catch((er) => console.log(er));
		} else
			postModel({ ...values, loaiSuKien: ELoaiSuKien.CA_NHAN }, getData)
				.then()
				.catch((er) => console.log(er));
	};

	return (
		<Card title={edit ? 'Chỉnh sửa sự kiện' : 'Thêm mới sự kiện'}>
			<Form form={form} layout='vertical' onFinish={onFinish}>
				<Row gutter={[12, 0]}>
					<Col xs={24}>
						<Form.Item
							rules={[...rules.required, ...rules.text, ...rules.length(250)]}
							name='tenSuKien'
							label='Tên sự kiện'
						>
							<Input placeholder='Tên sự kiện' />
						</Form.Item>
					</Col>

					<Col xs={24} md={12}>
						<Form.Item rules={[...rules.required]} name='thoiGianBatDau' label='Thời gian bắt đầu'>
							<MyDatePicker
								showTime={{ showHour: true, showMinute: true }}
								format='HH:mm DD/MM/YYYY'
								onChange={(e: any) => {
									setStartDate(e);
									form.validateFields(['thoiGianKetThuc']);
								}}
							/>
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item
							rules={[...rules.required, ...rules.sauNgay(startDate)]}
							name='thoiGianKetThuc'
							label='Thời gian kết thúc'
						>
							<MyDatePicker
								showTime={{ showHour: true, showMinute: true }}
								format='HH:mm DD/MM/YYYY'
								disabledDate={startDate ? (cur) => moment(cur).isBefore(startDate) : undefined}
							/>
						</Form.Item>
					</Col>

					<Col xs={24}>
						<Form.Item rules={[...rules.text, ...rules.length(250)]} name='diaDiem' label='Địa điểm'>
							<Input placeholder='Nhập địa điểm' />
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item rules={[...rules.text, ...rules.length(1000)]} name='ghiChu' label='Ghi chú'>
							<Input.TextArea placeholder='Ghi chú' rows={3} />
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{!edit ? 'Thêm mới' : 'Lưu lại'}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormLichCaNhan;
