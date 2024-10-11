import MyDatePicker from '@/components/MyDatePicker';
import { EOperatorType } from '@/components/Table/constant';
import UploadFile from '@/components/Upload/UploadFile';
import SelectHocPhan from '@/pages/DaoTao/HocPhan/SelectHocPhan';
import type { HocPhan } from '@/services/DaoTao/HocPhan/typings';
import type { QuyDoiDiem } from '@/services/HocTap/QuyDoiDiem/typing';
import {
	ELoaiHocPhanMinhChung,
	EMinhChungQuyDoiDiem,
	ETrangThaiHocPhanQuyDoi,
	ETrinhDoMinhChungQuyDoiDiem,
	mapNameLoaiHocPhanMinhChung,
} from '@/services/HocTap/constant';
import { buildUpLoadMultiFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Descriptions, Form, Input, InputNumber, Modal, Row, Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import AutoHocPhanQuyDoi from './AutoHocPhan';
import AutoTruongHocQuyDoi from './AutoTruongHoc';

const ModalQuyDoiDiem = (props: {
	visible: boolean;
	setVisible: any;
	hocPhan?: Pick<HocPhan.IRecord, 'ma' | 'ten' | 'soTinChi'>;
	maKhoaNganh?: string;
}) => {
	const [form] = Form.useForm();
	const { visible, setVisible, hocPhan, maKhoaNganh } = props;
	const { formSubmiting, record, getModel } = useModel('daotao.quydoidiem.phieuquydoidiem');
	const { postSinhVienQuyDoiPhieuModel, setFormSubmiting } = useModel('daotao.quydoidiem.sinhvienquydoidiem');
	const { record: recDot } = useModel('daotao.quydoidiem.dotquydoidiem');
	const { record: recSinhVien } = useModel('sinhvien.sinhvien');
	const { danhSach: danhSachQuyDoiDiem } = useModel('daotao.dmquydoidiem');
	const { danhSach: danhSachHocPhan } = useModel('hocphan.hocphan');
	const loaiMinhChung: string = Form.useWatch('loai', form);
	const loaiHocPhan: string = Form.useWatch('loaiHocPhan', form);
	const trinhDoDaoTao: ETrinhDoMinhChungQuyDoiDiem = Form.useWatch('trinhDoDaoTao', form);
	const tenTruong = Form.useWatch('tenTruong', form);
	const diemHe10MinhChung = Form.useWatch('diemHe10MinhChung', form);
	const diemHe4MinhChung = Form.useWatch('diemHe4MinhChung', form);

	useEffect(() => {
		if (!visible) resetFieldsForm(form);

		const initValue = {
			loai: EMinhChungQuyDoiDiem.HOC_PHAN,
			loaiHocPhan: ELoaiHocPhanMinhChung.NGOAI_CHUONG_TRINH,
			trangThai: ETrangThaiHocPhanQuyDoi.CHO_XU_LY,
		};
		form.setFieldsValue(initValue);
	}, [visible]);

	const getData = () =>
		getModel(undefined, [
			{
				active: true,
				field: 'sinhVienSsoId',
				operator: EOperatorType.INCLUDE,
				values: [recSinhVien?.ssoId ?? ''],
			},
		]);

	const onChangeHocPhanMinhChung = (maHocPhanMinhChung?: string) => {
		const ns = danhSachHocPhan.find((item) => item.ma === maHocPhanMinhChung);
		form.setFieldsValue({
			tenHocPhan: ns?.ten,
			soTinChi: ns?.soTinChi,
			trinhDoDaoTao: ETrinhDoMinhChungQuyDoiDiem.DAI_HOC,
			tenTruong: APP_CONFIG_TEN_TRUONG,
		});
	};

	const onChangeDiem10 = (number: number) => {
		const rule = danhSachQuyDoiDiem.find((i) => number >= i.diemFrom && number <= i.diemTo);
		form.setFieldsValue({
			diemHe10: number,
			diemHe4MinhChung: rule?.diemThang4,
			diemChuMinhChung: rule?.diemChu,
		});
	};

	const onChangeDiem4 = (score: number) => {
		const rule = danhSachQuyDoiDiem.find((i) => i.diemThang4 === score);
		form.setFieldsValue({ diemChuMinhChung: rule?.diemChu });
	};

	const onFinish = async (values: QuyDoiDiem.IQuyDoiDiemSinhVien) => {
		setFormSubmiting(true);
		const urlsHocPhan = await buildUpLoadMultiFile(values, 'urlsHocPhan');
		const urlsChungChi = await buildUpLoadMultiFile(values, 'urlsChungChi');
		setFormSubmiting(false);

		const data = {
			thongTinQuyDoiDiemSinhVien: [
				{
					...values,
					phieuDangKyQuyDoiDiemId: record?._id,
					maHocPhan: hocPhan?.ma,
					urlsHocPhan: urlsHocPhan,
					urlsChungChi: urlsChungChi,
				},
			],
			sinhVienSsoId: recSinhVien?.ssoId,
			maSinhVien: recSinhVien?.ma,
			hoTen: recSinhVien?.ten,
			maKhoaNganh: maKhoaNganh,
		};

		postSinhVienQuyDoiPhieuModel(recDot?._id ?? '', data)
			.then(() => {
				getData();
				setVisible(false);
			})
			.catch((rec) => console.log(rec));
	};

	return (
		<Modal
			width={800}
			visible={visible}
			onCancel={() => {
				setVisible(false);
			}}
			footer={null}
			title='Công nhận kết quả học tập'
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Descriptions column={{ xs: 1, md: 2, sm: 1, lg: 2, xl: 2 }}>
					<Descriptions.Item span={2} label='Học phần xin công nhận'>
						{hocPhan?.ten ?? ''}
					</Descriptions.Item>
					<Descriptions.Item label='Mã học phần'>{hocPhan?.ma ?? ''}</Descriptions.Item>
					<Descriptions.Item label='Số tín chỉ'>{hocPhan?.soTinChi ?? ''}</Descriptions.Item>
				</Descriptions>

				<Row gutter={[12, 0]}>
					<Col xs={24}>
						<Form.Item
							name='loai'
							label='Loại minh chứng'
							rules={[...rules.required]}
							extra='Đối với minh chứng NCKH, kết quả quy đổi sẽ được tính vào Điểm TBC'
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
											value: item,
											label: mapNameLoaiHocPhanMinhChung[item],
										}))}
										onSelect={() => {
											form.resetFields([
												'tenHocPhan',
												'soTinChi',
												'trinhDoDaoTao',
												'tenTruong',
												'nganh',
												'maHocPhanMinhChung',
											]);
										}}
									/>
								</Form.Item>
							</Col>

							{loaiHocPhan === ELoaiHocPhanMinhChung.NGOAI_CHUONG_TRINH ? (
								<>
									<Col xs={24} md={12}>
										<Form.Item name='trinhDoDaoTao' label='Trình độ' rules={[...rules.required]}>
											<Select
												onSelect={() => form.setFieldsValue({ tenTruong: undefined, tenHocPhan: undefined })}
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
											<AutoTruongHocQuyDoi
												trinhDoDaoTao={trinhDoDaoTao}
												onSelect={() => form.setFieldsValue({ tenHocPhan: undefined })}
											/>
										</Form.Item>
									</Col>
									<Col xs={24} md={12}>
										<Form.Item
											name='nganh'
											label='Ngành học'
											rules={[...rules.required, ...rules.text, ...rules.length(500)]}
										>
											<Input placeholder='Nhập tên ngành học' />
										</Form.Item>
									</Col>
									<Col xs={24} md={12}>
										<Form.Item
											name='tenHocPhan'
											label='Tên học phần'
											rules={[...rules.required, ...rules.text, ...rules.length(250)]}
										>
											<AutoHocPhanQuyDoi
												trinhDoDaoTao={trinhDoDaoTao}
												tenTruong={tenTruong}
												onSelect={(val) =>
													form.setFieldsValue({
														maHocPhanMinhChung: val?.maHocPhanMinhChung,
														soTinChi: val?.soTinChi,
													})
												}
											/>
										</Form.Item>
									</Col>
									<Col xs={24} md={12}>
										<Form.Item
											name='maHocPhanMinhChung'
											label='Mã học phần'
											rules={[...rules.text, ...rules.length(20)]}
										>
											<Input placeholder='Nhập mã học phần' />
										</Form.Item>
									</Col>
									<Col xs={24} md={8}>
										<Form.Item
											name='soDVHT'
											label='Số đơn vị học trình'
											extra={
												<small style={{ color: '#999' }}>
													<i>1,5 đơn vị học trình = 1 tín chỉ</i>
												</small>
											}
										>
											<InputNumber
												style={{ width: '100%' }}
												placeholder='Nhập số đơn vị học trình'
												min={0}
												onChange={(val) => form.setFieldsValue({ soTinChi: Math.round((val ?? 0) / 1.5) })}
											/>
										</Form.Item>
									</Col>
									<Col xs={24} md={8}>
										<Form.Item name='soTinChi' label='Số tín chỉ'>
											<InputNumber style={{ width: '100%' }} placeholder='Nhập số tín chỉ' min={0} />
										</Form.Item>
									</Col>
									<Col xs={24} md={8}>
										<Form.Item name='namTotNghiep' label='Năm tốt nghiệp'>
											<InputNumber style={{ width: '100%' }} placeholder='Nhập năm tốt nghiệp' min={0} />
										</Form.Item>
									</Col>
								</>
							) : (
								<>
									<Col xs={24} md={12}>
										<Form.Item name='maHocPhanMinhChung' label='Học phần đã học' rules={[...rules.required]}>
											<SelectHocPhan selectMa onChange={(val) => onChangeHocPhanMinhChung(val?.toString())} />
										</Form.Item>
										<Form.Item name='tenHocPhan' hidden />
										<Form.Item name='soTinChi' hidden />
										<Form.Item name='trinhDoDaoTao' hidden />
										<Form.Item name='tenTruong' hidden />
									</Col>
								</>
							)}

							<Col xs={24}>
								<div className='fw500'>Kết quả học tập/quy đổi</div>
							</Col>
							<Col xs={12} md={8}>
								<Form.Item name='diemHe10MinhChung' label='Điểm hệ 10'>
									<InputNumber
										style={{ width: '100%' }}
										placeholder='Nhập điểm (hệ 10)'
										min={0}
										max={10}
										onChange={(val) => onChangeDiem10(Number(val))}
									/>
								</Form.Item>
							</Col>
							<Col xs={12} md={8}>
								<Form.Item name='diemHe4MinhChung' label='Điểm hệ 4'>
									<Select
										options={danhSachQuyDoiDiem.map((item) => ({
											key: item._id,
											value: item.diemThang4,
											label: item.diemThang4,
										}))}
										placeholder='Nhập điểm hệ 4'
										onChange={(val) => onChangeDiem4(val)}
										disabled={!!diemHe10MinhChung}
									/>
								</Form.Item>
							</Col>
							<Col span={12} md={8}>
								<Form.Item name='diemChuMinhChung' label='Điểm chữ' rules={[...rules.required]}>
									<Select
										options={danhSachQuyDoiDiem.map((item) => ({
											key: item._id,
											value: item.diemChu,
											label: item.diemChu,
										}))}
										placeholder='Nhập điểm chữ'
										disabled={!!diemHe4MinhChung}
										onChange={(val) => form.setFieldsValue({ diemChu: val })}
									/>
								</Form.Item>
							</Col>
						</>
					) : loaiMinhChung === EMinhChungQuyDoiDiem.CHUNG_CHI ? (
						<>
							<Col xs={24}>
								<div className='fw500'>Thông tin chứng chỉ</div>
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
									label='Điểm/Bậc chứng chỉ'
									rules={[...rules.required, ...rules.text, ...rules.length(20)]}
								>
									<Input placeholder='Nhập điểm/bậc chứng chỉ' />
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
								<Form.Item name='thoiGianHieuLuc' label='Thời gian có hiệu lực'>
									<MyDatePicker />
								</Form.Item>
							</Col>
						</>
					) : (
						<>
							<Col xs={24}>
								<div className='fw500'>Thông tin Nghiên cứu khoa học</div>
							</Col>
							<Col xs={24}>
								<Form.Item
									name='tenDeTaiNckh'
									label='Tên đề tài'
									rules={[...rules.required, ...rules.text, ...rules.length(500)]}
								>
									<Input placeholder='Nhập tên đề tài' />
								</Form.Item>
							</Col>
							<Col xs={24} md={12}>
								<Form.Item
									name='nguoiHuongDanNckh'
									label='Người hướng dẫn'
									rules={[...rules.text, ...rules.length(100)]}
								>
									<Input placeholder='Nhập tên người hướng dẫn' />
								</Form.Item>
							</Col>
							<Col xs={24} md={12}>
								<Form.Item name='diemNckh' label='Điểm NCKH' rules={[...rules.required]}>
									<InputNumber placeholder='Nhập điểm NCKH' style={{ width: '100%' }} min={0} />
								</Form.Item>
							</Col>
						</>
					)}

					<Col xs={24} md={12}>
						<Form.Item
							name={`${loaiMinhChung === EMinhChungQuyDoiDiem.CHUNG_CHI ? 'urlsChungChi' : 'urlsHocPhan'}`}
							label='File minh chứng'
							rules={[...rules.required]}
						>
							<UploadFile resize maxCount={5} />
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						Đăng ký
					</Button>
					<Button onClick={() => setVisible(false)}>Hủy</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default ModalQuyDoiDiem;
