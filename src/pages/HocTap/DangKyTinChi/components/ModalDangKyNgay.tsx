import { Button, IconInfoCircle } from '@/components/Icons';
import ModalExpandable from '@/components/Table/ModalExpandable';
import { getRecaptchaSiteKey } from '@/utils/config';
import { Alert } from 'antd';
import { useState } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useIntl, useModel } from 'umi';
import ModalLyDoDangKy, { type LyDoModalType } from './ModalLyDoDangKy';
import RenderLichHoc from './RenderLichHoc';
import './style.less';

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
			<ModalExpandable
				title={intl.formatMessage({
					id: isVuotTin ? 'dangkytinchi.dangkyngay.modal.vuottin.title' : 'dangkytinchi.dangkyngay.modal.title',
				})}
				open={visible}
				footer={null}
				onCancel={handleClose}
				width={1080}
				destroyOnClose
			>
				<div className='dang-ky-ngay-confirm'>
					<div className='dang-ky-ngay-confirm__message'>
						<span className='dang-ky-ngay-confirm__info'>
							<IconInfoCircle size={20} />
						</span>
						<span className='dang-ky-ngay-confirm__message-text'>
							{intl.formatMessage(
								{
									id: isVuotTin ? 'dangkytinchi.dangkyngay.modal.vuottin.alert' : 'dangkytinchi.dangkyngay.modal.alert',
								},
								{ b: (chunks) => <b>{chunks}</b> },
							)}
						</span>
					</div>

					{errorMessage ? <Alert type='error' showIcon message={errorMessage} /> : null}

					<div className='dang-ky-ngay-confirm__fields'>
						<div className='dang-ky-ngay-confirm__card'>
							<div className='dang-ky-ngay-confirm__grid'>
								<div className='dang-ky-ngay-confirm__field'>
									<span className='dang-ky-ngay-confirm__label'>
										{intl.formatMessage({ id: 'dangkytinchi.dangkyngay.modal.malop' })}
									</span>
									<span className='dang-ky-ngay-confirm__value'>{record?.maLop ?? record?.ten ?? '--'}</span>
								</div>

								<div className='dang-ky-ngay-confirm__field'>
									<span className='dang-ky-ngay-confirm__label'>
										{intl.formatMessage({ id: 'dangkytinchi.dangkyngay.modal.tenhocphan' })}
									</span>
									<span className='dang-ky-ngay-confirm__value'>{record?.hocPhan?.ten ?? '--'}</span>
								</div>

								<div className='dang-ky-ngay-confirm__field'>
									<span className='dang-ky-ngay-confirm__label'>
										{intl.formatMessage({ id: 'dangkytinchi.dangkyngay.modal.giangvien' })}
									</span>
									<span className='dang-ky-ngay-confirm__value'>
										{record?.nhanSuList?.length
											? record.nhanSuList
													.map((item) =>
														item.nhanSu?.ten ? `${item.nhanSu?.hoDem ?? ''} ${item.nhanSu?.ten ?? ''}` : item.tenNhanSu,
													)
													.join(', ')
											: '--'}
									</span>
								</div>

								<div className='dang-ky-ngay-confirm__field'>
									<span className='dang-ky-ngay-confirm__label'>
										{intl.formatMessage({ id: 'dangkytinchi.dangkyngay.modal.thongtinlophoc' })}
									</span>
									<span className='dang-ky-ngay-confirm__value'>
										{record?._id ? <RenderLichHoc lopHocPhan={record} /> : '--'}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className='form-footer'>
					{isVuotTin ? (
						<Button variant='default' loading={formSubmiting} onClick={() => openLyDoModal('vuot_tin')}>
							{intl.formatMessage({ id: 'dangkytinchi.vuottin.button.dangkyvuottin' })}
						</Button>
					) : (
						<Button variant='default' loading={formSubmiting} onClick={postDangKy}>
							{intl.formatMessage({ id: 'dangkytinchi.dankylophocphan.action.dangky' })}
						</Button>
					)}

					<Button variant='outline' loading={formSubmiting} onClick={() => openLyDoModal('du_thinh')}>
						{intl.formatMessage({ id: 'dangkytinchi.dankylophocphan.action.dangkyduthinh' })}
					</Button>

					<Button variant='outline' onClick={handleClose}>
						{intl.formatMessage({ id: 'global.button.huy' })}
					</Button>
				</div>
			</ModalExpandable>

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
