import TinyEditor from '@/components/TinyEditor';
import UploadFile from '@/components/Upload/UploadFile';
import { buildUpLoadMultiFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { useModel } from '@umijs/max';
import { Button, Form, Input } from 'antd';
import { useEffect } from 'react';
import AvatarBlog from './Avatar';

interface IProps {
	idLopHocPhan: string;
	getData?: () => void;
}

const FormThemMoiBaiViet = (props: IProps) => {
	const { idLopHocPhan, getData } = props;
	const { visibleForm, postModel, edit, record, putModel, setVisibleForm, formSubmiting, setFormSubmiting } =
		useModel('diendan.baidang');
	const { record: recSinhVien } = useModel('sinhvien.sinhvien');
	const [form] = Form.useForm();

	useEffect(() => {
		if (visibleForm) form.setFieldsValue(record);
		else resetFieldsForm(form);
	}, [visibleForm]);

	const onFinish = async (values: any) => {
		setFormSubmiting(true);
		const fileDinhKem = await buildUpLoadMultiFile(values, 'fileDinhKem');
		const payload = {
			...values,
			lopHocPhanId: idLopHocPhan,
			fileDinhKem: fileDinhKem,
		};
		setFormSubmiting(false);

		if (edit) {
			putModel(record?._id ?? '', payload, () => {
				if (getData) getData();
			});
		} else {
			postModel(payload, () => {
				if (getData) getData();
			});
		}
	};

	return (
		<>
			<div>
				<div style={{ display: 'flex', alignItems: 'center' }}>
					<div style={{ flexShrink: 0, marginRight: 8 }}>
						<AvatarBlog
							url={recSinhVien?.anhDaiDienUrl ?? ''}
							name={recSinhVien?.ten}
							style={{ width: 42, height: 42 }}
						/>
					</div>
					<b>{recSinhVien?.ten}</b>
				</div>

				<div style={{ marginTop: 16 }}>
					<Form layout={'vertical'} onFinish={onFinish} form={form}>
						<Form.Item
							name={'tieuDe'}
							label='Tiêu đề bài đăng'
							rules={[...rules.required, ...rules.text, ...rules.length(250)]}
						>
							<Input placeholder='Tiêu đề' />
						</Form.Item>
						<Form.Item name={'noiDung'} label='Nội dung chi tiết' rules={[...rules.text, ...rules.requiredHtml]}>
							<TinyEditor hideMenubar miniToolbar height={500} minHeight={350} />
						</Form.Item>
						<Form.Item name={'fileDinhKem'} label='File đính kèm'>
							<UploadFile resize maxCount={5} accept={'.png, .jpg, .doc, .docx, .pdf'} />
						</Form.Item>

						<div className='form-footer'>
							<Button type={'primary'} htmlType='submit' loading={formSubmiting}>
								{edit ? 'Chỉnh sửa' : 'Đăng bài'}
							</Button>
							<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
						</div>
					</Form>
				</div>
			</div>
		</>
	);
};
export default FormThemMoiBaiViet;
