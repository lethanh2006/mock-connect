import UploadFile from '@/components/Upload/UploadFile';
import { checkEligibleTraGop, postYeuCauTraGop } from '@/services/TaiChinh/TraGop';
import type { TraGop } from '@/services/TaiChinh/TraGop/typing';
import type { HoaDon } from '@/services/TaiChinh/HoaDon/typing';
import { buildUpLoadMultiFile } from '@/services/uploadFile';
import { inputFormat } from '@/utils/utils';
import rules from '@/utils/rules';
import { Alert, Button, Empty, Form, Input, InputNumber, Modal, Spin, message } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl } from 'umi';

interface ModalDangKyTraGopProps {
	visible: boolean;
	bill?: HoaDon.IRecord;
	onClose: () => void;
	onSuccess?: () => void;
}

const ModalDangKyTraGop: React.FC<ModalDangKyTraGopProps> = ({ visible, bill, onClose, onSuccess }) => {
	const intl = useIntl();
	const [form] = Form.useForm();
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

	const handleSubmit = async (values: { soLanTraGopYeuCau: number; lyDo: string; taiLieuDinhKem?: any }) => {
		if (!bill?._id) return;

		try {
			setSubmitting(true);
			const taiLieuDinhKem = await buildUpLoadMultiFile(values, 'taiLieuDinhKem');
			await postYeuCauTraGop({
				billId: bill._id,
				soLanTraGopYeuCau: values.soLanTraGopYeuCau,
				lyDo: values.lyDo,
				taiLieuDinhKem: taiLieuDinhKem ?? undefined,
			});
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
					<Form layout='vertical' form={form} onFinish={handleSubmit}>
						<Alert
							type='info'
							showIcon
							style={{ marginBottom: 16 }}
							message={intl.formatMessage(
								{ id: 'taichinh.tragop.modal.tongtien' },
								{ tongTien: `${inputFormat(eligibleData.tongTien ?? 0)} VND` },
							)}
						/>
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
							name='lyDo'
							label={intl.formatMessage({ id: 'taichinh.tragop.modal.lydo.label' })}
							rules={[...rules.required]}
						>
							<Input.TextArea rows={4} placeholder={intl.formatMessage({ id: 'taichinh.tragop.modal.lydo.place' })} />
						</Form.Item>
						<Form.Item name='taiLieuDinhKem' label={intl.formatMessage({ id: 'taichinh.tragop.modal.dinhkem.label' })}>
							<UploadFile maxCount={5} />
						</Form.Item>

						<div style={{ textAlign: 'right' }}>
							<Button onClick={onClose} style={{ marginRight: 8 }}>
								{intl.formatMessage({ id: 'global.button.huy' })}
							</Button>
							<Button type='primary' htmlType='submit' loading={submitting}>
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
