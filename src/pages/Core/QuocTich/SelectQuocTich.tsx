import { Select } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectQuocTich = (props: {
	value?: string;
	onChange?: any;
	multiple?: boolean;
	loadData?: boolean;
	allowClear?: boolean;
	placeholder?: string;
	selectTen?: boolean;
}) => {
	const intl = useIntl();
	const { value, onChange, multiple, loadData, allowClear, placeholder, selectTen } = props;
	const { danhSach, getAllModel } = useModel('core.quoctich');

	useEffect(() => {
		if (loadData !== false) getAllModel();
	}, []);

	return (
		<Select
			mode={multiple ? 'multiple' : undefined}
			value={value}
			allowClear={allowClear}
			onChange={onChange}
			options={danhSach.map((item) => ({
				key: item._id,
				value: selectTen ? item.tenQuocTich : item._id,
				label: `${item.tenQuocTich} - ${item.ma}`,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder={placeholder ?? intl.formatMessage({ id: 'thongtincanhan.form.quoctich.place' })}
		/>
	);
};

export default SelectQuocTich;
