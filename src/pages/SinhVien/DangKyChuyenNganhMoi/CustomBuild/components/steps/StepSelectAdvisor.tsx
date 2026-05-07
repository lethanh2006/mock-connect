import SelectDonVi from '@/pages/ToChucNhanSu/DonVi/Select';
import SelectNhanSuDebounce from '@/pages/ToChucNhanSu/NhanSu/Select';
import SelectNhanSuTheoDonVi from '@/pages/ToChucNhanSu/NhanSu/SelectByDonVi';
import { PhieuDkCtdt } from '@/services/DaoTao/PhieuDkyCTDT/typing';
import { Checkbox, Descriptions, Divider, Form, FormInstance } from 'antd';
import { useEffect, useRef } from 'react';
import { useIntl, useModel } from 'umi';
import FormFooter from '../FormFooter';

interface StepSelectAdvisorProps {
	onPrevious: () => void;
	onNext: () => void;
	onSaveDraft?: () => void;
	isMinor?: boolean;
	form: FormInstance<PhieuDkCtdt.UpdatePhieuDkCtdtMeDto>;
	loading?: boolean;
	canEdit?: boolean;
}

const StepSelectAdvisor = ({
	onPrevious,
	onNext,
	onSaveDraft,
	isMinor = false,
	form,
	loading,
	canEdit,
}: StepSelectAdvisorProps) => {
	const intl = useIntl();
	const { danhSach, getModel } = useModel('tochucnhansu.nhansu');
	const fetchedPrimarySso = useRef<string | null>(null);
	const fetchedSecondarySso = useRef<string | null>(null);
	const selectedDonViId = Form.useWatch('idDonViPhuTrach', form);

	const ssoIdCoVanHocTapPhu = Form.useWatch('ssoIdCoVanHocTapPhu', form);
	const maCoVanHocTapPhu = Form.useWatch('maCoVanHocTapPhu', form);
	const coVanHocTapPhu = danhSach?.find((item) =>
		maCoVanHocTapPhu ? item.maCanBo === maCoVanHocTapPhu : item.ssoId === ssoIdCoVanHocTapPhu,
	);
	const ssoIdCoVanHocTapChinh = Form.useWatch('ssoIdCoVanHocTapChinh', form);
	const maCoVanHocTapChinh = Form.useWatch('maCoVanHocTapChinh', form);
	const hoTenCoVanHocTapChinh = Form.useWatch('hoTenCoVanHocTapChinh', form);
	const emailCoVanHocTapChinh = Form.useWatch('emailCoVanHocTapChinh', form);
	const coVanHocTapChinh = danhSach?.find((item) =>
		maCoVanHocTapChinh ? item.maCanBo === maCoVanHocTapChinh : item.ssoId === ssoIdCoVanHocTapChinh,
	);

	useEffect(() => {
		if (!isMinor) return;
		if (!selectedDonViId) {
			form.setFieldsValue({
				maCoVanHocTapPhu: undefined,
				ssoIdCoVanHocTapPhu: undefined,
				hoTenCoVanHocTapPhu: undefined,
				emailCoVanHocTapPhu: undefined,
			});
		}
	}, [isMinor, selectedDonViId, form]);

	useEffect(() => {
		if (coVanHocTapChinh) {
			form.setFieldsValue({
				maCoVanHocTapChinh: coVanHocTapChinh?.maCanBo,
				ssoIdCoVanHocTapChinh: coVanHocTapChinh?.ssoId,
				hoTenCoVanHocTapChinh: coVanHocTapChinh?.hoTen,
				emailCoVanHocTapChinh: coVanHocTapChinh?.email || coVanHocTapChinh?.emailCanBo,
			});
		}
	}, [coVanHocTapChinh, form]);

	useEffect(() => {
		const fetchPrimaryAdvisorBySso = async () => {
			if (
				!ssoIdCoVanHocTapChinh ||
				!!maCoVanHocTapChinh ||
				coVanHocTapChinh ||
				fetchedPrimarySso.current === ssoIdCoVanHocTapChinh
			)
				return;
			fetchedPrimarySso.current = ssoIdCoVanHocTapChinh;
			const ds = await getModel(
				{ ssoId: ssoIdCoVanHocTapChinh },
				undefined,
				undefined,
				1,
				1,
				'sinh-vien/page',
				undefined,
				false,
			);
			const advisor = ds?.[0];
			if (!advisor) return;
			form.setFieldsValue({
				maCoVanHocTapChinh: advisor?.maCanBo,
				ssoIdCoVanHocTapChinh: advisor?.ssoId,
				hoTenCoVanHocTapChinh: advisor?.hoTen,
				emailCoVanHocTapChinh: advisor?.email || advisor?.emailCanBo,
			});
		};

		fetchPrimaryAdvisorBySso();
	}, [ssoIdCoVanHocTapChinh, maCoVanHocTapChinh, coVanHocTapChinh]);

	useEffect(() => {
		if (coVanHocTapPhu) {
			form.setFieldsValue({
				maCoVanHocTapPhu: coVanHocTapPhu?.maCanBo,
				ssoIdCoVanHocTapPhu: coVanHocTapPhu?.ssoId,
				hoTenCoVanHocTapPhu: coVanHocTapPhu?.hoTen,
				emailCoVanHocTapPhu: coVanHocTapPhu?.email || coVanHocTapPhu?.emailCanBo,
			});
		}
	}, [coVanHocTapPhu, form]);

	useEffect(() => {
		const fetchSecondaryAdvisorBySso = async () => {
			if (
				!ssoIdCoVanHocTapPhu ||
				!!maCoVanHocTapPhu ||
				coVanHocTapPhu ||
				fetchedSecondarySso.current === ssoIdCoVanHocTapPhu
			)
				return;
			fetchedSecondarySso.current = ssoIdCoVanHocTapPhu;
			const ds = await getModel(
				{ ssoId: ssoIdCoVanHocTapPhu },
				undefined,
				undefined,
				1,
				1,
				'sinh-vien/page',
				undefined,
				false,
			);
			const advisor = ds?.[0];
			if (!advisor) return;
			form.setFieldsValue({
				maCoVanHocTapPhu: advisor?.maCanBo,
				ssoIdCoVanHocTapPhu: advisor?.ssoId,
				hoTenCoVanHocTapPhu: advisor?.hoTen,
				emailCoVanHocTapPhu: advisor?.email || advisor?.emailCanBo,
			});
		};

		fetchSecondaryAdvisorBySso();
	}, [ssoIdCoVanHocTapPhu, maCoVanHocTapPhu, coVanHocTapPhu]);

	return (
		<>
			<Divider orientation='left' dashed className='divider-big-title'>
				{intl.formatMessage({ id: 'minor.idm.advisor.facultyAdvisor' })}
			</Divider>

			<Form.Item name='maCoVanHocTapChinh' hidden />
			<Form.Item name='ssoIdCoVanHocTapChinh' hidden />
			<Form.Item name='hoTenCoVanHocTapChinh' hidden />
			<Form.Item name='emailCoVanHocTapChinh' hidden />

			<Descriptions
				size='small'
				column={2}
				colon={true}
				className='highlight'
				layout='horizontal'
				items={[
					{
						key: 'name',
						label: intl.formatMessage({ id: 'minor.idm.advisor.name' }),
						children: hoTenCoVanHocTapChinh || '-',
					},
					{
						key: 'email',
						label: intl.formatMessage({ id: 'minor.idm.advisor.email' }),
						children: emailCoVanHocTapChinh || '-',
					},
					{
						key: 'college',
						label: intl.formatMessage({ id: 'minor.idm.advisor.college' }),
						children: '-',
					},
					{
						key: 'expertise',
						label: intl.formatMessage({ id: 'minor.idm.advisor.expertise' }),
						children: '-',
					},
				]}
			/>

			<Divider orientation='left' dashed className='divider-big-title'>
				{intl.formatMessage({ id: 'minor.idm.advisor.secondaryAdvisor' })}
			</Divider>

			{isMinor && (
				<Form.Item
					label={
						<div>
							<div>{intl.formatMessage({ id: 'minor.idm.advisor.responsibleUnit' })}</div>
							<div style={{ fontWeight: 400, marginTop: 4, color: 'var(--color-text-secondary)', fontSize: '13px' }}>
								{isMinor
									? intl.formatMessage({ id: 'minor.idm.advisor.responsibleUnit.description.minor' })
									: intl.formatMessage({ id: 'minor.idm.advisor.responsibleUnit.description.concentration' })}
							</div>
						</div>
					}
					name='maDonViPhuTrach'
					rules={[
						{
							required: true,
							message: intl.formatMessage(
								{ id: 'minor.idm.advisor.responsibleUnit.error.required' },
								{ defaultMessage: 'Vui lòng chọn Đơn vị phụ trách' },
							),
						},
					]}
				>
					<SelectDonVi
						fieldValue='maDonVi'
						allowClear
						placeholder={intl.formatMessage({ id: 'minor.idm.advisor.responsibleUnitPlaceholder' })}
						onChange={(val: string, option: any) => {
							form.setFieldsValue({
								tenDonViPhuTrach: option?.rawData?.ten,
								idDonViPhuTrach: option?.rawData?._id,
								maCoVanHocTapPhu: undefined,
								ssoIdCoVanHocTapPhu: undefined,
								hoTenCoVanHocTapPhu: undefined,
								emailCoVanHocTapPhu: undefined,
							});
						}}
					/>
				</Form.Item>
			)}
			<Form.Item
				label={
					<div>
						<div>{intl.formatMessage({ id: 'minor.idm.advisor.secondaryAdvisor' })}</div>
						<div style={{ fontWeight: 400, marginTop: 4, color: 'var(--color-text-secondary)', fontSize: '13px' }}>
							{intl.formatMessage({ id: 'minor.idm.advisor.secondaryAdvisor.description' })}
						</div>
					</div>
				}
				name='maCoVanHocTapPhu'
				rules={[
					{
						validator: (_, value) => {
							if (!value) return Promise.resolve();
							const selectedAdvisor = danhSach?.find((item) => item.maCanBo === value);
							const duplicateByMa = !!maCoVanHocTapChinh && value === maCoVanHocTapChinh;
							const duplicateBySso = !!ssoIdCoVanHocTapChinh && selectedAdvisor?.ssoId === ssoIdCoVanHocTapChinh;
							if (!duplicateByMa && !duplicateBySso) return Promise.resolve();
							return Promise.reject(
								new Error(intl.formatMessage({ id: 'minor.idm.advisor.error.duplicateSecondaryAdvisor' })),
							);
						},
					},
				]}
			>
				{isMinor ? (
					selectedDonViId ? (
						<SelectNhanSuTheoDonVi
							donViId={selectedDonViId}
							allowClear
							placeholder={intl.formatMessage({ id: 'minor.idm.advisor.selectPlaceholder' })}
							onChange={(value, option) => {
								const rawData = option?.rawData;
								form.setFieldsValue({
									maCoVanHocTapPhu: rawData?.thongTinNhanSu?.maCanBo ?? value,
									ssoIdCoVanHocTapPhu: rawData?.thongTinNhanSu?.ssoId ?? value,
									hoTenCoVanHocTapPhu:
										`${rawData?.thongTinNhanSu?.hoDem ?? ''} ${rawData?.thongTinNhanSu?.ten ?? ''}`.trim(),
									emailCoVanHocTapPhu: rawData?.thongTinNhanSu?.email ?? rawData?.thongTinNhanSu?.emailCanBo,
								});
							}}
						/>
					) : (
						<SelectDonVi disabled placeholder={intl.formatMessage({ id: 'minor.idm.advisor.selectPlaceholder' })} />
					)
				) : (
					<SelectNhanSuDebounce
						placeholder={intl.formatMessage({ id: 'minor.idm.advisor.selectPlaceholder' })}
						selectMa
						onChange={(value, option) => {
							form.setFieldsValue({
								maCoVanHocTapPhu: value as string,
								ssoIdCoVanHocTapPhu: option?.rawData?.ssoId ?? undefined,
								hoTenCoVanHocTapPhu: option?.rawData?.hoTen ?? undefined,
								emailCoVanHocTapPhu: option?.rawData?.email ?? option?.rawData?.emailCanBo,
							});
						}}
					/>
				)}
			</Form.Item>
			<Divider orientation='left' dashed />
			<Form.Item
				name={'hasDiscussedWithAdvisor'}
				valuePropName='checked'
				style={{ marginTop: -8 }}
				rules={[
					{
						validator: (_, value) =>
							value
								? Promise.resolve()
								: Promise.reject(
										new Error(intl.formatMessage({ id: 'minor.idm.advisor.error.discussedConsentRequired' })),
									),
					},
				]}
			>
				<Checkbox>
					<i>{intl.formatMessage({ id: 'minor.idm.advisor.discussedConsent' })}</i>
				</Checkbox>
			</Form.Item>
			<Form.Item name='ssoIdCoVanHocTapPhu' hidden />
			<Form.Item name='hoTenCoVanHocTapPhu' hidden />
			<Form.Item name='emailCoVanHocTapPhu' hidden />
			<Form.Item name='tenDonViPhuTrach' hidden />

			<FormFooter showPrevious onPrevious={onPrevious} onNext={onNext} onSaveDraft={onSaveDraft} loading={loading} />
		</>
	);
};

export default StepSelectAdvisor;
