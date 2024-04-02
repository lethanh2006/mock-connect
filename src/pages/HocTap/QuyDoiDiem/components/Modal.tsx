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
} from '@/services/HocTap/constant';
import { buildUpLoadMultiFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { AutoComplete, Button, Col, Descriptions, Form, Input, InputNumber, Modal, Row, Select, Spin } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const ModalQuyDoiDiem = (props: {
	visible: boolean;
	setVisible: any;
	hocPhan?: HocPhan.IRecord;
	maKhoaNganh?: string;
}) => {
	const [form] = Form.useForm();
	const { visible, setVisible, hocPhan, maKhoaNganh } = props;
	const { formSubmiting, record, getModel } = useModel('daotao.quydoidiem.phieuquydoidiem');
	const {
		dataTruongHoc,
		postSinhVienQuyDoiPhieuModel,
		selectTruongHocDebounceModel,
		getAllModel: getAllSvQuyDoi,
		filters,
		setFilters,
		setFormSubmiting,
	} = useModel('daotao.quydoidiem.sinhvienquydoidiem');
	const { record: recDot } = useModel('daotao.quydoidiem.dotquydoidiem');
	const { record: recSinhVien } = useModel('sinhvien.sinhvien');
	const { danhSach } = useModel('daotao.dmquydoidiem');
	const { danhSach: danhSachHocPhan } = useModel('hocphan.hocphan');
	const loaiMinhChung: string = Form.useWatch('loai', form);
	const loaiHocPhan: string = Form.useWatch('loaiHocPhan', form);
	const trinhDoDaoTao: ETrinhDoMinhChungQuyDoiDiem = Form.useWatch('trinhDoDaoTao', form);
	const [danhSachSVQuyDoi, setDanhSachSVQuyDoi] = useState<QuyDoiDiem.IQuyDoiDiemSinhVien[]>([]);
	const [loading, setLoading] = useState<boolean>(false);

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

	const getHocPhan = (val?: ETrinhDoMinhChungQuyDoiDiem) => {
		setLoading(true);
		getAllSvQuyDoi(
			undefined,
			undefined,
			{ trinhDoDaoTao: trinhDoDaoTao, tenTruong: val, trangThai: ETrangThaiHocPhanQuyDoi.DA_RA_QUYET_DINH },
			filters,
			undefined,
			false,
		).then((res) => {
			setDanhSachSVQuyDoi(res);
			setLoading(false);
		});
	};

	useEffect(() => {
		getHocPhan();
	}, [filters]);

	const searchDebounceTenHocPhan = _.debounce((val) => {
		setFilters([{ active: true, field: 'tenHocPhan', values: [val], operator: EOperatorType.CONTAIN }]);
	}, 800);

	const onSelectTenHocPhan = (val: string) => {
		const index = danhSachSVQuyDoi.find((item) => item.tenHocPhan === val);
		if (index) {
			form.setFieldsValue({
				maHocPhanMinhChung: index.maHocPhanMinhChung,
				soTinChi: index.soTinChi,
			});
		} else {
			form.setFieldsValue({
				maHocPhanMinhChung: '',
				soTinChi: '',
			});
		}
	};

	const onChangeHocPhanMinhChung = (maHocPhanMinhChung?: string) => {
		const ns = danhSachHocPhan.find((item) => item.ma === maHocPhanMinhChung);
		form.setFieldsValue({
			tenHocPhan: ns?.ten,
			soTinChi: ns?.soTinChi,
			trinhDoDaoTao: ETrinhDoMinhChungQuyDoiDiem.DAI_HOC,
			tenTruong: APP_CONFIG_TEN_TRUONG,
		});
	};

	const convertToLetterGradeDiemHe10 = (number: number) => {
		for (const rule of danhSach) {
			if (number >= rule.diemFrom && number <= rule.diemTo) {
				return form.setFieldsValue({
					diemChuMinhChung: rule.diemChu,
					diemHe4MinhChung: rule.diemThang4,
					diemHe10: number,
					diemHe4: rule.diemThang4,
					diemChu: rule.diemChu,
				});
			}
		}
		return {
			diemChuMinhChung: null,
			diemHe4MinhChung: null,
			diemHe10: null,
			diemHe4: null,
			diemChu: null,
		};
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
				<Row gutter={[12, 0]}>
					<Descriptions column={{ xs: 1, md: 2, sm: 1, lg: 2, xl: 2 }}>
						<Descriptions.Item span={2} label='Học phần xin công nhận'>
							{hocPhan?.ten ?? ''}
						</Descriptions.Item>
						<Descriptions.Item label='Mã học phần'>{hocPhan?.ma ?? ''}</Descriptions.Item>
						<Descriptions.Item label='Số tín chỉ'>{hocPhan?.soTinChi ?? ''}</Descriptions.Item>
					</Descriptions>
					<Col xs={24}>
						<Col xs={24}>
							<Row gutter={[12, 0]}>
								<Col xs={24} md={12}>
									<Form.Item name='loai' label='Loại minh chứng' rules={[...rules.required]}>
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
															onSelect={(val) => {
																selectTruongHocDebounceModel({ trinhDoDaoTao: val }, 'tenTruong');
																form.setFieldsValue({
																	tenTruong: '',
																	tenHocPhan: '',
																});
															}}
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
														<AutoComplete
															filterOption={(inputValue, option) =>
																(option!.value as string).toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
															}
															onSelect={(val) => {
																getHocPhan(val);
																form.setFieldsValue({
																	tenHocPhan: '',
																});
															}}
															placeholder='Nhập tên trường'
															options={dataTruongHoc
																?.filter((item) => item !== null)
																?.map((item) => ({
																	key: item,
																	value: item,
																	label: item,
																}))}
															allowClear
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
														<AutoComplete
															notFoundContent={loading ? <Spin spinning={true} /> : undefined}
															onSearch={(val) => searchDebounceTenHocPhan(val)}
															onSelect={(val) => onSelectTenHocPhan(val)}
															placeholder='Nhập tên học phần'
															options={danhSachSVQuyDoi?.map((item) => ({
																key: item?._id,
																value: item?.tenHocPhan,
																label: item?.tenHocPhan,
															}))}
															allowClear
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
												<Col xs={24} md={12}>
													<Form.Item name='soDVHT' label='Số ĐVHT' rules={[...rules.required]}>
														<InputNumber style={{ width: '100%' }} placeholder='Nhập số ĐVHT' min={0} />
														<small style={{ color: '#999' }}>
															<i>1,5 đơn vị hạch tính = 1 tín chỉ</i>
														</small>
													</Form.Item>
												</Col>
												<Col xs={24} md={12}>
													<Form.Item name='soTinChi' label='Số tín chỉ/đơn vị học trình' rules={[...rules.required]}>
														<InputNumber
															style={{ width: '100%' }}
															placeholder='Nhập số tín chỉ/đơn vị học trình'
															min={0}
														/>
													</Form.Item>
												</Col>
												<Col xs={24} md={12}>
													<Form.Item name='namTotNghiep' label='Năm tốt nghiệp' rules={[...rules.required]}>
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
											<Form.Item name='thoiGianHieuLuc' label='Thời gian có hiệu lực' rules={[...rules.required]}>
												<MyDatePicker onChange={() => form.validateFields(['thoiGianHetHieuLuc'])} />
											</Form.Item>
										</Col>
									</>
								) : null}
							</Row>

							<Row gutter={[12, 0]}>
								<Col xs={24}>
									<div className='fw500'>Kết quả học tập/quy đổi</div>
								</Col>
								<Col xs={12} md={8}>
									<Form.Item name='diemHe10MinhChung' label='Điểm hệ 10' rules={[...rules.required]}>
										<InputNumber
											style={{ width: '100%' }}
											placeholder='Nhập điểm (hệ 10)'
											min={0}
											max={10}
											onChange={(val) => convertToLetterGradeDiemHe10(Number(val))}
										/>
									</Form.Item>
								</Col>
								<Col xs={12} md={8}>
									<Form.Item name='diemHe4MinhChung' label='Điểm hệ 4'>
										<Input disabled placeholder='Điểm hệ 4 sẽ được tính tự động' />
									</Form.Item>
								</Col>
								<Col span={12} md={8}>
									<Form.Item name='diemChuMinhChung' label='Điểm chữ'>
										<Input disabled placeholder='Điểm chữ sẽ được tính tự động' />
									</Form.Item>
								</Col>
							</Row>
						</Col>
						<Form.Item name='diemHe10' hidden />
						<Form.Item name='diemHe4' hidden />
						<Form.Item name='diemChu' hidden />
						<Col xs={24} md={12}>
							<Form.Item
								name={`${loaiMinhChung === EMinhChungQuyDoiDiem.CHUNG_CHI ? 'urlsChungChi' : 'urlsHocPhan'}`}
								label='File minh chứng'
								rules={[...rules.required]}
							>
								<UploadFile maxCount={5} />
							</Form.Item>
						</Col>
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
