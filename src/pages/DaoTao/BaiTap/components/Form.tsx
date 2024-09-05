import UploadFile from '@/components/Upload/UploadFile';
import { ETrangThaiNopBaiTap } from '@/services/BaiTap/constants';
import type { BaiTap } from '@/services/BaiTap/typing';
import { buildUpLoadMultiFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Alert, Button, Card, Col, Descriptions, Divider, Form, Input, Row } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const FormBaiTap = (props: any) => {
	const { getData } = props;
	const [form] = Form.useForm();
	const { record, visibleForm, setVisibleForm, putModel, formSubmiting } = useModel('daotao.baitap');
	const [isLuuBai, setIsLuuBai] = useState<boolean>(false);
	const quaThoiHanNopBai =
		!record?.assignment?.thoiGianKetThuc || moment().isBefore(record?.assignment?.thoiGianKetThuc);

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
		} else if (record?._id) form.setFieldsValue(record);
	}, [visibleForm, record?._id]);

	const onFinish = async (values: BaiTap.IDanhSachGiaoBaiTap) => {
		const urlImages = await buildUpLoadMultiFile(values, 'urlImages');
		values.urlImages = urlImages;

		const data = {
			...record,
			...values,
			thoiGianTraLoi: moment(),
			trangThai: isLuuBai ? ETrangThaiNopBaiTap.NHAP : ETrangThaiNopBaiTap.DA_NOP,
		};

		putModel(record?._id ?? '', data as any, getData)
			.then(() => setVisibleForm(false))
			.catch((er) => console.log(er));
	};

	return (
		<Card title='Nộp bài tập'>
			<div style={{ marginBottom: 12 }}>
				<Alert type='error' showIcon message='Quá thời gian nộp bài' />
			</div>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col span={24}>
						<Divider>Chi tiết bài tập</Divider>
					</Col>
					<Col span={24}>
						<Descriptions column={1}>
							<Descriptions.Item label='Tiêu đề'>{record?.assignment?.noiDung ?? '--'}</Descriptions.Item>
							<Descriptions.Item label='Hướng dẫn'>
								<div
									dangerouslySetInnerHTML={{ __html: record?.assignment?.huongDanNop ?? '--' }}
									className='notif-content'
								/>
							</Descriptions.Item>
							<Descriptions.Item label='Thời hạn'>
								{record?.assignment?.thoiGianKetThuc
									? moment(record?.assignment?.thoiGianKetThuc).format('HH:mm DD/MM/YYYY')
									: '--'}
							</Descriptions.Item>
							<Descriptions.Item label='Tệp đính kèm'>
								{record?.assignment?.urlTepDinhKem?.length
									? record?.assignment?.urlTepDinhKem?.map((item, index) => (
											<>
												<a key={item} href={item} target='_blank' rel='noreferrer'>
													Tệp {index + 1}
												</a>
												{index < (record?.assignment?.urlTepDinhKem?.length ?? 0) - 1 && ', '}
											</>
									  ))
									: '--'}
							</Descriptions.Item>
						</Descriptions>
					</Col>

					<Divider>Câu trả lời</Divider>
					<Col span={24}>
						<Form.Item name='noiDungTraLoi' label='Nội dung trả lời'>
							<Input.TextArea rows={3} placeholder='Nhập nội dung trả lời' />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item name='urlImages' label='Tệp đính kèm' rules={[...rules.required]}>
							<UploadFile maxCount={5} />
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button
						disabled={record?.trangThai === ETrangThaiNopBaiTap.DA_NOP || quaThoiHanNopBai}
						loading={formSubmiting}
						htmlType='submit'
						type='primary'
						onClick={() => setIsLuuBai(false)}
					>
						Nộp bài
					</Button>
					<Button
						disabled={record?.trangThai === ETrangThaiNopBaiTap.DA_NOP || quaThoiHanNopBai}
						loading={formSubmiting}
						htmlType='submit'
						type='primary'
						onClick={() => setIsLuuBai(true)}
					>
						Lưu bài
					</Button>
					<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormBaiTap;
