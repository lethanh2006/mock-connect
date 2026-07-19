import { getRecaptchaSiteKey } from '@/utils/config';
import { Alert, Button, Col, Descriptions, Modal, Row } from 'antd';
import { useState } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useIntl, useModel } from 'umi';
import ModalLyDoDangKy, { type LyDoModalType } from './ModalLyDoDangKy';
import RenderLichHoc from './RenderLichHoc';

type ModalDangKyNgayProps = {
	visible: boolean;
	setVisible: (val: boolean) => void;
	isVuotTin?: boolean;
};

type ExecuteRecaptcha = (action?: string) => Promise<string>;

const ModalDangKyNgayContent = ({
	visible,
	setVisible,
	executeRecaptcha,
	isVuotTin,
}: ModalDangKyNgayProps & { executeRecaptcha?: ExecuteRecaptcha }) => {
	const intl = useIntl();
	const [errorMessage, setErrorMessage] = useState<string>();
	const [lyDoModalType, setLyDoModalType] = useState<LyDoModalType>();
	const { record, formSubmiting, setFormSubmiting } = useModel('lophocphan.lophocphan');
	const { dotDangKyHienTai, postDangKyTinChiModel, phieuDangKy, getPhieuDangKyModel, getLopDangKyModel } =
		useModel('daotao.dotdangkytinchi');
	const { khoaNganhMe } = useModel('sinhvien.sinhvien');

	const khoaNganh = khoaNganhMe?.khoaNganhChinh;

	const handleClose = () => {
		setErrorMessage(undefined);
		setLyDoModalType(undefined);
		setVisible(false);
	};

	const openLyDoModal = (type: LyDoModalType) => {
		setLyDoModalType(type);
	};

	const getErrorMessage = (er: any) =>
		er?.data?.message ||
		er?.response?.data?.message ||
		er?.detail?.message ||
		er?.message ||
		intl.formatMessage({
			id: isVuotTin ? 'dangkytinchi.dangkyngay.modal.vuottin.error' : 'dangkytinchi.dangkyngay.modal.error',
		});

	const reloadAfterDangKy = () => {
		if (dotDangKyHienTai?._id) {
			getPhieuDangKyModel(dotDangKyHienTai._id);
			getLopDangKyModel(dotDangKyHienTai.maHocKy);
		}
	};

	const postDangKy = async () => {
		try {
			setErrorMessage(undefined);
			setFormSubmiting(true);

			const recaptchaToken = executeRecaptcha ? await executeRecaptcha('DANG_KY_TIN_CHI') : undefined;

			await postDangKyTinChiModel(
				{
					phieuDktcId: phieuDangKy?._id ?? '',
					dangKy: {
						lopHocPhanId: record?._id ?? '',
						maKhoaNganh: khoaNganh?.ma ?? '',
					},
					...(recaptchaToken ? { recaptchaToken } : {}),
				},
				intl.formatMessage({ id: 'dangkytinchi.thongbao.dangky' }),
			);

			reloadAfterDangKy();
			handleClose();
		} catch (er: any) {
			setErrorMessage(getErrorMessage(er));
		} finally {
			setFormSubmiting(false);
		}
	};

	const handleLyDoSuccess = () => {
		reloadAfterDangKy();
		handleClose();
	};

	return (
		<>
			<Modal
				title={intl.formatMessage({
					id: isVuotTin ? 'dangkytinchi.dangkyngay.modal.vuottin.title' : 'dangkytinchi.dangkyngay.modal.title',
				})}
				open={visible}
				footer={null}
				onCancel={handleClose}
				width={1000}
				destroyOnClose
			>
				<Row gutter={[12, 12]}>
					<Col span={24}>
						<Alert
							type={isVuotTin ? 'warning' : 'info'}
							showIcon
							message={intl.formatMessage(
								{
									id: isVuotTin
										? 'dangkytinchi.dangkyngay.modal.vuottin.alert'
										: 'dangkytinchi.dangkyngay.modal.alert',
								},
								{ b: (chunks) => <b>{chunks}</b> },
							)}
						/>
					</Col>

					{errorMessage ? (
						<Col span={24}>
							<Alert type='error' showIcon message={errorMessage} />
						</Col>
					) : null}

					<Col span={24}>
						<Descriptions
							column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}
							className='highlight'
							layout='vertical'
							colon={false}
						>
							<Descriptions.Item label={intl.formatMessage({ id: 'dangkytinchi.dangkyngay.modal.malop' })}>
								{record?.maLop ?? record?.ten ?? '--'}
							</Descriptions.Item>

							<Descriptions.Item label={intl.formatMessage({ id: 'dangkytinchi.dangkyngay.modal.tenhocphan' })}>
								{record?.hocPhan?.ten ?? '--'}
							</Descriptions.Item>

							<Descriptions.Item label={intl.formatMessage({ id: 'dangkytinchi.dangkyngay.modal.giangvien' })}>
								{record?.nhanSuList?.length
									? record.nhanSuList
											.map((item) =>
												item.nhanSu?.ten ? `${item.nhanSu?.hoDem ?? ''} ${item.nhanSu?.ten ?? ''}` : item.tenNhanSu,
											)
											.join(', ')
									: '--'}
							</Descriptions.Item>

							<Descriptions.Item label={intl.formatMessage({ id: 'dangkytinchi.dangkyngay.modal.thongtinlophoc' })}>
								{record?._id ? <RenderLichHoc lopHocPhan={record} /> : '--'}
							</Descriptions.Item>
						</Descriptions>
					</Col>
				</Row>

				<div className='form-footer'>
					{isVuotTin ? (
						<Button type='primary' loading={formSubmiting} onClick={() => openLyDoModal('vuot_tin')}>
							{intl.formatMessage({ id: 'dangkytinchi.vuottin.button.dangkyvuottin' })}
						</Button>
					) : (
						<Button type='primary' loading={formSubmiting} onClick={postDangKy}>
							{intl.formatMessage({ id: 'dangkytinchi.dankylophocphan.action.dangky' })}
						</Button>
					)}

					<Button loading={formSubmiting} onClick={() => openLyDoModal('du_thinh')}>
						{intl.formatMessage({ id: 'dangkytinchi.dankylophocphan.action.dangkyduthinh' })}
					</Button>

					<Button onClick={handleClose}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Modal>

			<ModalLyDoDangKy type={lyDoModalType} onClose={() => setLyDoModalType(undefined)} onSuccess={handleLyDoSuccess} />
		</>
	);
};

const ModalDangKyNgayWithRecaptcha = (props: ModalDangKyNgayProps) => {
	const { executeRecaptcha } = useGoogleReCaptcha();

	return <ModalDangKyNgayContent {...props} executeRecaptcha={executeRecaptcha} />;
};

const ModalDangKyNgay = (props: ModalDangKyNgayProps) => {
	if (getRecaptchaSiteKey()) {
		return <ModalDangKyNgayWithRecaptcha {...props} />;
	}

	return <ModalDangKyNgayContent {...props} />;
};

export default ModalDangKyNgay;
