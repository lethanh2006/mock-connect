import MyDatePicker from '@/components/MyDatePicker';
import { ELoaiSuKien } from '@/services/SuKien/constant';
import { type SuKien } from '@/services/SuKien/typings';
import dayjs from '@/utils/dayjs';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Form, Input, Row } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';

const FormLichCaNhan = (props: { getData: () => void }) => {
	const intl = useIntl();
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
		<>
			<Form form={form} layout='vertical' onFinish={onFinish}>
				<Row gutter={[12, 0]}>
					<Col xs={24}>
						<Form.Item
							rules={[...rules.required, ...rules.text, ...rules.length(250)]}
							name='tenSuKien'
							label={intl.formatMessage({ id: 'lichsukien.form.tensv' })}
						>
							<Input placeholder={intl.formatMessage({ id: 'lichsukien.form.tensv.place' })} />
						</Form.Item>
					</Col>

					<Col xs={24} md={12}>
						<Form.Item
							rules={[...rules.required]}
							name='thoiGianBatDau'
							label={intl.formatMessage({ id: 'lichsukien.form.tgbt' })}
						>
							<MyDatePicker
								showTime={{ showHour: true, showMinute: true }}
								format='HH:mm DD/MM/YYYY'
								onChange={(e: any) => {
									setStartDate(e?.toISOString?.() ?? e); // fallback nếu là string
									form.validateFields(['thoiGianKetThuc']);
								}}
								placeholder={intl.formatMessage({ id: 'lichsukien.form.tgbt.place' })}
							/>
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item
							rules={[...rules.required, ...rules.sauNgay(startDate)]}
							name='thoiGianKetThuc'
							label={intl.formatMessage({ id: 'lichsukien.form.tgkt' })}
						>
							<MyDatePicker
								showTime={{ showHour: true, showMinute: true }}
								format='HH:mm DD/MM/YYYY'
								disabledDate={startDate ? (cur) => dayjs(cur).isBefore(dayjs(startDate)) : undefined}
								placeholder={intl.formatMessage({ id: 'lichsukien.form.tgkt.place' })}
							/>
						</Form.Item>
					</Col>

					<Col xs={24}>
						<Form.Item
							rules={[...rules.text, ...rules.length(250)]}
							name='diaDiem'
							label={intl.formatMessage({ id: 'lichsukien.form.diadiem' })}
						>
							<Input placeholder={intl.formatMessage({ id: 'lichsukien.form.diadiem.place' })} />
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item
							rules={[...rules.text, ...rules.length(1000)]}
							name='ghiChu'
							label={intl.formatMessage({ id: 'lichsukien.form.ghichu' })}
						>
							<Input.TextArea placeholder={intl.formatMessage({ id: 'lichsukien.form.ghichu.place' })} rows={3} />
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{!edit
							? intl.formatMessage({ id: 'global.button.themmoi' })
							: intl.formatMessage({ id: 'global.button.luulai' })}
					</Button>
					<Button onClick={() => setVisibleForm(false)}> {intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
		</>
	);
};

export default FormLichCaNhan;
