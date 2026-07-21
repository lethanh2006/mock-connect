import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Alert, Button, Form, Input, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';

export type LyDoModalType = 'du_thinh' | 'vuot_tin';

type ModalLyDoDangKyProps = {
	type?: LyDoModalType;
	onClose: () => void;
	onSuccess: () => void;
};

const ModalLyDoDangKy = ({ type, onClose, onSuccess }: ModalLyDoDangKyProps) => {
	const intl = useIntl();
	const [form] = Form.useForm<{ lyDo: string }>();
	const [errorMessage, setErrorMessage] = useState<string>();
	const { record, formSubmiting, setFormSubmiting } = useModel('lophocphan.lophocphan');
	const { dotDangKyHienTai, phieuDangKy } = useModel('daotao.dotdangkytinchi');
	const { postModel: postDkVuotTinChiLopModel } = useModel('daotao.dkvuottinchi');
	const { postModel: postDangKyHocDuThinhModel } = useModel('daotao.dangkyhocduthinh');

	useEffect(() => {
		if (!type) resetFieldsForm(form);
	}, [type]);

	const handleClose = () => {
		setErrorMessage(undefined);
		resetFieldsForm(form);
		onClose();
	};

	const getErrorMessage = (er: any) =>
		er?.data?.message ||
		er?.response?.data?.message ||
		er?.detail?.message ||
		er?.message ||
		intl.formatMessage({
			id: type === 'vuot_tin' ? 'dangkytinchi.dangkyngay.modal.vuottin.error' : 'dangkytinchi.dangkyngay.modal.error',
		});

	const onFinish = async (values: { lyDo: string }) => {
		const lyDo = values.lyDo.trim();
		if (!type) return;

		try {
			setErrorMessage(undefined);
			setFormSubmiting(true);

			if (type === 'vuot_tin') {
				await postDkVuotTinChiLopModel(
					{
						idPhieuDktc: phieuDangKy?._id ?? '',
						lopHocPhanId: record?._id ?? '',
						maHocKy: dotDangKyHienTai?.maHocKy ?? '',
						lyDo: lyDo,
					},
					() => {},
					false,
					intl.formatMessage({ id: 'dangkytinchi.thongbao.dangkyvuottin' }),
					'me',
				);
			} else {
				await postDangKyHocDuThinhModel(
					{
						maHocKy: dotDangKyHienTai?.maHocKy ?? '',
						lopHocPhanId: record?._id ?? '',
						lyDo,
					},
					() => {},
					false,
					intl.formatMessage({ id: 'dangkytinchi.thongbao.dangkyduthinh' }),
					'me',
				);
			}

			onSuccess();
		} catch (er: any) {
			setErrorMessage(getErrorMessage(er));
		} finally {
			setFormSubmiting(false);
		}
	};

	const title =
		type === 'vuot_tin'
			? intl.formatMessage({ id: 'dangkytinchi.dangkyngay.modal.vuottin.lydo.title' })
			: intl.formatMessage({ id: 'dangkytinchi.dangkyngay.modal.duthinh.title' });

	return (
		<Modal
			title={title}
			open={!!type}
			footer={null}
			onCancel={handleClose}
			width={600}
			destroyOnClose
			maskClosable={false}
		>
			{errorMessage ? <Alert type='error' showIcon message={errorMessage} style={{ marginBottom: 12 }} /> : null}

			<Form form={form} layout='vertical' onFinish={onFinish}>
				<Form.Item
					label={intl.formatMessage({ id: 'dangkytinchi.dangkyngay.modal.lydo' })}
					name='lyDo'
					rules={[
						{
							required: true,
							whitespace: true,
							...rules.length(500),
						},
					]}
				>
					<Input.TextArea
						rows={4}

						placeholder={intl.formatMessage({ id: 'dangkytinchi.dangkyngay.modal.lydo.placeholder' })}
					/>
				</Form.Item>

				<div className='form-footer'>
					<Button type='primary' htmlType='submit' loading={formSubmiting}>
						{intl.formatMessage({ id: 'global.button.xacnhan' })}
					</Button>
					<Button onClick={handleClose}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default ModalLyDoDangKy;
