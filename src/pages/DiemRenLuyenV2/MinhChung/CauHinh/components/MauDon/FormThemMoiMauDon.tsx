import UploadFile from '@/components/Upload/UploadFile';
import { QuyTrinh } from '@/services/FormDong/QuyTrinh/typing';
import { buildUpLoadFile, getFileById } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { removeVietnameseTones, resetFieldsForm } from '@/utils/utils';
import { useModel } from '@@/plugin-model/useModel';
import { Button, Card, Form, Input, Select, message } from 'antd';
import fileDownload from 'js-file-download';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import TableCauHinh from './TableCauHinh';

const FormThemMoiMauDon = () => {
	const [form] = Form.useForm();
	const {
		recordMauDon,
		record,
		formSubmiting,
		setRecord,
		visibleDanhSachMauDon,
		setVisibleDanhSachMauDon,
		editMauDon,
	} = useModel('quytrinh.quanlyquytrinh');
	const [formValues, setFormValues] = useState<any>(record);

	useEffect(() => {
		if (!visibleDanhSachMauDon) resetFieldsForm(form);
		else if (recordMauDon?.ma) form.setFieldsValue({ ...recordMauDon });
	}, [recordMauDon?.ma, visibleDanhSachMauDon]);

	const onFinish = async (values: any) => {
		const listMaCauHinh = editMauDon
			? record?.danhSachFormKhaiBao.filter((item) => item.ma !== recordMauDon?.ma)
			: record?.danhSachFormKhaiBao;

		if (listMaCauHinh?.map((item) => item.ma)?.includes(values?.ma)) {
			message.error('Mã đã tồn tại');
			return;
		}

		const arr = record?.danhSachFormKhaiBao ? [...record?.danhSachFormKhaiBao] : [];

		const resUploadFile = await buildUpLoadFile(values, 'fileId', undefined, true);
		const payload: QuyTrinh.IMauDon = {
			...recordMauDon,
			...values,
			ten: values?.ten,
			ma: values?.ma,
			fileId: resUploadFile
				? typeof resUploadFile === 'string'
					? resUploadFile
					: resUploadFile?.data?.data?.file?._id
				: undefined,
			file: resUploadFile
				? typeof resUploadFile === 'string'
					? recordMauDon?.file ?? {}
					: [resUploadFile?.data?.data?.file ?? {}]
				: undefined,
		} as QuyTrinh.IMauDon;

		const objFind = arr.find((item) => item.ma === payload?.ma);
		if (objFind) {
			arr.forEach((item, i) => {
				if (item?.ma === payload?.ma) {
					arr.splice(i, 1, payload);
				}
			});
		} else {
			arr?.push(payload as QuyTrinh.IMauDon);
		}

		setRecord({
			...record,
			danhSachFormKhaiBao: arr,
		} as QuyTrinh.IRecord);

		setVisibleDanhSachMauDon(false);
	};

	const handlePreview = async (file: any) => {
		if (!file || !file.url) return;
		const res = await getFileById(file?.url);
		fileDownload(res.data, file?.name ?? '');
	};

	return (
		<Card title={(editMauDon ? 'Chỉnh sửa ' : 'Thêm mới ') + 'biểu mẫu'}>
			<Form
				onValuesChange={(changedValues, values) => {
					setFormValues(values);
				}}
				onFinish={onFinish}
				form={form}
				layout='vertical'
			>
				<Form.Item name='ten' label='Tên biểu mẫu' rules={[...rules.required, ...rules.text]}>
					<Input
						onChange={(e) => {
							if (!editMauDon) form.setFieldsValue({ ma: _.camelCase(removeVietnameseTones(e?.target?.value ?? '')) });
						}}
						placeholder='Tên biểu mẫu'
					/>
				</Form.Item>
				<Form.Item name='ma' label='Mã biểu mẫu' rules={[...rules.required, ...rules.text]}>
					<Input placeholder='Mã biểu mẫu' disabled={editMauDon} />
				</Form.Item>
				<Form.Item name='fileId' label='File đính kèm'>
					<UploadFile
						fileName={recordMauDon?.file?.[0]?.name}
						handlePreview={handlePreview}
						maxCount={1}
						otherProps={{
							accept: '.docx, .doc',
							showUploadList: { showDownloadIcon: false },
						}}
					/>
				</Form.Item>

				<TableCauHinh form={form} formValues={formValues} />
				<Form.Item
					extra={<div>Để trống nếu muốn hiển thị tất cả các trường thông tin</div>}
					style={{ marginTop: 8 }}
					name='danhSachCotHienThi'
					label='Danh sách cột hiển thị'
					// rules={[...rules.required]}
				>
					<Select
						allowClear
						options={recordMauDon?.cauHinhLoaiHinh?.map((item) => ({ label: item.ten, value: item.ma }))}
						mode='multiple'
						placeholder='Danh sách trường thông tin hiển thị'
					/>
				</Form.Item>
				<div className='form-footer' style={{ marginTop: 16 }}>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{!editMauDon ? 'Thêm mới' : 'Lưu lại'}
					</Button>
					<Button onClick={() => setVisibleDanhSachMauDon(false)}>Hủy</Button>
				</div>
			</Form>
		</Card>
	);
};
export default FormThemMoiMauDon;
