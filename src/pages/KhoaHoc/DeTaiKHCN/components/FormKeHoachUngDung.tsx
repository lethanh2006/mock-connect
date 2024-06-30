import MyDatePicker from '@/components/MyDatePicker';
import type { DeTaiKHCN } from '@/services/KhoaHoc/DeTaiKHCN/typings';
import rules from '@/utils/rules';
import { Button, Card, Form, Input, message } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormKeHoachUngDung = (props: { onCancel: any; record?: DeTaiKHCN.KeHoachUngDung; edit: boolean }) => {
	const [form] = Form.useForm();
	const { record, edit } = props;
	const { record: recDeTai, setRecord: setRecDeTai } = useModel('khoahoc.detaikhcn');

	useEffect(() => {
		if (record && edit) {
			form.setFieldsValue({
				...record,
			});
		} else {
			form.setFieldsValue({ ...form });
		}
	}, [record]);

	const onFinish = async (values: DeTaiKHCN.KeHoachUngDung) => {
		const payload = {
			...values,
		};

		if (edit && record && recDeTai) {
			const index = recDeTai.nghiemThuKhcn.keHoachUngDung
				.map((item, indexTemp: number) => indexTemp + 1)
				.indexOf(record.index);
			const keHoachUngDung = [...recDeTai.nghiemThuKhcn.keHoachUngDung];
			keHoachUngDung.splice(index, 1, { ...record, ...payload });
			setRecDeTai({
				...recDeTai,
				nghiemThuKhcn: {
					...recDeTai?.nghiemThuKhcn,
					keHoachUngDung,
				},
			});
		} else {
			const length = recDeTai?.nghiemThuKhcn?.keHoachUngDung?.length;
			setRecDeTai({
				...(recDeTai || {}),
				nghiemThuKhcn: {
					...recDeTai?.nghiemThuKhcn,
					keHoachUngDung: [
						...(recDeTai?.nghiemThuKhcn?.keHoachUngDung ?? []),
						{ ...payload, index: length ? length + 1 : 1 },
					],
				},
			} as DeTaiKHCN.IRecord);
		}

		message.success(edit ? 'Sửa thành công' : 'Thêm thành công');
		props.onCancel();
	};

	return (
		<Card title={(edit ? 'Chỉnh sửa ' : 'Thêm mới ') + 'kế hoạch ứng dụng'}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Form.Item
					rules={[...rules.required, ...rules.text]}
					style={{ marginBottom: 10 }}
					label='Nội dung ứng dụng'
					name={'noiDung'}
				>
					<Input.TextArea rows={3} placeholder='Nội dung ứng dụng' />
				</Form.Item>

				<Form.Item name={['thoiGian']} label='Thời gian' rules={[...rules.required]} style={{ marginBottom: 10 }}>
					<MyDatePicker placeholder={'Thời gian'} format={'DD/MM/YYYY'} />
				</Form.Item>

				<Form.Item
					rules={[...rules.required, ...rules.text]}
					style={{ marginBottom: 10 }}
					label='Địa điểm tiếp nhận ứng dụng'
					name={'diaDiem'}
				>
					<Input.TextArea rows={3} placeholder='Địa điểm tiếp nhận ứng dụng' />
				</Form.Item>

				<Form.Item
					rules={[...rules.required, ...rules.text]}
					style={{ marginBottom: 10 }}
					label='Yêu cầu, đầu ra chủ yếu'
					name={'yeuCau'}
				>
					<Input.TextArea rows={3} placeholder='Yêu cầu, đầu ra chủ yếu' />
				</Form.Item>

				<div className='form-footer'>
					<Button htmlType='submit' type='primary'>
						{!edit ? 'Thêm mới' : 'Lưu lại'}
					</Button>
					<Button onClick={() => props.onCancel()}>Hủy</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormKeHoachUngDung;
