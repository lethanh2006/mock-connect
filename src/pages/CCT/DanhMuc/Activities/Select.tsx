import VinSelect from '@/components/VinSelect';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

/**
 * Select Căn cứ pháp lý để cho vào FormItem
 */
const SelectActivitiesManagement = (props: {
	value?: string;
	onChange?: (val: string | string[], option: any) => void;
	multiple?: boolean;
	allowClear?: boolean;
	style?: React.CSSProperties;
	isSetRecord?: boolean;
	condition?: Partial<ActivitiesManagement.IRecord>;
	disabled?: boolean;
}) => {
	const intl = useIntl();
	const { value, onChange, multiple, allowClear, style, isSetRecord, condition, disabled } = props;
	const { danhSach, getAllModel } = useModel('cct.activities');

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
		<VinSelect
			disabled={disabled}
			mode={multiple ? 'multiple' : undefined}
			allowClear={allowClear}
			value={value}
			onChange={onChange}
			options={options}
			showSearch
			optionFilterProp='label'
			allowDeselect={false}
			placeholder={intl.formatMessage({ id: 'activity.type.select' })}
			style={style}
		/>
	);
};

export default SelectActivitiesManagement;
