import SelectNhanSuDebounce from '@/pages/ToChucNhanSu/NhanSu/Select';
import { PhieuDkCtdt } from '@/services/DaoTao/PhieuDkyCTDT/typing';
import { Checkbox, Collapse, Descriptions, Divider, Form, FormInstance } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import FormFooter from '../FormFooter';

interface StepSelectAdvisorProps {
	onPrevious: () => void;
	onNext: () => void;
	form: FormInstance<PhieuDkCtdt.UpdatePhieuDkCtdtMeDto>;
}

const StepSelectAdvisor = ({ onPrevious, onNext, form }: StepSelectAdvisorProps) => {
	const intl = useIntl();
	const { danhSach } = useModel('tochucnhansu.nhansu');
	const hasDiscussedWithAdvisor = form.getFieldValue('hasDiscussedWithAdvisor');
	const maCoVanHocTapPhu = form.getFieldValue('maCoVanHocTapPhu');
	const coVanHocTapPhu = danhSach?.find((item) => item.maCanBo === maCoVanHocTapPhu);
	const maCoVanHocTapChinh = form.getFieldValue('maCoVanHocTapChinh');
	const coVanHocTapChinh = danhSach?.find((item) => item.maCanBo === maCoVanHocTapChinh);

	// Auto chọn người đầu tiên khi chưa có giá trị và danhSach có dữ liệu
	useEffect(() => {
		if (danhSach?.length > 0 && !maCoVanHocTapChinh) {
			const firstPerson = danhSach[0];
			form.setFieldsValue({
				maCoVanHocTapChinh: firstPerson?.maCanBo,
				ssoIdCoVanHocTapChinh: firstPerson?.ssoId,
				hoTenCoVanHocTapChinh: firstPerson?.hoTen,
				emailCoVanHocTapChinh: firstPerson?.email,
			});
		}
	}, [danhSach, maCoVanHocTapChinh, form]);

	useEffect(() => {
		if (coVanHocTapChinh) {
			form.setFieldsValue({
				ssoIdCoVanHocTapChinh: coVanHocTapChinh?.ssoId,
				hoTenCoVanHocTapChinh: coVanHocTapChinh?.hoTen,
				emailCoVanHocTapChinh: coVanHocTapChinh?.email,
			});
		}
	}, [coVanHocTapChinh, form]);

	useEffect(() => {
		form.setFieldsValue({
			ssoIdCoVanHocTapPhu: coVanHocTapPhu?.ssoId,
			hoTenCoVanHocTapPhu: coVanHocTapPhu?.hoTen,
			emailCoVanHocTapPhu: coVanHocTapPhu?.email,
		});
	}, [coVanHocTapPhu, form]);

	return (
		<>
			<Divider orientation='left' dashed className='divider-big-title'>
				{intl.formatMessage({ id: 'minor.idm.advisor.facultyAdvisor' })}
			</Divider>

			<Form.Item
				label={intl.formatMessage({ id: 'minor.idm.advisor.facultyAdvisorLabel' })}
				name='maCoVanHocTapChinh'
				// rules={[...rules.required]}
			>
				<SelectNhanSuDebounce
					placeholder={intl.formatMessage({ id: 'minor.idm.advisor.selectPlaceholder' })}
					selectMa
					disabled
				/>
			</Form.Item>

			<Form.Item name='ssoIdCoVanHocTapChinh' hidden />
			<Form.Item name='hoTenCoVanHocTapChinh' hidden />
			<Form.Item name='emailCoVanHocTapChinh' hidden />

			<Descriptions
				size='small'
				column={2}
				colon={true}
				className='highlight'
				layout='vertical'
				items={[
					{
						key: 'name',
						label: intl.formatMessage({ id: 'minor.idm.advisor.name' }),
						children: form.getFieldValue('hoTenCoVanHocTapChinh') || '-',
					},
					{
						key: 'email',
						label: intl.formatMessage({ id: 'minor.idm.advisor.email' }),
						children: form.getFieldValue('emailCoVanHocTapChinh') || '-',
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

			<Collapse className='collapse-big-title' ghost defaultActiveKey={['1']} expandIconPosition='end'>
				<Collapse.Panel header={intl.formatMessage({ id: 'minor.idm.advisor.secondaryAdvisor' })} key='1'>
					<Form.Item name={'hasDiscussedWithAdvisor'} valuePropName='checked'>
						<Checkbox>{intl.formatMessage({ id: 'minor.idm.advisor.discussedConsent' })}</Checkbox>
					</Form.Item>
					{hasDiscussedWithAdvisor && (
						<Form.Item name='maCoVanHocTapPhu'>
							<SelectNhanSuDebounce
								placeholder={intl.formatMessage({ id: 'minor.idm.advisor.selectPlaceholder' })}
								selectMa
							/>
						</Form.Item>
					)}
					<Form.Item name='ssoIdCoVanHocTapPhu' hidden />
					<Form.Item name='hoTenCoVanHocTapPhu' hidden />
					<Form.Item name='emailCoVanHocTapPhu' hidden />
				</Collapse.Panel>
			</Collapse>

			<FormFooter showPrevious onPrevious={onPrevious} onNext={onNext} />
		</>
	);
};

export default StepSelectAdvisor;
