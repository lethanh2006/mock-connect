import { Select } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectAttributesManagement = (props: {
	value?: string;
	onChange?: (val?: string) => void;
	multiple?: boolean;
	allowClear?: boolean;
	style?: React.CSSProperties;
	isSetRecord?: boolean;
	condition?: Partial<AttributesManagement.IRecord>;
	disabled?: boolean;
}) => {
	const intl = useIntl();
	const { value, onChange, multiple, allowClear, style, isSetRecord, condition, disabled } = props;
	const { danhSach, getAllModel } = useModel('cct.attributes');

	useEffect(() => {
		getAllModel(!!isSetRecord, { order: 1 }, { ...condition });
	}, [JSON.stringify(condition)]);

	const options = (danhSach || [])
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
			placeholder={intl.formatMessage({ id: 'attribute.select' })}
			style={{ width: '100%', ...style }}
		/>
	);
};

export default SelectAttributesManagement;
