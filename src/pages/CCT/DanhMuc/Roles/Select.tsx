import { Select } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectRolesManagement = (props: {
	value?: string;
	onChange?: (val: string | string[], option: any) => void;
	multiple?: boolean;
	allowClear?: boolean;
	style?: React.CSSProperties;
	isSetRecord?: boolean;
	condition?: Partial<RolesManagement.IRecord>;
	disabled?: boolean;
	size?: 'small' | 'middle' | 'large';
}) => {
	const intl = useIntl();
	const { value, onChange, multiple, allowClear, style, isSetRecord, condition, disabled, size } = props;
	const { danhSach, getAllModel } = useModel('cct.roles');

	useEffect(() => {
		getAllModel(!!isSetRecord, { order: 1 }, { ...condition, isActive: true });
	}, [JSON.stringify(condition)]);

	return (
		<Select
			size={size}
			disabled={disabled}
			mode={multiple ? 'multiple' : undefined}
			allowClear={allowClear}
			value={value}
			onChange={onChange}
			options={danhSach.map((item) => ({
				key: item._id,
				value: item._id,
				label: item.name,
				rawData: item,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder={intl.formatMessage({ id: 'activity.role.select' })}
			style={{ width: '100%', ...style }}
		/>
	);
};

export default SelectRolesManagement;
