import UploadFile from '@/components/Upload/UploadFile';
import { buildUpLoadFileMultipart, EFileScope } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Form, Modal, Segmented } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import WebcamNhanDienKhuonMat from './Webcam';

const ModalCapNhatAnhNhanDien = (props: { visible: boolean; setVisible: (val: boolean) => void }) => {
	const intl = useIntl();
	const { formSubmiting, updateFaceRegModel, record, setFormSubmiting, setRecord } = useModel('sinhvien.sinhvien');
	const [segmentValue, setSegmentValue] = useState('upload');
	const [form] = Form.useForm();
	const { visible, setVisible } = props;

	useEffect(() => {
		if (visible) form.setFieldsValue(record);
		else resetFieldsForm(form);
	}, [visible]);

	const onFinish = async (values: any) => {
		if (!!values.faceRegImgUrl && typeof values.faceRegImgUrl !== 'string') {
			setFormSubmiting(true);
			await buildUpLoadFileMultipart(values, 'faceRegImgUrl', {
				scope: EFileScope.INTERNAL,
				module: 'khuon-mat',
				returnValue: 'url',
			})
				.then((faceRegImgUrl) => (values.faceRegImgUrl = faceRegImgUrl))
				.catch(() => (values.faceRegImgUrl = null))
				.finally(() => setFormSubmiting(false));
		}
		if (!!values.faceRegImgUrl && typeof values.faceRegImgUrl === 'string')
			updateFaceRegModel(values, () => {})
				.then(() => {
					if (record?._id) setRecord({ ...record, faceRegImgUrl: values.faceRegImgUrl });
					setVisible(false);
				})
				.catch(console.log);
	};

	return (
		<Modal
			title={intl.formatMessage({ id: 'thongtincanhan.khuonmat.title' })}
			open={visible}
			onCancel={() => setVisible(false)}
			footer={null}
			width={800}
			destroyOnClose
		>
			<div style={{ marginBottom: 12 }}>{intl.formatMessage({ id: 'thongtincanhan.khuonmat.desc' })}</div>

			<div className='fw500'>{intl.formatMessage({ id: 'thongtincanhan.khuonmat.dieukien' })}</div>
			<ol>
				<li>
					<b>{intl.formatMessage({ id: 'thongtincanhan.khuonmat.anhsang' })}</b>{' '}
					{intl.formatMessage({ id: 'thongtincanhan.khuonmat.anhsang.desc' })}
				</li>
				<li>
					<b>{intl.formatMessage({ id: 'thongtincanhan.khuonmat.tuthe' })}</b>{' '}
					{intl.formatMessage({ id: 'thongtincanhan.khuonmat.tuthe.desc' })}
				</li>
				<li>
					<b>{intl.formatMessage({ id: 'thongtincanhan.khuonmat.khoangcach' })}</b>{' '}
					{intl.formatMessage({ id: 'thongtincanhan.khuonmat.khoangcach.desc' })}
				</li>
				<li>
					<b>{intl.formatMessage({ id: 'thongtincanhan.khuonmat.yeucau' })}</b>{' '}
					{intl.formatMessage({ id: 'thongtincanhan.khuonmat.yeucau.desc' })}
				</li>
				<li>
					<b>{intl.formatMessage({ id: 'thongtincanhan.khuonmat.chatluong' })}</b>{' '}
					{intl.formatMessage({ id: 'thongtincanhan.khuonmat.chatluong.desc' })}
				</li>
			</ol>

			<Form form={form} layout='vertical' onFinish={onFinish}>
				<Segmented
					value={segmentValue}
					onChange={(val) => setSegmentValue(val as string)}
					options={[
						{ value: 'upload', label: intl.formatMessage({ id: 'thongtincanhan.khuonmat.tailen' }) },
						{ value: 'webcam', label: intl.formatMessage({ id: 'thongtincanhan.khuonmat.webcam' }) },
					]}
					style={{ marginBottom: 12 }}
				/>

				<Form.Item
					name='faceRegImgUrl'
					label={intl.formatMessage({ id: 'thongtincanhan.khuonmat.image' })}
					rules={[...rules.required, ...rules.fileRequired]}
				>
					{segmentValue === 'upload' ? <UploadFile isAvatar resize isPrivate /> : <WebcamNhanDienKhuonMat />}
				</Form.Item>

				<div className='form-footer'>
					<Button htmlType='submit' type='primary' loading={formSubmiting}>
						{intl.formatMessage({ id: 'global.button.luulai' })}
					</Button>
					<Button onClick={() => setVisible(false)}> {intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default ModalCapNhatAnhNhanDien;
