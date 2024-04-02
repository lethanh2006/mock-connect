import MyDatePicker from '@/components/MyDatePicker';
import UploadFile from '@/components/Upload/UploadFile';
import SelectChungChi from '@/pages/DaoTao/ChungChi/Select';
import { ETrangThaiChungChiSinhVen } from '@/services/DaoTao/SinhVien/constants';
import type { SinhVien } from '@/services/DaoTao/SinhVien/typings';
import { EPhuongThucTinhDiem } from '@/services/DaoTao/constant';
import { buildUpLoadFile } from '@/services/uploadFile';

import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormChungChiSinhVien = (props: any) => {
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postChungChiSinhVienModel, putModel, formSubmiting, visibleForm } =
		useModel('sinhvien.chungchi');
	const { danhSach: danhSachChungChi, record: recChungChi, setRecord } = useModel('daotao.chungchi');
	const { record: recSinhVien } = useModel('sinhvien.sinhvien');
	const { title, getData } = props;
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
		const urlMinhChung = await buildUpLoadFile(values, 'urlMinhChung');
		values.urlMinhChung = urlMinhChung;
		const data = {
			...values,
			sinhVienSsoId: recSinhVien?.ssoId,
		};

		if (edit) {
			putModel(record?._id ?? '', data, getData)
				.then()
				.catch((er) => console.log(er));
		} else {
			postChungChiSinhVienModel(data, getData)
				.then(() => setVisibleForm(false))
				.catch((er) => console.log(er));
		}
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title?.toLowerCase()}`}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col xs={24} md={12}>
						<Form.Item name='maChungChi' label='Chứng chỉ' rules={[...rules.required]}>
							<SelectChungChi selectMa onChange={() => form.setFieldsValue({ diem: undefined })} />
						</Form.Item>
					</Col>

					<Col xs={24} md={12}>
						<Form.Item name='ngayCap' label='Ngày cấp' rules={[...rules.required]}>
							<MyDatePicker />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='donViCap' label='Đơn vị cấp' rules={[...rules.required]}>
							<Input placeholder='Nhập đơn vị cấp' />
						</Form.Item>
					</Col>

					{recChungChi?.phuongThucTinhDiem === EPhuongThucTinhDiem.BAC ? (
						<Col xs={24} md={12}>
							<Form.Item name='diem' label='Bậc chứng chỉ' rules={[...rules.required]}>
								<Select
									placeholder='Chọn bậc chứng chỉ'
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
									label='Mức điểm'
									rules={[...rules.required, ...rules.number(recChungChi.max, recChungChi.min)]}
								>
									<InputNumber
										style={{ width: '100%' }}
										min={recChungChi.min}
										max={recChungChi.max}
										step={recChungChi.step}
										placeholder='Nhập điểm đạt được'
									/>
								</Form.Item>
							</Col>
						</>
					) : null}
					<Col xs={24}>
						<Form.Item name='urlMinhChung' label='Minh chứng' rules={[...rules.required]}>
							<UploadFile maxCount={1} otherProps={{ accept: 'image/*, .docx, .doc, .xls, .xlsx, .pdf' }} />
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
						{!edit ? 'Thêm mới' : 'Lưu lại'}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormChungChiSinhVien;
