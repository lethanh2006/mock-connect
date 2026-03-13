import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectQuyDoiDiem = (props: {
	value?: string;
	onChange?: (id: string) => void;
	hasCreate?: boolean;
	multiple?: boolean;
	allowClear?: boolean;
	disabled?: boolean;
	placeholder?: string;
	style?: React.CSSProperties;
}) => {
	const { value, onChange, multiple, allowClear, placeholder, disabled, style } = props;
	const { danhSach, getAllModel } = useModel('daotao.dmquydoidiem');

	useEffect(() => {
		if (!danhSach.length) getAllModel();
	}, []);

	return (
		<Select
			mode={multiple ? 'multiple' : undefined}
			disabled={disabled}
			allowClear={allowClear}
			value={value}
			onChange={onChange}
			options={danhSach.map((item) => ({
				key: item._id,
				value: item.diemChu,
				label: item.diemChu,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder={placeholder ?? 'Chọn điểm chữ'}
			style={{ width: '100%', ...style }}
			showArrow
		/>
	);
};

export default SelectQuyDoiDiem;
