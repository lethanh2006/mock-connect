import MyDateRangePicker from '@/components/MyDatePicker/RangePicker';
import { ELoaiDeTaiCaNhan } from '@/services/KhoaHoc/DeTaiKHCN/constants';
import type { DeTaiKHCN } from '@/services/KhoaHoc/DeTaiKHCN/typings';
import rules from '@/utils/rules';
import { Button, Card, Form, Input, Select, message } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormTimeline = (props: { onCancel: any; record?: DeTaiKHCN.TimelineThuyetMinh; edit: boolean }) => {
	const [form] = Form.useForm();
	const { record, edit } = props;
	const { record: recDeTai, setRecord: setRecDeTai } = useModel('khoahoc.detaikhcn');
	const isDeTaiTapThe = recDeTai?.dangKyKhcn?.loaiCaNhan === ELoaiDeTaiCaNhan.TAP_THE;
	useEffect(() => {
		if (record && edit) {
			form.setFieldsValue({
				...record,
				thoiGian: record.startDate ? [record.startDate, record.endDate] : undefined,
			});
		} else {
			form.setFieldsValue({ ...form });
		}
	}, [record]);

	const onFinish = async (values: any) => {
		const payload = {
			...values,
			startDate: values?.thoiGian?.[0],
			endDate: values?.thoiGian?.[1],
			thoiGian: undefined,
			danhSachNguoiThucHien: values?.danhSachNguoiThucHien
				? values?.danhSachNguoiThucHien?.map((item: string) =>
						recDeTai?.dangKyKhcn?.danhSachCTV?.find((ele) => ele.userId === item || ele.ten === item),
				  ) ?? []
				: [recDeTai?.dangKyKhcn?.chuTriDeTai],
		};

		if (edit && record && recDeTai) {
			const index = recDeTai.deCuongKhcn.timeline.map((item, indexTemp: number) => indexTemp + 1).indexOf(record.index);
			const timeline = [...recDeTai.deCuongKhcn.timeline];
			timeline.splice(index, 1, { ...record, ...payload });
			setRecDeTai({
				...recDeTai,
				deCuongKhcn: {
					...recDeTai?.deCuongKhcn,
					timeline,
				},
			});
		} else {
			const length = recDeTai?.deCuongKhcn?.timeline?.length;
			setRecDeTai({
				...(recDeTai || {}),
				deCuongKhcn: {
					...recDeTai?.deCuongKhcn,
					timeline: [...(recDeTai?.deCuongKhcn?.timeline ?? []), { ...payload, index: length ? length + 1 : 1 }],
				},
			} as DeTaiKHCN.IRecord);
		}

		message.success(edit ? 'Sửa thành công' : 'Thêm thành công');
		props.onCancel();
	};

	return (
		<Card title={(edit ? 'Chỉnh sửa ' : 'Thêm mới ') + 'nội dung thực hiện'}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Form.Item
					rules={[...rules.required, ...rules.text]}
					style={{ marginBottom: 10 }}
					label='Nội dung thực hiện'
					name={'noiDungTimeline'}
				>
					<Input.TextArea rows={2} placeholder='Nội dung thực hiện' />
				</Form.Item>
				<Form.Item
					rules={[...rules.required, ...rules.text]}
					style={{ marginBottom: 10 }}
					label='Sản phẩm phải đạt'
					name={'ketQuaDuKien'}
				>
					<Input.TextArea rows={2} placeholder='Sản phẩm phải đạt' />
				</Form.Item>
				<Form.Item
					name={['thoiGian']}
					label='Thời gian thực hiện'
					rules={[...rules.required]}
					style={{ marginBottom: 10 }}
				>
					<MyDateRangePicker placeholder={['Từ ngày', 'đến ngày']} format={'DD/MM/YYYY'} />
				</Form.Item>
				{isDeTaiTapThe && (
					<Form.Item
						name={['danhSachNguoiThucHien']}
						label='Người thực hiện'
						rules={[...rules.required]}
						style={{ marginBottom: 10 }}
					>
						<Select
							mode='multiple'
							options={recDeTai?.dangKyKhcn?.danhSachCTV?.map((item) => ({
								value: item.userId || item.ten,
								label: item.ten,
							}))}
							placeholder='Người thực hiện'
						/>
					</Form.Item>
				)}

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

export default FormTimeline;
