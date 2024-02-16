import MyDatePicker from '@/components/MyDatePicker';
import UploadFile from '@/components/Upload/UploadFile';
import SelectHocPhan from '@/pages/DaoTao/HocPhan/SelectHocPhan';
import { ELoaiDiemChu } from '@/services/HocTap/LopHocPhan/constant';
import type { QuyDoiDiem } from '@/services/HocTap/QuyDoiDiem/typing';
import { ELoaiHocPhanMinhChung, EMinhChungQuyDoiDiem, ETrinhDoMinhChungQuyDoiDiem } from '@/services/HocTap/constant';

import { buildUpLoadMultiFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormMinhChungQuyDoiDiem = (props: {
	onOk: (val: QuyDoiDiem.IMinhChungQuyDoiDiem) => void;
	recMinhChung: any;
	setRecMinhChung: any;
	getData: () => void;
}) => {
	const [form] = Form.useForm();
	const { onOk, recMinhChung, setRecMinhChung, getData } = props;
	const { formSubmiting, setVisibleForm, visibleForm, record, setFormSubmiting, putModel, postModel, edit } = useModel(
		'daotao.quydoidiem.minhchungquydoidiem',
	);
	const { danhSach: danhSachHocPhan } = useModel('hocphan.hocphan');
	const { record: recQuyDoiSV } = useModel('daotao.quydoidiem.sinhvienquydoidiem');
	const loaiMinhChung: string = Form.useWatch('loai', form);
	const thoiGianHieuLuc: Date = Form.useWatch('thoiGianHieuLuc', form);
	const loaiHocPhan: string = Form.useWatch('loaiHocPhan', form);

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
			form.setFieldsValue({
				loai: EMinhChungQuyDoiDiem.HOC_PHAN,
				loaiHocPhan: ELoaiHocPhanMinhChung.NGOAI_CHUONG_TRINH,
			});
		} else if (recMinhChung?.index) form.setFieldsValue(recMinhChung);
	}, [visibleForm, recMinhChung?.index]);

	const onChangeHocPhan = (maHocPhan?: string) => {
		const ns = danhSachHocPhan.find((item) => item.ma === maHocPhan);
		form.setFieldsValue({
			tenHocPhan: ns?.ten,
			soTinChi: ns?.soTinChi,
		});
	};

	const onFinish = async (values: any) => {
		setFormSubmiting(true);
		const urlsHocPhan = await buildUpLoadMultiFile(values, 'urlsHocPhan');
		const urlsChungChi = await buildUpLoadMultiFile(values, 'urlsChungChi');
		const data = {
			...values,
			urlsHocPhan,
			urlsChungChi,
			trinhDoDaoTao:
				loaiHocPhan === ELoaiHocPhanMinhChung.NGOAI_CHUONG_TRINH
					? values.trinhDoDaoTao
					: ETrinhDoMinhChungQuyDoiDiem.DAI_HOC,
			tenTruong:
				loaiHocPhan === ELoaiHocPhanMinhChung.NGOAI_CHUONG_TRINH ? values.tenTruong : 'Học viện Phụ nữ Việt Nam',
		};
		setFormSubmiting(false);

		if (!recQuyDoiSV?._id) {
			onOk(data);
		} else {
			if (edit) {
				putModel(record?._id ?? '', { ...data, quyDoiDiemSvId: recQuyDoiSV?._id })
					.then(() => {
						if (getData) getData();
					})
					.catch((err) => console.log(err));
			} else {
				postModel({ ...data, quyDoiDiemSvId: recQuyDoiSV?._id })
					.then(() => {
						if (getData) getData();
					})
					.catch((err) => console.log(err));
			}
		}
	};

	return (
		<Form onFinish={onFinish} form={form} layout='vertical'>
			<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
				<Col xs={24} md={12}>
					<Form.Item
						initialValue={EMinhChungQuyDoiDiem.HOC_PHAN}
						name='loai'
						label='Loại minh chứng'
						rules={[...rules.required]}
					>
						<Select
							placeholder='Chọn minh chứng'
							options={Object.values(EMinhChungQuyDoiDiem).map((item) => ({
								key: item,
								label: item,
								value: item,
							}))}
						/>
					</Form.Item>
				</Col>

				{loaiMinhChung === EMinhChungQuyDoiDiem.HOC_PHAN ? (
					<>
						<Col xs={24}>
							<div className='fw500'>Thông tin học phần đã học</div>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item
								initialValue={ELoaiHocPhanMinhChung.NGOAI_CHUONG_TRINH}
								name='loaiHocPhan'
								label='Loại học phần'
								rules={[...rules.required]}
							>
								<Select
									placeholder='Chọn loại học phần'
									options={Object.values(ELoaiHocPhanMinhChung).map((item) => ({
										key: item,
										label: item,
										value: item,
									}))}
								/>
							</Form.Item>
						</Col>
						{loaiHocPhan === ELoaiHocPhanMinhChung.NGOAI_CHUONG_TRINH ? (
							<>
								<Col xs={24} md={12}>
									<Form.Item name='trinhDoDaoTao' label='Trình độ' rules={[...rules.required]}>
										<Select
											placeholder='Chọn trình độ'
											options={Object.values(ETrinhDoMinhChungQuyDoiDiem).map((item) => ({
												key: item,
												label: item,
												value: item,
											}))}
										/>
									</Form.Item>
								</Col>
								<Col xs={24} md={12}>
									<Form.Item
										name='tenTruong'
										label='Trường học'
										rules={[...rules.required, ...rules.text, ...rules.length(500)]}
									>
										<Input placeholder='Nhập tên trường' />
									</Form.Item>
								</Col>
								<Col xs={24} md={12}>
									<Form.Item
										name='tenHocPhan'
										label='Tên học phần'
										rules={[...rules.required, ...rules.text, ...rules.length(250)]}
									>
										<Input placeholder='Nhập tên học phần quy đổi' />
									</Form.Item>
								</Col>
								<Col xs={24} md={12}>
									<Form.Item
										name='maHocPhan'
										label='Mã học phần'
										rules={[...rules.required, ...rules.text, ...rules.length(20)]}
									>
										<Input placeholder='Nhập mã học phần quy đổi' />
									</Form.Item>
								</Col>
								<Col xs={24} md={12}>
									<Form.Item name='soTinChi' label='Số tín chỉ' rules={[...rules.required]}>
										<InputNumber style={{ width: '100%' }} placeholder='Nhập số tín chỉ' min={0} />
									</Form.Item>
								</Col>
								<Col xs={24} md={12}>
									<Form.Item name='namTotNghiep' label='Năm tốt nghiệp' rules={[...rules.required]}>
										<InputNumber style={{ width: '100%' }} placeholder='Nhập năm tốt nghiệp' min={1970} />
									</Form.Item>
								</Col>
							</>
						) : (
							<>
								<Col xs={24} md={12}>
									<Form.Item name='maHocPhan' label='Học phần đã học' rules={[...rules.required]}>
										<SelectHocPhan selectMa onChange={(val) => onChangeHocPhan(val?.toString())} />
									</Form.Item>
									<Form.Item name='tenHocPhan' hidden />
									<Form.Item name='soTinChi' hidden />
								</Col>
							</>
						)}

						<Col xs={24} md={12}>
							<Form.Item name='diemHe10' label='Điểm hệ 10' rules={[...rules.required]}>
								<InputNumber style={{ width: '100%' }} placeholder='Nhập điểm (hệ 10)' min={0} max={10} />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item name='diemHe4' label='Điểm hệ 4'>
								<InputNumber style={{ width: '100%' }} placeholder='Nhập điểm (hệ 4)' min={0} max={4} />
							</Form.Item>
						</Col>
						<Col span={24} md={12}>
							<Form.Item name='diemChu' label='Điểm chữ quy đổi'>
								<Select
									options={Object.values(ELoaiDiemChu).map((item) => ({
										key: item,
										value: item,
										label: item,
									}))}
									placeholder='Chọn điểm chữ quy đổi'
								/>
							</Form.Item>
						</Col>

						<Col xs={24} md={12}>
							<Form.Item label='Tệp tin' name='urlsHocPhan' rules={[...rules.fileRequired]}>
								<UploadFile maxCount={5} />
							</Form.Item>
						</Col>
					</>
				) : loaiMinhChung === EMinhChungQuyDoiDiem.CHUNG_CHI ? (
					<>
						<Col xs={24}>
							<div className='fw500'>Chứng chỉ / Bằng cấp</div>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item
								name='tenChungChi'
								label='Tên chứng chỉ'
								rules={[...rules.required, ...rules.text, ...rules.length(250)]}
							>
								<Input placeholder='Nhập tên chứng chỉ' />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item
								name='bacChungChi'
								label='Điểm/Bằng cấp'
								rules={[...rules.required, ...rules.text, ...rules.length(20)]}
							>
								<Input placeholder='Nhập điểm/Bằng cấp' />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item
								name='donViCap'
								label='Đơn vị cấp'
								rules={[...rules.required, ...rules.text, ...rules.length(250)]}
							>
								<Input placeholder='Nhập đơn vị cấp' />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item name='thoiGianHieuLuc' label='Thời gian hiệu lực' rules={[...rules.required]}>
								<MyDatePicker
									onChange={(val) => {
										form.validateFields(['thoiGianHetHieuLuc']);
									}}
								/>
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item
								name='thoiGianHetHieuLuc'
								label='Thời gian hết hiệu lực'
								rules={[...rules.sauNgay(thoiGianHieuLuc, 'Thời gian hiệu lực')]}
							>
								<MyDatePicker disabledDate={(cur) => moment(cur).isBefore(thoiGianHieuLuc)} />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item label='Tệp tin' name='urlsChungChi' rules={[...rules.fileRequired]}>
								<UploadFile maxCount={5} />
							</Form.Item>
						</Col>
					</>
				) : null}
			</Row>

			<div className='form-footer'>
				<Button loading={formSubmiting} htmlType='submit' type='primary'>
					{!recMinhChung?.index ? 'Thêm mới ' : 'Lưu lại'}
				</Button>
				<Button onClick={() => (setVisibleForm(false), setRecMinhChung(''))}>Hủy</Button>
			</div>
		</Form>
	);
};

export default FormMinhChungQuyDoiDiem;
