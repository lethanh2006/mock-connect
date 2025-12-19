import MyDatePicker from '@/components/MyDatePicker';
import TinyEditor from '@/components/TinyEditor';
import UploadFile from '@/components/Upload/UploadFile';
import { buildUpLoadMultiFile } from '@/services/uploadFile';
import dayjs from '@/utils/dayjs';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { Button, Checkbox, Col, Form, Input, Row } from 'antd';
import React, { useEffect } from 'react';
import { useIntl } from 'umi';
import AvatarBlog from './Avatar';

interface IProps {
	idLopHocPhan?: string;
	idLopHanhChinh?: string;
	getData?: () => void;
}

const FormThemMoiBaiViet = (props: IProps) => {
	const intl = useIntl();
	const { idLopHocPhan, idLopHanhChinh, getData } = props;
	const { visibleForm, postModel, edit, record, putModel, setVisibleForm, formSubmiting, setFormSubmiting } =
		useModel('diendan.baidang');
	const { record: recSinhVien } = useModel('sinhvien.sinhvien');
	const [form] = Form.useForm();

	useEffect(() => {
		if (visibleForm) form.setFieldsValue(record);
		else resetFieldsForm(form);
	}, [visibleForm]);

	const onFinish = async (values: any) => {
		setFormSubmiting(true);
		const fileDinhKem = await buildUpLoadMultiFile(values, 'fileDinhKem');

		let danhSachLuaChonPayload = null;
		if (values?.isBinhChon) {
			const raw = values?.danhSachLuaChon ?? [];
			danhSachLuaChonPayload = raw
				.map((it: any) => (typeof it === 'string' ? { noiDung: it } : it))
				.filter((it: any) => it?.noiDung?.trim());
		}

		const payload = {
			...values,
			// lopHocPhanId: idLopHocPhan,
			...(idLopHocPhan ? { lopHocPhanId: idLopHocPhan } : idLopHanhChinh ? { lopHanhChinhId: idLopHanhChinh } : {}),
			fileDinhKem: fileDinhKem,

			isBinhChon: !!values?.isBinhChon,
			isChonNhieu: !!values?.isChonNhieu,
			anDanh: !!values?.anDanh,
			ngayKetThucBinhChon: values?.ngayKetThucBinhChon || undefined,
			danhSachLuaChon: danhSachLuaChonPayload,
		};
		setFormSubmiting(false);

		if (edit) {
			putModel(record?._id ?? '', payload, () => {
				if (getData) getData();
			});
		} else {
			postModel(payload, () => {
				if (getData) getData();
			});
		}
	};

	return (
		<>
			<div>
				<div style={{ display: 'flex', alignItems: 'center' }}>
					<div style={{ flexShrink: 0, marginRight: 8 }}>
						<AvatarBlog
							url={recSinhVien?.anhDaiDienUrl ?? ''}
							name={recSinhVien?.ten}
							style={{ width: 42, height: 42 }}
						/>
					</div>
					<b>{recSinhVien?.ten}</b>
				</div>

				<div style={{ marginTop: 16 }}>
					<Form layout={'vertical'} onFinish={onFinish} form={form}>
						<Form.Item
							name={'tieuDe'}
							label={intl.formatMessage({ id: 'lophanhchinh.thongtinchung.diendan.form.tieuDe' })}
							rules={[...rules.required, ...rules.text, ...rules.length(250)]}
						>
							<Input placeholder={intl.formatMessage({ id: 'lophanhchinh.thongtinchung.diendan.form.tieude.place' })} />
						</Form.Item>
						<Form.Item
							name={'noiDung'}
							label={intl.formatMessage({ id: 'lophanhchinh.thongtinchung.diendan.form.noidung' })}
							rules={[...rules.text, ...rules.requiredHtml]}
						>
							<TinyEditor hideMenubar miniToolbar height={500} minHeight={350} />
						</Form.Item>

						{/* Bình chọn */}
						<Form.Item shouldUpdate={(prev, cur) => prev.isBinhChon !== cur.isBinhChon} noStyle>
							{() => {
								const isBinhChon = form.getFieldValue('isBinhChon');
								return (
									<Row gutter={[12, 0]}>
										<Col span={24} md={8}>
											<Form.Item name='isBinhChon' valuePropName='checked'>
												<Checkbox>
													{intl.formatMessage({ id: 'lophanhchinh.thongtinchung.diendan.form.taobinhchon' })}
												</Checkbox>
											</Form.Item>
										</Col>

										{isBinhChon && (
											<>
												<Col span={24} md={8}>
													<Form.Item name='isChonNhieu' valuePropName='checked'>
														<Checkbox>
															{intl.formatMessage({ id: 'lophanhchinh.thongtinchung.diendan.form.nhieuchon' })}
														</Checkbox>
													</Form.Item>
												</Col>
												<Col span={24} md={8}>
													<Form.Item name='anDanh' valuePropName='checked'>
														<Checkbox>
															{intl.formatMessage({ id: 'lophanhchinh.thongtinchung.diendan.form.anDanh' })}
														</Checkbox>
													</Form.Item>
												</Col>
												<Col span={24} md={8}>
													<Form.Item
														label={intl.formatMessage({ id: 'lophanhchinh.thongtinchung.diendan.form.tgkt' })}
														name='ngayKetThucBinhChon'
														rules={[...rules.required, ...rules.sauThoiDiem(dayjs(), 'Hôm nay')]}
													>
														<MyDatePicker
															showTime={{ format: 'HH:mm' }}
															format='DD/MM/YYYY HH:mm'
															disabledDate={(mo) => dayjs().isAfter(mo)}
														/>
													</Form.Item>
												</Col>

												<Col span={24}>
													<Form.List
														name='danhSachLuaChon'
														rules={[
															{
																validator: async (_, list) => {
																	if (!list || list.length < 2) {
																		return Promise.reject(
																			new Error(
																				intl.formatMessage({ id: 'lophanhchinh.thongtinchung.diendan.form.vali' }),
																			),
																		);
																	}
																},
															},
														]}
													>
														{(fields, { add, remove }, { errors }) => (
															<Row gutter={[8, 0]}>
																{fields.map((field, idx) => (
																	<React.Fragment key={field.key}>
																		<Col span={22}>
																			<Form.Item
																				{...field}
																				name={[field.name, 'noiDung']}
																				rules={[...rules.required, ...rules.length(100)]}
																			>
																				<Input placeholder={`Lựa chọn ${idx + 1}`} />
																			</Form.Item>
																		</Col>
																		<Col span={2}>
																			<Button
																				type='text'
																				size='small'
																				onClick={() => remove(field.name)}
																				danger
																				icon={<MinusCircleOutlined />}
																			/>
																		</Col>
																	</React.Fragment>
																))}

																<Col span={24}>
																	<Button
																		type='dashed'
																		onClick={() => add()}
																		icon={<PlusOutlined />}
																		size='small'
																		block
																	>
																		{intl.formatMessage({ id: 'lophanhchinh.thongtinchung.diendan.form.themchon' })}
																	</Button>
																	<Form.ErrorList errors={errors} />
																</Col>
															</Row>
														)}
													</Form.List>
												</Col>
											</>
										)}
									</Row>
								);
							}}
						</Form.Item>
						{/* ket thuc binh chon */}

						<Form.Item
							name={'fileDinhKem'}
							label={intl.formatMessage({ id: 'lophanhchinh.thongtinchung.diendan.form.file' })}
						>
							<UploadFile resize maxCount={5} accept={'.png, .jpg, .doc, .docx, .pdf'} />
						</Form.Item>

						<div className='form-footer'>
							<Button type={'primary'} htmlType='submit' loading={formSubmiting}>
								{edit
									? intl.formatMessage({ id: 'global.button.chinhsua' })
									: intl.formatMessage({ id: 'lophanhchinh.thongtinchung.diendan.form.dangbai' })}
							</Button>
							<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
						</div>
					</Form>
				</div>
			</div>
		</>
	);
};
export default FormThemMoiBaiViet;
