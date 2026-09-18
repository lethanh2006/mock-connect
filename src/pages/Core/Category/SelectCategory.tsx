import { getLocalizedName } from '@/utils/localeName';

import Select from '@/components/MySelect';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';

/** TODO: remove when visa category API is ready */
const VISA_MOCK_DATA = [
	{
		code: 'DH',
		name: 'Thị thực học tập, thực tập',
		nameEn: 'Study / Internship Visa',
	},
	{
		code: 'TT',
		name: 'Thị thực thăm thân',
		nameEn: 'Family / Dependent Visa',
	},
	{
		code: 'EV',
		name: 'Thị thực điện tử',
		nameEn: 'Electronic Visa (E-Visa)',
	},
	{
		code: 'DL',
		name: 'Thị thực du lịch',
		nameEn: 'Tourist Visa',
	},
	{
		code: 'LD1',
		name: 'Thị thực lao động - miễn giấy phép lao động',
		nameEn: 'Work Visa - Work Permit Exempt',
	},
	{
		code: 'LD2',
		name: 'Thị thực lao động - có giấy phép lao động',
		nameEn: 'Work Visa - Work Permit Required',
	},
	{
		code: 'VR',
		name: 'Thị thực thăm người thân hoặc mục đích khác',
		nameEn: 'Visit / Other Purpose Visa',
	},
	{
		code: 'NG3',
		name: 'Thị thực ngoại giao, lãnh sự và tổ chức quốc tế',
		nameEn: 'Diplomatic / Consular Visa',
	},
	{
		code: 'NG4',
		name: 'Thị thực thăm hoặc làm việc với cơ quan ngoại giao, lãnh sự',
		nameEn: 'Diplomatic / Consular Visit Visa',
	},
];

/** TODO: remove when disability category API is ready */
const DISABILITY_MOCK_DATA = [
	{
		code: '01',
		name: 'Khuyết tật vận động',
		nameEn: 'Physical Disability',
	},
	{
		code: '02',
		name: 'Khuyết tật nghe, nói',
		nameEn: 'Hearing and Speech Disability',
	},
	{
		code: '03',
		name: 'Khuyết tật nhìn',
		nameEn: 'Visual Disability',
	},
	{
		code: '04',
		name: 'Khuyết tật thần kinh, tâm thần',
		nameEn: 'Neurological and Mental Disability',
	},
	{
		code: '05',
		name: 'Khuyết tật trí tuệ',
		nameEn: 'Intellectual Disability',
	},
	{
		code: '06',
		name: 'Khuyết tật khác',
		nameEn: 'Other Disabilities',
	},
];

const SelectCategory = (props: {
	value?: string;
	onChange?: any;
	multiple?: boolean;
	loadData?: boolean;
	allowClear?: boolean;
	placeholder?: string;
	category?: string;
}) => {
	const intl = useIntl();
	const { value, onChange, multiple, allowClear, loadData, category, placeholder } = props;

	const { getAllModel } = useModel('core.category');
	const [data, setData] = useState<any[]>([]);

	useEffect(() => {
		if (loadData === false) return;

		if (category === 'visa') {
			setData(VISA_MOCK_DATA);
			return;
		}

		if (category === 'disability') {
			setData(DISABILITY_MOCK_DATA);
			return;
		}

		getAllModel(
			false,
			undefined,
			{
				category,
			},
			undefined,
			undefined,
			false,
		).then((res) => {
			setData(res || []);
		});
	}, [loadData, category]);

	return (
		<Select
			mode={multiple ? 'multiple' : undefined}
			value={value}
			allowClear={allowClear}
			onChange={onChange}
			options={data.map((item) => ({
				key: item._id ?? item.code,
				value: item.code,
				label: getLocalizedName(item, item.name, item.nameEn),
			}))}
			showSearch
			optionFilterProp='label'
			placeholder={placeholder ?? intl.formatMessage({ id: 'thongtincanhan.form.thongtinvisa.loaivisa.place' })}
			{...props}
		/>
	);
};

export default SelectCategory;
