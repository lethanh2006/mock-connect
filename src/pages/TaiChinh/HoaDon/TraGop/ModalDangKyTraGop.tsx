import MyDatePicker from '@/components/MyDatePicker';
import UploadFile from '@/components/Upload/UploadFile';
import type { HoaDon } from '@/services/TaiChinh/HoaDon/typing';
import { checkEligibleTraGop, postYeuCauTraGop } from '@/services/TaiChinh/TraGop';
import { EHinhThucHoTro } from '@/services/TaiChinh/TraGop/constant';
import type { TraGop } from '@/services/TaiChinh/TraGop/typing';
import { buildUpLoadMultiFileMultipart, EFileScope } from '@/services/uploadFile';
import dayjs from '@/utils/dayjs';
import rules from '@/utils/rules';
import { inputFormat, inputParse } from '@/utils/utils';
import { Alert, Button, Checkbox, Col, Empty, Form, Input, InputNumber, Modal, Radio, Row, Spin, message } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';

interface ModalDangKyTraGopProps {
	visible: boolean;
	bill?: HoaDon.IRecord;
	onClose: () => void;
	onSuccess?: () => void;
}

const MAX_SO_TU_LY_DO = 200;

const countWords = (text?: string): number => (text ? text.trim().split(/\s+/).filter(Boolean).length : 0);

const ModalDangKyTraGop: React.FC<ModalDangKyTraGopProps> = ({ visible, bill, onClose, onSuccess }) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record: recSinhVien } = useModel('sinhvien.sinhvien');
	const hinhThucHoTro = Form.useWatch('hinhThucHoTro', form);
	const camKet = Form.useWatch('camKet', form);
	const [loadingCheck, setLoadingCheck] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [eligibleData, setEligibleData] = useState<TraGop.ICheckEligible | undefined>(undefined);

	useEffect(() => {
		if (!visible || !bill?._id) {
			setEligibleData(undefined);
			form.resetFields();
			return;
		}

		setLoadingCheck(true);
		checkEligibleTraGop(bill._id)
			.then((res) => setEligibleData(res?.data?.data))
			.catch(() => setEligibleData(undefined))
			.finally(() => setLoadingCheck(false));
	}, [visible, bill?._id]);

	useEffect(() => {
		if (!visible || !eligibleData?.eligible) return;
		form.setFieldsValue({
			ten: recSinhVien?.ten,
			email: recSinhVien?.email,
			ma: recSinhVien?.ma,
			soDienThoai: recSinhVien?.soDienThoai,
			college: recSinhVien?.nganh?.maDonVi ?? '',
			soTienPhaiNop: eligibleData.tongTien,
		});
	}, [visible, eligibleData?.eligible, eligibleData?.tongTien, recSinhVien?._id]);

	const minNgayGiaHan = bill?.ngayHetHanThanhToan ? dayjs.max(dayjs(), dayjs(bill.ngayHetHanThanhToan)) : dayjs();

	const handleSubmit = async (values: any) => {
		if (!bill?._id) return;

		try {
			setSubmitting(true);
			const taiLieuDinhKem = await buildUpLoadMultiFileMultipart(values, 'taiLieuDinhKem', {
				scope: EFileScope.PUBLIC,
				module: 'tra-gop',
				returnValue: 'url',
			});

			const payload: TraGop.IYeuCauPayload = {
				billId: bill._id,
				hinhThucHoTro: values.hinhThucHoTro,
				college: values.college,
				tongTienHocBongHoTro: values.tongTienHocBongHoTro,
				lyDo: values.lyDo,
				camKet: values.camKet,
				taiLieuDinhKem: taiLieuDinhKem ?? undefined,
			};

			if (values.hinhThucHoTro === EHinhThucHoTro.TRA_GOP) {
				payload.soLanTraGopYeuCau = values.soLanTraGopYeuCau;
				payload.deXuatLoTrinhThanhToan = values.deXuatLoTrinhThanhToan;
			} else if (values.hinhThucHoTro === EHinhThucHoTro.TRA_MUON) {
				payload.ngayGiaHanYeuCau = values.ngayGiaHanYeuCau;
			}

			await postYeuCauTraGop(payload);
			message.success(intl.formatMessage({ id: 'taichinh.tragop.modal.success' }));
			onSuccess?.();
			onClose();
		} catch {
			// error handled by axios interceptor
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<Modal
			open={visible}
			onCancel={onClose}
			footer={null}
			destroyOnClose
			width={1000}
			centered
			styles={{ body: { maxHeight: '85vh', overflowY: 'auto', overflowX: 'hidden', paddingRight: 8 } }}
			title={intl.formatMessage({ id: 'taichinh.tragop.modal.title' })}
		>
			<Spin spinning={loadingCheck}>
				{!loadingCheck && eligibleData?.eligible === false && (
					<>
						<Alert
							type='warning'
							showIcon
							message={eligibleData.reason ?? intl.formatMessage({ id: 'taichinh.tragop.modal.khongdudieukien' })}
						/>
						<div style={{ marginTop: 16, textAlign: 'right' }}>
							<Button onClick={onClose}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
						</div>
					</>
				)}

				{!loadingCheck && !eligibleData && (
					<Empty description={intl.formatMessage({ id: 'global.table.index.empty' })} />
				)}

				{!loadingCheck && eligibleData?.eligible === true && (
					<Form
						layout='vertical'
						form={form}
						onFinish={handleSubmit}
						initialValues={{ hinhThucHoTro: EHinhThucHoTro.TRA_GOP }}
					>
						<Row gutter={16}>
							<Col span={12}>
								<Form.Item
									name='ten'
									label={intl.formatMessage({ id: 'taichinh.tragop.modal.hoten.label' })}
									rules={[...rules.required]}
								>
									<Input disabled />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item
									name='email'
									label={intl.formatMessage({ id: 'taichinh.tragop.modal.email.label' })}
									rules={[...rules.required]}
								>
									<Input disabled />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item
									name='ma'
									label={intl.formatMessage({ id: 'taichinh.tragop.modal.mssv.label' })}
									rules={[...rules.required]}
								>
									<Input disabled />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item name='soDienThoai' label={intl.formatMessage({ id: 'taichinh.tragop.modal.sdt.label' })}>
									<Input disabled />
								</Form.Item>
							</Col>
						</Row>

						<Form.Item
							name='college'
							label={intl.formatMessage({ id: 'taichinh.tragop.modal.college.label' })}
							extra={recSinhVien?.nganh?.tenDonViPhuTrach ?? ''}
							rules={[...rules.required]}
						>
							<Input disabled />
						</Form.Item>

						<Row gutter={16}>
							<Col span={12}>
								<Form.Item
									name='tongTienHocBongHoTro'
									label={intl.formatMessage({ id: 'taichinh.tragop.modal.tonghocbong.label' })}
									rules={[...rules.required]}
								>
									<InputNumber
										style={{ width: '100%' }}
										min={0}
										formatter={inputFormat}
										parser={inputParse}
										addonAfter='VND'
										placeholder={intl.formatMessage({ id: 'taichinh.tragop.modal.tonghocbong.place' })}
									/>
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item
									name='soTienPhaiNop'
									label={intl.formatMessage({ id: 'taichinh.tragop.modal.sotienphainop.label' })}
									rules={[...rules.required]}
								>
									<InputNumber style={{ width: '100%' }} formatter={inputFormat} addonAfter='VND' disabled />
								</Form.Item>
							</Col>
						</Row>

						<Form.Item
							name='lyDo'
							label={intl.formatMessage({ id: 'taichinh.tragop.modal.lydo.label' })}
							rules={[
								...rules.required,
								{
									validator: (_, value) => {
										if (countWords(value) > MAX_SO_TU_LY_DO) {
											return Promise.reject(
												intl.formatMessage({ id: 'taichinh.tragop.modal.lydo.maxwords' }, { max: MAX_SO_TU_LY_DO }),
											);
										}
										return Promise.resolve();
									},
								},
							]}
						>
							<Input.TextArea rows={3} placeholder={intl.formatMessage({ id: 'taichinh.tragop.modal.lydo.place' })} />
						</Form.Item>

						<Form.Item
							name='hinhThucHoTro'
							label={intl.formatMessage({ id: 'taichinh.tragop.modal.hinhthuc.label' })}
							rules={[...rules.required]}
						>
							<Radio.Group>
								<div>
									<Radio value={EHinhThucHoTro.TRA_GOP}>
										{intl.formatMessage({ id: 'taichinh.tragop.modal.hinhthuc.tragop' })}
									</Radio>
								</div>
								<div>
									<Radio value={EHinhThucHoTro.TRA_MUON}>
										{intl.formatMessage({ id: 'taichinh.tragop.modal.hinhthuc.tramuon' })}
									</Radio>
								</div>
							</Radio.Group>
						</Form.Item>

						{hinhThucHoTro === EHinhThucHoTro.TRA_GOP && (
							<>
								<Form.Item
									name='soLanTraGopYeuCau'
									label={intl.formatMessage({ id: 'taichinh.tragop.modal.solan.label' })}
									extra={intl.formatMessage(
										{ id: 'taichinh.tragop.modal.solan.max' },
										{ max: eligibleData.maxSoLanTraGop },
									)}
									rules={[
										...rules.required,
										{
											validator: (_, value) => {
												if (value === undefined || value === null) return Promise.resolve();
												if (value < 2 || value > eligibleData.maxSoLanTraGop) {
													return Promise.reject(
														intl.formatMessage(
															{ id: 'taichinh.tragop.modal.solan.invalid' },
															{ max: eligibleData.maxSoLanTraGop },
														),
													);
												}
												return Promise.resolve();
											},
										},
									]}
								>
									<InputNumber
										style={{ width: '100%' }}
										min={2}
										max={eligibleData.maxSoLanTraGop}
										precision={0}
										placeholder={intl.formatMessage({ id: 'taichinh.tragop.modal.solan.place' })}
									/>
								</Form.Item>
								<Form.Item
									name='deXuatLoTrinhThanhToan'
									label={intl.formatMessage({ id: 'taichinh.tragop.modal.lotrinh.label' })}
									rules={[...rules.required]}
								>
									<Input.TextArea
										rows={3}
										placeholder={intl.formatMessage({ id: 'taichinh.tragop.modal.lotrinh.place' })}
									/>
								</Form.Item>
							</>
						)}

						{hinhThucHoTro === EHinhThucHoTro.TRA_MUON && (
							<Form.Item
								name='ngayGiaHanYeuCau'
								label={intl.formatMessage({ id: 'taichinh.tragop.modal.giahan.label' })}
								rules={[
									...rules.required,
									...rules.sauNgay(minNgayGiaHan, intl.formatMessage({ id: 'taichinh.tragop.modal.giahan.label' })),
								]}
							>
								<MyDatePicker
									placeholder={intl.formatMessage({ id: 'taichinh.tragop.modal.giahan.place' })}
									disabledDate={(cur) => dayjs(cur).isSameOrBefore(minNgayGiaHan, 'day')}
								/>
							</Form.Item>
						)}

						<Form.Item name='taiLieuDinhKem' label={intl.formatMessage({ id: 'taichinh.tragop.modal.dinhkem.label' })}>
							<UploadFile maxCount={5} isPrivate />
						</Form.Item>

						<Form.Item
							name='camKet'
							valuePropName='checked'
							rules={[
								{
									validator: (_, value) =>
										value
											? Promise.resolve()
											: Promise.reject(intl.formatMessage({ id: 'taichinh.tragop.modal.camket.required' })),
								},
							]}
						>
							<Checkbox>{intl.formatMessage({ id: 'taichinh.tragop.modal.camket.label' })}</Checkbox>
						</Form.Item>

						<div style={{ textAlign: 'right' }}>
							<Button onClick={onClose} style={{ marginRight: 8 }}>
								{intl.formatMessage({ id: 'global.button.huy' })}
							</Button>
							<Button type='primary' htmlType='submit' loading={submitting} disabled={!camKet}>
								{intl.formatMessage({ id: 'taichinh.tragop.modal.guidangky' })}
							</Button>
						</div>
					</Form>
				)}
			</Spin>
		</Modal>
	);
};

export default ModalDangKyTraGop;
