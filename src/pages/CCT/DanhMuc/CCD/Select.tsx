import { Select } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

/**
 * Select Căn cứ pháp lý để cho vào FormItem
 */
const SelectActivitiesTypeDomain = (props: {
	value?: string;
	onChange?: (val: string | string[], option: any) => void;
	multiple?: boolean;
	allowClear?: boolean;
	style?: React.CSSProperties;
	isSetRecord?: boolean;
	condition?: Partial<ActivitiesTypeDomain.IRecord>;
	disabled?: boolean;
}) => {
	const intl = useIntl();
	const { value, onChange, multiple, allowClear, style, isSetRecord, condition, disabled } = props;
	const { danhSach, getAllModel } = useModel('cct.ccd');

	useEffect(() => {
		getAllModel(!!isSetRecord, { order: 1 }, { ...condition });
	}, [JSON.stringify(condition)]);

	const fixedOption = {
		key: 'award-recognition',
		value: 'award-recognition',
		label: 'Award & Recognition',
		rawData: null,
	};

	const dynamicOptions = (danhSach || [])
		.filter((item) => {
			if (item.isActive) return true;

			if (multiple && Array.isArray(value)) {
				return value.includes(item._id);
			}

			return item._id === value;
		})
		.map((item) => ({
			key: item._id,
			value: item._id,
			label: item.name,
			rawData: item,
		}));

	const options = [...dynamicOptions, fixedOption];

	return (
		<Select
			disabled={disabled}
			mode={multiple ? 'multiple' : undefined}
			allowClear={allowClear}
			value={value}
			onChange={onChange}
			options={options}
			showSearch
			optionFilterProp='label'
			placeholder={intl.formatMessage({ id: 'ccd.select' })}
			style={{ width: '100%', ...style }}
		/>
	);
};

export default SelectActivitiesTypeDomain;
