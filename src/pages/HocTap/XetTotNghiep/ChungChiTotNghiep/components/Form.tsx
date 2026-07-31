import MyDatePicker from '@/components/MyDatePicker';
import UploadFile from '@/components/Upload/UploadFile';
import SelectChungChi from '@/pages/DaoTao/ChungChi/Select';
import { ETrangThaiChungChiSinhVen } from '@/services/DaoTao/SinhVien/constants';
import type { SinhVien } from '@/services/DaoTao/SinhVien/typings';
import { EPhuongThucTinhDiem } from '@/services/DaoTao/constant';
import { buildUpLoadFileMultipart, EFileScope } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormChungChiSinhVien = (props: any) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const {
		record,
		setVisibleForm,
		edit,
		postChungChiSinhVienModel,
		putModel,
		formSubmiting,
		visibleForm,
		setFormSubmiting,
		getModel,
	} = useModel('sinhvien.chungchi');
	const { danhSach: danhSachChungChi, record: recChungChi, setRecord } = useModel('daotao.chungchi');
	const { title } = props;
	const maChungChi = Form.useWatch('maChungChi', form);

	useEffect(() => {
		const findChungChi = danhSachChungChi.find((item) => item.ma === maChungChi);
		setRecord(findChungChi);
	}, [maChungChi]);

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: SinhVien.IChungChiSinhVien) => {
		setFormSubmiting(true);
		const urlMinhChung = await buildUpLoadFileMultipart(values, 'urlMinhChung', {
			scope: EFileScope.PUBLIC,
			module: 'chung-chi-tot-nghiep',
			returnValue: 'url',
		}).finally(() => setFormSubmiting(false));
		values.urlMinhChung = urlMinhChung;

		if (edit) {
			putModel(`${record?._id ?? ''}/sinh-vien/cap-nhat`, values, getModel)
				.then()
				.catch((er) => console.log(er));
		} else {
			postChungChiSinhVienModel(values, getModel)
				.then(() => setVisibleForm(false))
				.catch((er) => console.log(er));
		}
	};

	return (
		<Card
			title={`${edit ? intl.formatMessage({ id: 'chungchitotnghiep.action.edit' }) : intl.formatMessage({ id: 'chungchitotnghiep.action.addnew' })} ${title?.toLowerCase()}`}
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col xs={24} md={12}>
						<Form.Item
							name='maChungChi'
							label={intl.formatMessage({ id: 'chungchitotnghiep.formitem.label.chungchi' })}
							rules={[...rules.required]}
						>
							<SelectChungChi selectMa onChange={() => form.setFieldsValue({ diem: undefined })} />
						</Form.Item>
					</Col>

					<Col xs={24} md={12}>
						<Form.Item
							name='ngayCap'
							label={intl.formatMessage({ id: 'chungchitotnghiep.formitem.label.ngaycap' })}
							rules={[...rules.required]}
						>
							<MyDatePicker />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item
							name='donViCap'
							label={intl.formatMessage({ id: 'chungchitotnghiep.formitem.label.donvicap' })}
							rules={[...rules.required]}
						>
							<Input
								placeholder={intl.formatMessage({ id: 'chungchitotnghiep.formitem.input.donvicap.placeholder' })}
							/>
						</Form.Item>
					</Col>

					{recChungChi?.phuongThucTinhDiem === EPhuongThucTinhDiem.BAC ? (
						<Col xs={24} md={12}>
							<Form.Item
								name='diem'
								label={intl.formatMessage({ id: 'chungchitotnghiep.formitem.label.bacchungchi' })}
								rules={[...rules.required]}
							>
								<Select
									placeholder={intl.formatMessage({ id: 'chungchitotnghiep.formitem.select.bacchungchi.placeholder' })}
									options={recChungChi?.bac?.map((item) => ({
										key: item.order,
										label: item.ten,
										value: item.order,
									}))}
								/>
							</Form.Item>
						</Col>
					) : recChungChi?.phuongThucTinhDiem === EPhuongThucTinhDiem.DIEM ? (
						<>
							<Col xs={24} md={12}>
								<Form.Item
									name='diem'
									label={intl.formatMessage({ id: 'chungchitotnghiep.formitem.label.mucdiem' })}
									rules={[...rules.required, ...rules.number(recChungChi.max, recChungChi.min)]}
								>
									<InputNumber
										style={{ width: '100%' }}
										min={recChungChi.min}
										max={recChungChi.max}
										step={recChungChi.step}
										placeholder={intl.formatMessage({ id: 'chungchitotnghiep.formitem.input.mucdiem.placeholder' })}
									/>
								</Form.Item>
							</Col>
						</>
					) : null}
					<Col xs={24}>
						<Form.Item
							name='urlMinhChung'
							label={intl.formatMessage({ id: 'chungchitotnghiep.formitem.label.minhchung' })}
							rules={[...rules.required]}
						>
							<UploadFile resize maxCount={1} accept='image/*, .docx, .doc, .xls, .xlsx, .pdf' isPrivate />
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button
						loading={formSubmiting}
						disabled={
							record?.trangThaiDuyet === ETrangThaiChungChiSinhVen.DA_DUYET ||
							record?.trangThaiDuyet === ETrangThaiChungChiSinhVen.KHONG_DUYET
						}
						htmlType='submit'
						type='primary'
					>
						{!edit
							? intl.formatMessage({ id: 'chungchitotnghiep.action.addnew' })
							: intl.formatMessage({ id: 'chungchitotnghiep.action.save' })}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>
						{intl.formatMessage({ id: 'chungchitotnghiep.action.cancel' })}
					</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormChungChiSinhVien;
