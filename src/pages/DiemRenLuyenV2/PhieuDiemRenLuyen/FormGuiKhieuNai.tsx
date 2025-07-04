import UploadFile from '@/components/Upload/UploadFile';
import rules from '@/utils/rules';
import { toISOString, uploadMultiFile } from '@/utils/utils';
import { Button, Form, Input, Modal } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';

const FormGuiKhieuNai = (props: { getData: any }) => {
	const [form] = Form.useForm();
	const { record, guiKhieuNaiModel, loading, setVisibleFormGuiKhieuNai, visibleFormGuiKhieuNai, setLoading } = useModel(
		'diemrenluyenv2.phieudiemrenluyen',
	);

	const onFinish = async (values: any) => {
		try {
			setLoading(true);
			const urlFileDinhKem = await uploadMultiFile(values?.urlFileDinhKem?.fileList ?? []);
			const payload = {
				thoiGianGuiKhieuNai: toISOString(moment()),
				...values,
				urlFileDinhKem,
				info: {
					maSinhVien: record?.maSinhVien,
					hoTen: record?.hoTen,
					lop: record?.lopHanhChinh,
				},
			};
			await guiKhieuNaiModel(record?._id ?? '', payload, props.getData);
			setVisibleFormGuiKhieuNai(false);
			window.scrollTo({ top: 0 });
		} catch (err) {
			setLoading(false);
		}
	};

	return (
		<Modal
			footer={false}
			visible={visibleFormGuiKhieuNai}
			onCancel={() => setVisibleFormGuiKhieuNai(false)}
			title={'Gửi khiếu nại điểm rèn luyện'}
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Form.Item
					initialValue={record?.noiDungKhieuNai}
					name='noiDungKhieuNai'
					label='Nội dung khiếu nại'
					rules={[...rules.required, ...rules.text]}
				>
					<Input.TextArea autoFocus placeholder='Nhập nội dung' />
				</Form.Item>

				<Form.Item name='urlFileDinhKem' label='Tập tin minh chứng (nếu có)'>
					<UploadFile
						maxCount={5}
						accept='image/*, .docx, .doc, .xls, .xlsx, .pdf'
						otherProps={{ showUploadList: { showDownloadIcon: false } }}
					/>
				</Form.Item>

				<div className='form-footer'>
					<Button loading={loading} htmlType='submit' type='primary'>
						{'Gửi'}
					</Button>
					<Button onClick={() => setVisibleFormGuiKhieuNai(false)}>Hủy</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default FormGuiKhieuNai;
