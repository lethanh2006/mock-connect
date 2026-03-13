import UploadFile from '@/components/Upload/UploadFile';
import dayjs from '@/utils/dayjs';
import rules from '@/utils/rules';
import { toISOString, uploadMultiFile } from '@/utils/utils';
import { Button, Form, Input, Modal } from 'antd';
import { useIntl, useModel } from 'umi';

const FormGuiKhieuNai = (props: { getData: any }) => {
	const [form] = Form.useForm();
	const { record, guiKhieuNaiModel, loading, setVisibleFormGuiKhieuNai, visibleFormGuiKhieuNai, setLoading } = useModel(
		'diemrenluyenv2.phieudiemrenluyen',
	);
	const intl = useIntl();

	const onFinish = async (values: any) => {
		try {
			setLoading(true);
			const urlFileDinhKem = await uploadMultiFile(values?.urlFileDinhKem?.fileList ?? []);
			const payload = {
				thoiGianGuiKhieuNai: toISOString(dayjs()),
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
			open={visibleFormGuiKhieuNai}
			onCancel={() => setVisibleFormGuiKhieuNai(false)}
			title={intl.formatMessage({ id: 'diemrenluyen.khieunai.title' })}
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Form.Item
					initialValue={record?.noiDungKhieuNai}
					name='noiDungKhieuNai'
					label={intl.formatMessage({ id: 'diemrenluyen.khieunai.label.noidung' })}
					rules={[...rules.required, ...rules.text]}
				>
					<Input.TextArea autoFocus placeholder={intl.formatMessage({ id: 'diemrenluyen.khieunai.placeholder.noidung' })} />
				</Form.Item>

				<Form.Item name='urlFileDinhKem' label={intl.formatMessage({ id: 'diemrenluyen.form.label.minhchung' })}>
					<UploadFile
						maxCount={5}
						accept='image/*, .docx, .doc, .xls, .xlsx, .pdf'
						otherProps={{ showUploadList: { showDownloadIcon: false } }}
					/>
				</Form.Item>

				<div className='form-footer'>
					<Button loading={loading} htmlType='submit' type='primary'>
						{intl.formatMessage({ id: 'diemrenluyen.footer.button.gui' })}
					</Button>
					<Button onClick={() => setVisibleFormGuiKhieuNai(false)}>{intl.formatMessage({ id: 'diemrenluyen.khieunai.button.huy' })}</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default FormGuiKhieuNai;
