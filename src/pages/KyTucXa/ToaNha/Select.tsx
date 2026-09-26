import VinSelect from '@/components/VinSelect';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectToaNhaKTX = (props: {
	value?: string;
	onChange?: (val: string | string[], option: any) => void;
	multiple?: boolean;
	allowClear?: boolean;
	style?: React.CSSProperties;
	isSetRecord?: boolean;
	condition?: Partial<ToaNha.IRecord>;
	disabled?: boolean;
}) => {
	const intl = useIntl();
	const { value, onChange, multiple, allowClear, style, isSetRecord, condition, disabled } = props;
	const { danhSach, getAllModel, loading } = useModel('kytucxa.toanha');

	useEffect(() => {
		getAllModel(!!isSetRecord, undefined, { ...condition }, undefined, 'ktx');
	}, [JSON.stringify(condition)]);

	const options = (danhSach || []).map((item) => ({
		key: item._id,
		value: item._id,
		label: item.ten,
		rawData: item,
	}));

	return (
		<VinSelect
			loading={loading}
			disabled={disabled}
			mode={multiple ? 'multiple' : undefined}
			allowClear={allowClear}
			value={value}
			onChange={onChange}
			options={options}
			showSearch
			optionFilterProp='label'
			placeholder={intl.formatMessage({ id: 'kytucxa.dangky.filter.selectToaNha' })}
			style={{ width: '100%', ...style }}
		/>
	);
};

export default SelectToaNhaKTX;
