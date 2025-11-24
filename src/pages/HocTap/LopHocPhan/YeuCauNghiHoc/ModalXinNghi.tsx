import UploadFile from '@/components/Upload/UploadFile';
import { YeuCauNghiHoc } from '@/services/DaoTao/YeuCauNghiHoc/typing';
import { buildUpLoadFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Descriptions, Form, Input, Modal } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useModel } from 'umi';

const ModalXinNghi = (props: { visible: boolean; onClose: () => void }) => {
	const { visible, onClose } = props;
	const [form] = Form.useForm();
	const { record: recLopHocPhan } = useModel('lophocphan.lophocphan');
	const { record: recTKB } = useModel('daotao.thoikhoabieu');
	const { postModel, formSubmiting, setFormSubmiting, getModel } = useModel('daotao.dangkynghihoc');

	useEffect(() => {
		if (!visible) resetFieldsForm(form);
	}, [visible]);

	const onFinish = async (values: YeuCauNghiHoc.IRecord) => {
		try {
			setFormSubmiting(true);
			const urlMinhChung = await buildUpLoadFile(values, 'urlMinhChung');
			setFormSubmiting(false);

			const payload = {
				...values,
				tenLopHocPhan: recLopHocPhan?.ten,
				thoiKhoaBieuId: recTKB?._id,
				urlMinhChung: urlMinhChung,
			};
			await postModel(payload, () => getModel(recTKB?.tenLopHocPhan ?? '')).then(() => onClose());
		} catch (er) {
			console.log(er);
		}
	};

	return (
		<Modal title='Đăng ký xin nghỉ' open={visible} onCancel={onClose} footer={null} maskClosable={false}>
			<Descriptions className='highlight' layout='vertical' colon={false} column={1} style={{ marginBottom: 16 }}>
				<Descriptions.Item label='Lớp tín chỉ'>
					{recTKB?.tenLopHocPhan ?? ''} ({recLopHocPhan?.hocPhan?.ten ?? ''})
				</Descriptions.Item>
				<Descriptions.Item label='Buổi học'>
					{recTKB?.ngay ? dayjs(recTKB?.ngay).format('DD/MM/YYYY') : ''},{' '}
					{recTKB?._id ? `tiết: ${recTKB?.tietBatDau ?? ''} - ${recTKB?.tietKetThuc ?? ''}` : ''}
				</Descriptions.Item>
			</Descriptions>

			<Form form={form} layout='vertical' onFinish={onFinish}>
				<Form.Item name='lyDo' label='Lý do' rules={[...rules.required]}>
					<Input.TextArea placeholder='Nhập lý do xin nghỉ...' />
				</Form.Item>

				<Form.Item name='urlMinhChung' label='Minh chứng' rules={[...rules.required, ...rules.fileRequired]}>
					<UploadFile
						maxCount={1}
						otherProps={{
							multiple: false,
							accept: '.pdf, .jpg, .jpeg, .png, .doc, .docx',
						}}
					/>
				</Form.Item>

				<i className='text-error'>Sau khi gửi đơn, vui lòng chờ phê duyệt trước khi nghỉ học.</i>

				<div className='form-footer'>
					<Button loading={formSubmiting} type='primary' htmlType='submit'>
						Gửi đơn
					</Button>
					<Button onClick={onClose}>Hủy</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default ModalXinNghi;
