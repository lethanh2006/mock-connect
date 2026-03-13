import UploadFile from '@/components/Upload/UploadFile';
import { ELoaiUngDungTrongHocVien, MapKeyNameLoaiUngDungTrongHocVien } from '@/services/KhoaHoc/DeTaiKHCN/constants';
import type { DeTaiKHCN } from '@/services/KhoaHoc/DeTaiKHCN/typings';
import { buildUpLoadMultiFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { Button, Card, Form, Input, Select, message } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const FormUngDungTrongHocVien = (props: { onCancel: any; record?: DeTaiKHCN.UngDungHocVien; edit: boolean }) => {
	const [form] = Form.useForm();
	const { record, edit } = props;
	const { record: recDeTai, setRecord: setRecDeTai } = useModel('khoahoc.detaikhcn');
	const [loading, setLoading] = useState<boolean>(false);
	useEffect(() => {
		if (record && edit) {
			form.setFieldsValue({
				...record,
			});
		} else {
			form.setFieldsValue({ ...form });
		}
	}, [record]);

	const onFinish = async (values: DeTaiKHCN.UngDungHocVien) => {
		try {
			setLoading(true);
			const minhChungUrl = await buildUpLoadMultiFile(values, 'minhChungUrl');
			const payload: any = {
				...values,
				minhChungUrl,
			};
			if (edit && record && recDeTai) {
				const index = recDeTai.nghiemThuKhcn.noiDungUngDungHocVien
					.map((item, indexTemp: number) => indexTemp + 1)
					.indexOf(record.index);
				const noiDungUngDungHocVien = [...recDeTai.nghiemThuKhcn.noiDungUngDungHocVien];
				noiDungUngDungHocVien.splice(index, 1, { ...record, ...payload });
				setRecDeTai({
					...recDeTai,
					nghiemThuKhcn: {
						...recDeTai?.nghiemThuKhcn,
						noiDungUngDungHocVien,
					},
				});
			} else {
				const length = recDeTai?.nghiemThuKhcn?.noiDungUngDungHocVien?.length;
				setRecDeTai({
					...(recDeTai || {}),
					nghiemThuKhcn: {
						...recDeTai?.nghiemThuKhcn,
						noiDungUngDungHocVien: [
							...(recDeTai?.nghiemThuKhcn?.noiDungUngDungHocVien ?? []),
							{ ...payload, index: length ? length + 1 : 1 },
						],
					},
				} as DeTaiKHCN.IRecord);
			}

			message.success(edit ? 'Sửa thành công' : 'Thêm thành công');
			props.onCancel();
		} catch (err) {
			setLoading(false);
		}
	};

	return (
		<Card title={(edit ? 'Chỉnh sửa ' : 'Thêm mới ') + 'ứng dụng'}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Form.Item rules={[...rules.required]} style={{ marginBottom: 10 }} label='Loại ứng dụng' name={'loaiUngDung'}>
					<Select
						placeholder='Loại ứng dụng'
						options={Object.values(ELoaiUngDungTrongHocVien).map((item) => ({
							value: item,
							label: MapKeyNameLoaiUngDungTrongHocVien[item],
						}))}
					/>
				</Form.Item>
				<Form.Item
					rules={[...rules.required, ...rules.text]}
					style={{ marginBottom: 10 }}
					label='Nội dung'
					name={'noiDungUngDung'}
				>
					<Input.TextArea rows={3} placeholder='Nội dung' />
				</Form.Item>

				<Form.Item rules={[...rules.required]} label='Minh chứng' name='minhChungUrl'>
					<UploadFile
						maxCount={5}
						accept='.doc, .docx, .pdf'
						otherProps={{
							multiple: true,
							showUploadList: { showDownloadIcon: false },
						}}
					/>
				</Form.Item>

				<div className='form-footer'>
					<Button loading={loading} htmlType='submit' type='primary'>
						{!edit ? 'Thêm mới' : 'Lưu lại'}
					</Button>
					<Button onClick={() => props.onCancel()}>Hủy</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormUngDungTrongHocVien;
