import UploadFile from '@/components/Upload/UploadFile';
import { ETrangThaiNopBaiTap } from '@/services/DaoTao/BaiTap/constants';
import type { BaiTap } from '@/services/DaoTao/BaiTap/typing';
import { buildUpLoadMultiFile } from '@/services/uploadFile';
import { resetFieldsForm } from '@/utils/utils';
import { Alert, Button, Col, Form, Modal, Row } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useModel } from 'umi';
import FormQuiz from './FormQuiz';

const FormBaiTap = (props: any) => {
	const { getData } = props;
	const [form] = Form.useForm();
	const { record, visibleForm, setVisibleForm, sinhVienNopBaiTapModal, formSubmiting } = useModel('daotao.baitap');
	const quaThoiHanNopBai =
		!record?.assignment?.thoiGianKetThuc || moment().isAfter(record?.assignment?.thoiGianKetThuc);

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
		} else if (record?._id) form.setFieldsValue(record);
	}, [visibleForm, record?._id]);

	const onFinish = async (values: BaiTap.IDanhSachGiaoBaiTap) => {
		const urlImages = await buildUpLoadMultiFile(values, 'urlImages');
		values.urlImages = urlImages;

		if (!record?.assignment?.isQuiz) {
			const data = {
				...record,
				...values,
				thoiGianTraLoi: moment(),
				mode: 'save',
			};

			sinhVienNopBaiTapModal(data as any, getData)
				.then(() => setVisibleForm(false))
				.catch((er) => console.log(er));
		}
	};

	return (
		<Modal visible={visibleForm} onCancel={() => setVisibleForm(false)} footer={null} width={800} title='Nộp bài tập'>
			{quaThoiHanNopBai && (
				<div style={{ marginBottom: 12 }}>
					<Alert type='error' showIcon message='Quá thời hạn nộp bài' />
				</div>
			)}

			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col span={24}>
						<b>{record?.assignment?.noiDung}</b>
					</Col>
					<Col span={24}>
						<div
							dangerouslySetInnerHTML={{ __html: record?.assignment?.huongDanNop ?? '--' }}
							className='notif-content'
						/>
					</Col>

					<Col span={24}>
						<Form.Item name='urlImages' label='Tệp đính kèm'>
							<UploadFile drag maxCount={5} disabled={quaThoiHanNopBai} />
						</Form.Item>
					</Col>
				</Row>
				{record?.assignment?.isQuiz && (
					<>
						<FormQuiz />
					</>
				)}

				<div className='form-footer'>
					<Button
						disabled={record?.trangThai === ETrangThaiNopBaiTap.DA_NOP || quaThoiHanNopBai}
						loading={formSubmiting}
						htmlType='submit'
						type='primary'
					>
						Nộp bài
					</Button>
					<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default FormBaiTap;
