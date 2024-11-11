import UploadFile from '@/components/Upload/UploadFile';
import { mapNameDinhDangBaiThi } from '@/services/KhaoThi/constant';
import { buildUpLoadFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { Button, Card, Col, Form, message, Row } from 'antd';
import { useModel } from 'umi';

const FormBaiThiCuoiKy = (props: any) => {
	const { getData } = props;
	const [form] = Form.useForm();
	const { record, setFormSubmiting, formSubmiting, setVisibleForm, nopBaiTapModel } = useModel('khaothi.sinhvienthi');

	const onFinish = async (values: any) => {
		const firstFile = values.urlBaiNop?.fileList?.[0];
		if (firstFile && !record?.dinhDangFileChoPhep?.includes(firstFile.type)) {
			message.error(
				`File không đúng định dạng. Định dạng cho phép (${record?.dinhDangFileChoPhep
					?.map((item) => mapNameDinhDangBaiThi[item])
					.join(', ')})`,
			);
			return;
		} else {
			setFormSubmiting(true);
			const urlBaiNop = await buildUpLoadFile(values, 'urlBaiNop');
			setFormSubmiting(false);

			nopBaiTapModel(record?._id ?? '', { urlBaiNop: [urlBaiNop] }, getData)
				.then(() => setVisibleForm(false))
				.catch((err) => console.log(err));
		}
	};

	return (
		<Card title='Nộp bài tập'>
			<Form scrollToFirstError onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 12]}>
					<Col span={24}>
						<Form.Item rules={[...rules.required]} name='urlBaiNop' label='File bài tập'>
							<UploadFile maxCount={record?.soFilePhaiNop} maxFileSize={record?.dungLuongToiDa} />
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						Nộp bài
					</Button>

					<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormBaiThiCuoiKy;
