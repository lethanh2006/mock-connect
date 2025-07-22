import MyDatePicker from '@/components/MyDatePicker';
import { ELoaiSuKien } from '@/services/SuKien/constant';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { DownloadOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, Row, Select, TimePicker } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const FormLichCaNhan = (props: { getData: () => void }) => {
	const { record, edit, setVisibleForm, postModel, putModel, formSubmiting, visibleForm } = useModel('sukien.sukien');
	const [form] = Form.useForm();
	const [startDate, setStartDate] = useState<moment.Moment>();

	const { getData } = props;

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
		} else {
			form.setFieldsValue({
				...record,
				ngayBatDau: record?.thoiGianBatDau ? moment(record?.thoiGianBatDau) : undefined,
				ngayKetThuc: record?.thoiGianKetThuc ? moment(record?.thoiGianKetThuc) : undefined,
				gioBatDau: record?.thoiGianBatDau ? moment(record?.thoiGianBatDau) : undefined,
				gioKetThuc: record?.thoiGianKetThuc ? moment(record?.thoiGianKetThuc) : undefined,
			});
			setStartDate(record?.thoiGianBatDau ? moment(record?.thoiGianBatDau) : undefined);
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		const thoiGianBatDau = moment(values.ngayBatDau)
			.set({ hour: values.gioBatDau.hour(), minute: values.gioBatDau.minute() })
			.toISOString();
		const thoiGianKetThuc = moment(values.ngayKetThuc)
			.set({ hour: values.gioKetThuc.hour(), minute: values.gioKetThuc.minute() })
			.toISOString();

		const payload = {
			...values,
			thoiGianBatDau,
			thoiGianKetThuc,
			loaiSuKien: ELoaiSuKien.CA_NHAN,
		};

		if (edit) {
			putModel(record?._id ?? '', payload, getData).catch(console.log);
		} else {
			postModel(payload, getData).catch(console.log);
		}
	};

	return (
		<Card
			title='Thêm sự kiện cá nhân'
			style={{ borderRadius: 16 }}
			headStyle={{
				backgroundColor: '#f5f5f5',
			}}
		>
			<Form form={form} layout='vertical' onFinish={onFinish} style={{ borderRadius: 16 }}>
				<Row gutter={[12, 0]}>
					<Col span={24}>
						<Form.Item
							name='tenSuKien'
							label='Tên sự kiện'
							rules={[...rules.required, ...rules.text, ...rules.length(250)]}
						>
							<Input placeholder='Tên sự kiện' />
						</Form.Item>
					</Col>

					<Col span={12}>
						<Form.Item name='ngayBatDau' label='Ngày bắt đầu' rules={[...rules.required]}>
							<MyDatePicker
								format='DD/MM/YYYY'
								showTime={false}
								onChange={(e) => {
									setStartDate(e ? moment(e) : undefined);
									form.validateFields(['ngayKetThuc']);
								}}
							/>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item name='ngayKetThuc' label='Ngày kết thúc' rules={[...rules.required]}>
							<MyDatePicker
								format='DD/MM/YYYY'
								showTime={false}
								disabledDate={startDate ? (cur) => moment(cur).isBefore(startDate, 'day') : undefined}
							/>
						</Form.Item>
					</Col>

					<Col span={12}>
						<Form.Item name='gioBatDau' label='Thời gian bắt đầu' rules={[...rules.required]}>
							<TimePicker format='HH:mm' style={{ width: '100%' }} />
						</Form.Item>
					</Col>

					<Col span={12}>
						<Form.Item name='gioKetThuc' label='Thời gian kết thúc' rules={[...rules.required]}>
							<TimePicker format='HH:mm' style={{ width: '100%' }} />
						</Form.Item>
					</Col>

					<Col span={24}>
						<Form.Item name='diaDiem' label='Địa chỉ' rules={[...rules.text, ...rules.length(250)]}>
							<Input placeholder='Nhập địa chỉ' />
						</Form.Item>
					</Col>

					<Col span={24}>
						<Form.Item name='nguoiThamGia' label='Thêm người tham gia'>
							<Select
								mode='tags' // Đây là quan trọng nhất để nhập text tự do
								placeholder='Chọn hoặc nhập người tham gia'
								tokenSeparators={[',']} // Ngăn cách nếu người dùng nhập "Enter" hoặc dấu phẩy
								style={{ width: '100%' }}
								options={[
									{ label: 'Nguyễn Đức Minh', value: 'Nguyễn Đức Minh' },
									{ label: 'Đặng Anh Tuấn', value: 'Đặng Anh Tuấn' },
								]}
							/>
						</Form.Item>
					</Col>

					<Col span={24}>
						<Form.Item name='ghiChu' label='Ghi chú' rules={[...rules.text, ...rules.length(1000)]}>
							<Input.TextArea rows={3} placeholder='Ghi chú' />
						</Form.Item>
					</Col>
				</Row>

				<div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '20px' }}>
					<Button onClick={() => setVisibleForm(false)}>Huỷ sự kiện</Button>
					<Button htmlType='submit' type='primary' danger loading={formSubmiting} icon={<DownloadOutlined />}>
						Lưu sự kiện
					</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormLichCaNhan;
