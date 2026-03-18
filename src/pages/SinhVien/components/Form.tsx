import MyDatePicker from '@/components/MyDatePicker';
import UploadFile from '@/components/Upload/UploadFile';
import SelectDanToc from '@/pages/Core/DanToc/SelectDanToc';
import SelectQuocTich from '@/pages/Core/QuocTich/SelectQuocTich';
import SelectTonGiao from '@/pages/Core/TonGiao/SelectTonGiao';
import { getTinhThanhPho } from '@/services/Core/DonViHanhChinh';
import { type DonViHanhChinh } from '@/services/Core/DonViHanhChinh/typing';
import { EGioiTinh } from '@/services/DaoTao/constant';
import { ELoaiNoiSinh, TenLoaiNoiSinh } from '@/services/DaoTao/SinhVien/constants';
import { buildUpLoadFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { Button, Col, Collapse, Divider, Form, Input, InputNumber, message, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import SelectDonViHanhChinh from '../../Core/DonViHanhChinh/SelectDonViHanhChinh';
import FormSucKhoe from './FormSucKhoe';
import ThongTinGiaDinhFormItem from './GiaDinh';
import ThongTinVisaFormItem from './ThongTinVisa';

const FormSinhVien = (props: { onCancel?: () => void }) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { getThongTinCuaToiModel, putModel, formSubmiting, setFormSubmiting, record } = useModel('sinhvien.sinhvien');
	const [listTinh, setListTinh] = useState<DonViHanhChinh.IRecord[]>();
	const loaiNoiSinh = Form.useWatch('loaiNoiSinh', form) ?? ELoaiNoiSinh.TRONG_NUOC;

	useEffect(() => {
		getTinhThanhPho().then((data) => setListTinh(data.data.data));

		getThongTinCuaToiModel().then((rec) => form.setFieldsValue(rec));
	}, []);

	const onFinish = async (values: any) => {
		if (!values.thanhVienGiaDinh || !values.thanhVienGiaDinh.length) {
			message.error('Vui lòng khai thông tin thành viên gia đình');
			return;
		}

		try {
			setFormSubmiting(true);
			const urlImg = await buildUpLoadFile(values, 'anhDaiDienUrl').catch(console.log);
			setFormSubmiting(false);
			const payload = { ...values, anhDaiDienUrl: urlImg };
			putModel('me', payload, getThongTinCuaToiModel).then(() => {
				if (props?.onCancel) props?.onCancel();
			});
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<Form
			form={form}
			layout='vertical'
			onFinish={onFinish}
			scrollToFirstError={{ behavior: 'smooth', block: 'center', inline: 'center' }}
			onFinishFailed={() => {
				message.warning('Một số trường thông tin còn thiếu vui lòng kiểm tra lại');
			}}
		>
			<Row gutter={[12, 0]}>
				<Col span={24} sm={9} lg={6} style={{ display: 'flex', justifyContent: 'center' }}>
					<Form.Item className='alignUploadCenter' name='anhDaiDienUrl' label={''}>
						<UploadFile otherProps={{ style: { textAlign: 'center' } }} isAvatar resize />
					</Form.Item>
				</Col>

				<Col span={24} md={18}>
					<Row gutter={[12, 0]}>
						<Col span={24} md={8}>
							<Form.Item
								name='ma'
								label={intl.formatMessage({ id: 'thongtincanhan.form.masv' })}
								rules={[...rules.required, ...rules.text, ...rules.length(20)]}
							>
								<Input disabled placeholder={intl.formatMessage({ id: 'thongtincanhan.form.masv.place' })} />
							</Form.Item>
						</Col>
						<Col span={24} md={8}>
							<Form.Item
								name='ten'
								label={intl.formatMessage({ id: 'thongtincanhan.form.hoten' })}
								rules={[...rules.required, ...rules.text, ...rules.length(250)]}
							>
								<Input placeholder={intl.formatMessage({ id: 'thongtincanhan.form.hoten.place' })} />
							</Form.Item>
						</Col>
						<Col span={12} md={8}>
							<Form.Item
								name='ngaySinh'
								label={intl.formatMessage({ id: 'thongtincanhan.form.ngaysinh' })}
								rules={[...rules.required, ...rules.ngaySinh]}
							>
								<MyDatePicker
									style={{ width: '100%' }}
									placeholder={intl.formatMessage({ id: 'thongtincanhan.form.ngaysinh.place' })}
								/>
							</Form.Item>
						</Col>
						<Col span={12} md={8}>
							<Form.Item
								name='gioiTinh'
								label={intl.formatMessage({ id: 'thongtincanhan.form.gioitinh' })}
								rules={[...rules.required, ...rules.text]}
							>
								<Select
									placeholder={intl.formatMessage({ id: 'thongtincanhan.form.gioitinh.place' })}
									options={Object.values(EGioiTinh).map((item) => ({
										key: item,
										value: item,
										label: item,
									}))}
								/>
							</Form.Item>
						</Col>

						<Col span={12} md={8}>
							<Form.Item
								name='cccd'
								label={intl.formatMessage({ id: 'thongtincanhan.form.cccd' })}
								rules={[...rules.required, ...rules.CMND]}
							>
								<Input placeholder={intl.formatMessage({ id: 'thongtincanhan.form.cccd.place' })} />
							</Form.Item>
						</Col>
						<Col span={12} md={8}>
							<Form.Item
								name='noiCapCccd'
								label={intl.formatMessage({ id: 'thongtincanhan.form.noicap' })}
								rules={[...rules.required, ...rules.text, ...rules.length(250)]}
							>
								<Input placeholder={intl.formatMessage({ id: 'thongtincanhan.form.noicap.place' })} />
							</Form.Item>
						</Col>
						<Col span={12} md={8}>
							<Form.Item
								name='ngayCapCccd'
								label={intl.formatMessage({ id: 'thongtincanhan.form.ngaycap' })}
								rules={[...rules.required, ...rules.truocHomNay]}
							>
								<MyDatePicker
									placeholder={intl.formatMessage({ id: 'thongtincanhan.form.ngaycap.place' })}
									allowClear
								/>
							</Form.Item>
						</Col>

						<Col span={12} md={8}>
							<Form.Item
								name='quocTich'
								label={intl.formatMessage({ id: 'thongtincanhan.form.quoctich' })}
								rules={[...rules.required]}
							>
								<SelectQuocTich allowClear selectTen />
							</Form.Item>
						</Col>
						<Col span={12} md={8}>
							<Form.Item
								name='danToc'
								label={intl.formatMessage({ id: 'thongtincanhan.form.dantoc' })}
								rules={[...rules.required]}
							>
								<SelectDanToc allowClear />
							</Form.Item>
						</Col>
					</Row>
				</Col>
			</Row>
			<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
				<Col span={12} md={6}>
					<Form.Item
						name='tonGiao'
						label={intl.formatMessage({ id: 'thongtincanhan.form.tongiao' })}
						rules={[...rules.required]}
					>
						<SelectTonGiao allowClear />
					</Form.Item>
				</Col>
				<Col span={12} md={6}>
					<Form.Item
						name='chieuCao'
						label={intl.formatMessage({ id: 'thongtincanhan.form.chieucao' })}
						rules={[...rules.number(300, 0), ...rules.required]}
					>
						<InputNumber
							placeholder={intl.formatMessage({ id: 'thongtincanhan.form.chieucao.place' })}
							style={{ width: '100%' }}
						/>
					</Form.Item>
				</Col>
				<Col span={12} md={6}>
					<Form.Item
						name='canNang'
						label={intl.formatMessage({ id: 'thongtincanhan.form.cannang' })}
						rules={[...rules.number(300, 0), ...rules.required]}
					>
						<InputNumber
							placeholder={intl.formatMessage({ id: 'thongtincanhan.form.cannang.place' })}
							style={{ width: '100%' }}
						/>
					</Form.Item>
				</Col>
				<Col span={12} md={6}>
					<Form.Item
						name='soBaoHiemSinhVien'
						label={intl.formatMessage({ id: 'thongtincanhan.form.bh' })}
						rules={[...rules.text, ...rules.length(20)]}
					>
						<Input placeholder={intl.formatMessage({ id: 'thongtincanhan.form.bh.place' })} />
					</Form.Item>
				</Col>
			</Row>
			<Collapse style={{ marginBottom: 12 }} defaultActiveKey={['1', '4']}>
				<Collapse.Panel forceRender header={intl.formatMessage({ id: 'thongtincanhan.form.thongtin' })} key={'1'}>
					<Divider orientation='center'>{intl.formatMessage({ id: 'thongtincanhan.form.thongtin.noisinh' })}</Divider>
					<Row gutter={[12, 0]}>
						<Col span={12} md={12}>
							<Form.Item
								rules={[...rules.required]}
								name='loaiNoiSinh'
								label={intl.formatMessage({ id: 'thongtincanhan.form.thongtin.loainoisinh' })}
							>
								<Select
									placeholder={intl.formatMessage({ id: 'thongtincanhan.form.loainoisinh.place' })}
									allowClear
									options={Object.values(ELoaiNoiSinh).map((item) => ({
										key: item,
										value: item,
										label: TenLoaiNoiSinh[item],
									}))}
								/>
							</Form.Item>
						</Col>
						<Col span={12} md={12}>
							{loaiNoiSinh === ELoaiNoiSinh.TRONG_NUOC ? (
								<Form.Item
									name='tinhTpNoiSinh'
									label={intl.formatMessage({ id: 'thongtincanhan.form.thongtin.tp' })}
									rules={[...rules.required]}
								>
									<Select
										placeholder={intl.formatMessage({ id: 'thongtincanhan.form.thongtin.tp.place' })}
										options={listTinh?.map((item) => ({
											key: item.ma,
											value: item.tenDonVi,
											label: item.tenDonVi,
										}))}
										allowClear
										showSearch
										optionFilterProp='label'
									/>
								</Form.Item>
							) : (
								<Form.Item
									name='quocGiaNoiSinh'
									label={intl.formatMessage({ id: 'thongtincanhan.form.thongtin.quocgia' })}
								>
									<Input placeholder={intl.formatMessage({ id: 'thongtincanhan.form.thongtin.quocgia.place' })} />
								</Form.Item>
							)}
						</Col>
					</Row>

					<Divider orientation='center'>{intl.formatMessage({ id: 'thongtincanhan.form.thongtin.quequan' })}</Divider>
					<SelectDonViHanhChinh
						form={form}
						listTinh={listTinh}
						suffix='QueQuan'
						hasLabel
						initialValue={{ tinhTp: record?.maTinhTpQueQuan }}
					/>

					<Divider orientation='center'>{intl.formatMessage({ id: 'thongtincanhan.form.thongtin.hokhau' })}</Divider>
					<SelectDonViHanhChinh
						form={form}
						listTinh={listTinh}
						suffix='ThuongTru'
						hasSoNha
						hasLabel
						initialValue={{ tinhTp: record?.maTinhTpThuongTru }}
					/>

					<Divider orientation='center'>{intl.formatMessage({ id: 'thongtincanhan.form.thongtin.lienlac' })}</Divider>
					<Row gutter={[12, 0]}>
						<Col span={12}>
							<Form.Item
								name='soDienThoai'
								label={intl.formatMessage({ id: 'thongtincanhan.form.thongtin.lienlac.sdt' })}
								rules={[...rules.required, ...rules.soDienThoai]}
							>
								<Input placeholder={intl.formatMessage({ id: 'thongtincanhan.form.thongtin.lienlac.sdt.place' })} />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								name='email2'
								label={intl.formatMessage({ id: 'thongtincanhan.form.thongtin.lienlac.email' })}
								rules={[...rules.required, ...rules.email]}
							>
								<Input placeholder={intl.formatMessage({ id: 'thongtincanhan.form.thongtin.lienlac.email.place' })} />
							</Form.Item>
						</Col>
						{/* <Col span={24} md={6}>
							<Form.Item name='soDienThoai2' label='Số điện thoại 2' rules={[...rules.soDienThoai]}>
								<Input placeholder='Nhập số điện thoại 2' />
							</Form.Item>
						</Col>
						<Col span={24} md={6}>
							<Form.Item name='email2' label='Email 2' rules={[...rules.email]}>
								<Input placeholder='Nhập email 2' />
							</Form.Item>
						</Col>
						<Col span={24} md={12}>
							<Form.Item name='nguoiLienLac' label='Người liên lạc' rules={[...rules.text, ...rules.length(250)]}>
								<Input placeholder='Nhập họ tên người liên lạc' />
							</Form.Item>
						</Col>
						<Col span={24} md={12}>
							<Form.Item name='soDienThoaiNguoiLienLac' label='SĐT' rules={[...rules.soDienThoai]}>
								<Input placeholder='Nhập số điện thoại người liên lạc' />
							</Form.Item>
						</Col> */}
					</Row>

					<Divider orientation='center'>{intl.formatMessage({ id: 'thongtincanhan.form.thongtin.nganhang' })}</Divider>
					<Row gutter={[12, 0]}>
						<Col span={24} md={8}>
							<Form.Item
								name='soTaiKhoanNganHang'
								label={intl.formatMessage({ id: 'thongtincanhan.form.thongtin.nganhang.stk' })}
								rules={[...rules.sotaikhoan]}
							>
								<Input placeholder={intl.formatMessage({ id: 'thongtincanhan.form.thongtin.nganhang.stk.place' })} />
							</Form.Item>
						</Col>
						<Col span={24} md={8}>
							<Form.Item
								name='tenNganHang'
								label={intl.formatMessage({ id: 'thongtincanhan.form.thongtin.nganhang.ten' })}
								rules={[...rules.text, ...rules.length(250)]}
							>
								<Input placeholder={intl.formatMessage({ id: 'thongtincanhan.form.thongtin.nganhang.ten.place' })} />
							</Form.Item>
						</Col>
						<Col span={24} md={8}>
							<Form.Item
								name='chiNhanhNganHang'
								label={intl.formatMessage({ id: 'thongtincanhan.form.thongtin.nganhang.chinhanh' })}
								rules={[...rules.text, ...rules.length(250)]}
							>
								<Input
									placeholder={intl.formatMessage({ id: 'thongtincanhan.form.thongtin.nganhang.chinhanh.place' })}
								/>
							</Form.Item>
						</Col>
					</Row>
				</Collapse.Panel>

				<Collapse.Panel
					forceRender
					header={intl.formatMessage({ id: 'thongtincanhan.form.thongtingiadinh' })}
					key={'4'}
				>
					<Row gutter={[12, 0]}>
						<Col span={24}>
							<Form.Item name='thanhVienGiaDinh' label=''>
								<ThongTinGiaDinhFormItem />
							</Form.Item>
						</Col>
					</Row>
				</Collapse.Panel>

				<Collapse.Panel
					forceRender
					header={intl.formatMessage({ id: 'thongtincanhan.form.thongtinvisa' })}
					key='5'
				>
					<Row gutter={[12, 0]}>
						<Col span={24}>
							<Form.Item name='visaList' label=''>
								<ThongTinVisaFormItem />
							</Form.Item>
						</Col>
					</Row>
				</Collapse.Panel>

				<Collapse.Panel forceRender header={intl.formatMessage({ id: 'thongtincanhan.form.thongtindang' })} key={'2'}>
					{/* <Divider orientation='center'>Thông tin Đoàn</Divider> */}
					<Row gutter={[12, 0]}>
						{/* <Col span={24} md={12}>
							<Form.Item name='laDoanVien' label=' ' valuePropName='checked'>
								<Checkbox>Là đoàn viên</Checkbox>
							</Form.Item>
						</Col> */}
						<Col span={12} md={8}>
							<Form.Item
								name='ngayVaoDoan'
								label={intl.formatMessage({ id: 'thongtincanhan.form.thongtindang.ngayvaodoan' })}
								rules={[...rules.truocHomNay]}
							>
								<MyDatePicker
									allowClear
									style={{ width: '100%' }}
									placeholder={intl.formatMessage({ id: 'thongtincanhan.form.thongtindang.ngayvaodoan.place' })}
								/>
							</Form.Item>
						</Col>
						<Col span={12} md={8}>
							<Form.Item
								name='ngayVaoDang'
								label={intl.formatMessage({ id: 'thongtincanhan.form.thongtindang.ngayvaodang' })}
								rules={[...rules.truocHomNay]}
							>
								<MyDatePicker
									allowClear
									style={{ width: '100%' }}
									placeholder={intl.formatMessage({ id: 'thongtincanhan.form.thongtindang.ngayvaodang.place' })}
								/>
							</Form.Item>
						</Col>
						<Col span={24} md={8}>
							<Form.Item
								name='ngayVaoDangChinhThuc'
								label={intl.formatMessage({ id: 'thongtincanhan.form.thongtindang.chinhthuc' })}
								rules={[...rules.truocHomNay]}
							>
								<MyDatePicker
									allowClear
									style={{ width: '100%' }}
									placeholder={intl.formatMessage({ id: 'thongtincanhan.form.thongtindang.chinhthuc.place' })}
								/>
							</Form.Item>
						</Col>
					</Row>

					{/* <Divider orientation='center'>Thông tin Đảng</Divider> */}
					{/* <Row gutter={[12, 0]}> */}
					{/* <Col span={24} md={12}>
							<Form.Item name='daHocLopCamTinhDang' label='' valuePropName='checked'>
								<Checkbox>Đã học lớp cảm tình Đảng</Checkbox>
							</Form.Item>
						</Col>
						<Col span={24} md={12}>
							<Form.Item name='laDangVien' label='' valuePropName='checked'>
								<Checkbox>Là Đảng viên</Checkbox>
							</Form.Item>
						</Col> */}

					{/* </Row> */}
				</Collapse.Panel>

				<Collapse.Panel forceRender header={intl.formatMessage({ id: 'thongtincanhan.form.suckhoe' })} key={'3'}>
					<FormSucKhoe />
				</Collapse.Panel>
			</Collapse>

			<div className='form-footer'>
				<Button type='primary' htmlType='submit' loading={formSubmiting}>
					{intl.formatMessage({ id: 'global.button.luulai' })}
				</Button>
			</div>
		</Form>
	);
};

export default FormSinhVien;
