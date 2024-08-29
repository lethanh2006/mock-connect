import {  Button, Form, Input } from 'antd';
import rules from '@/utils/rules';
import TinyEditor from '@/components/TinyEditor';
import UploadFile from '@/components/Upload/UploadFile';
import { useEffect } from 'react';
import { resetFieldsForm } from '@/utils/utils';
import { useModel } from '@@/plugin-model/useModel';
import { buildUpLoadMultiFile } from '@/services/uploadFile';
import AvatarBlog from './Avatar';

interface IProps {
	idLopHocPhan: string;
	getData?: () => void;
}

const FormThemMoiBaiViet = (props: IProps) => {
	const { idLopHocPhan, getData } = props;
	const { postModel, edit, record, putModel, setVisibleForm } = useModel('diendan.baidang');
	const { record: recNhanSu } = useModel('sinhvien.sinhvien');
	const [form] = Form.useForm();

	const onFinish = async (values: any) => {
		try {
			const fileDinhKem = await buildUpLoadMultiFile(values, 'fileDinhKem');
			const payload = {
				...values,
				lopHocPhanId: idLopHocPhan,
				fileDinhKem: fileDinhKem,
			};
			if (edit) {
				putModel(record?._id ?? '', { ...payload }, () => {
					setVisibleForm(false);
					if (getData) getData();
				});
			} else {
				postModel({ ...payload }, () => {
					setVisibleForm(false);
					if (getData) getData();
				});
			}
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		if (edit && record?._id) {
			form.setFieldsValue({ ...record });
		} else {
			resetFieldsForm(form);
		}
	}, [edit, record]);

	return (
		<>
			<div>
				<div style={{ display: 'flex', alignItems: 'center' }}>
					<div style={{ flexShrink: 0, marginRight: 8 }}>
						<AvatarBlog url={recNhanSu?.anhDaiDienUrl??''} style={{ width: 42, height: 42 }} />
					</div>
					<div
						onClick={() => {
							setVisibleForm(true);
						}}
					>
						{recNhanSu?.ten}
					</div>
				</div>
				<div style={{ marginTop: 20 }}>
					<Form layout={'vertical'} onFinish={onFinish} form={form}>
						<Form.Item name={'tieuDe'} label='Tiêu đề' rules={[...rules.required, ...rules.text]}>
							<Input placeholder='Tiêu đề' />
						</Form.Item>
						<Form.Item name={'noiDung'} label='Nội dung' rules={[...rules.required]}>
							<TinyEditor hideMenubar miniToolbar height={350} minHeight={350} />
						</Form.Item>
						<Form.Item name={'fileDinhKem'} label='File đính kèm'>
							<UploadFile
								otherProps={{
									maxCount: 5,
									multiple: true,
									// showUploadList: { showDownloadIcon: false },
								}}
								maxCount={5}
								accept={'.png, .jpg, .doc, .docx, .pdf'}
							/>
						</Form.Item>
						<div className='form-footer'>
							<Button type={'primary'} htmlType='submit'>
								{edit ? 'Chỉnh sửa' : 'Đăng bài'}
							</Button>
							<Button
								onClick={() => {
									setVisibleForm(false);
								}}
							>
								Đóng
							</Button>
						</div>
					</Form>
				</div>
			</div>
		</>
	);
};
export default FormThemMoiBaiViet;
