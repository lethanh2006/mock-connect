import { DANH_SACH_QUOC_TICH } from '@/services/Core/QuocTich/danhSach';
import { getLocalizedName } from '@/utils/localeName';
import { Select } from 'antd';
import { useIntl } from 'umi';

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
	disabled?: boolean;
}) => {
	const intl = useIntl();
	const { value, onChange, multiple, allowClear, placeholder, selectTen, disabled } = props;

	return (
		<Select
			mode={multiple ? 'multiple' : undefined}
			value={value}
			allowClear={allowClear}
			disabled={disabled}
			onChange={onChange}
			options={DANH_SACH_QUOC_TICH.map((item) => ({
				key: item.ma,
				value: selectTen ? item.tenQuocTich : item.ma,
				label: `${getLocalizedName(item, item.tenQuocTich, item.tenQuocTichEn)} - ${item.ma}`,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder={placeholder ?? intl.formatMessage({ id: 'thongtincanhan.form.quoctich.place' })}
		/>
	);
};

export default SelectQuocTich;
